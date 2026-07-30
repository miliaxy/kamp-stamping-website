#!/usr/bin/env python3
"""Update the KAMP aluminium price snapshot from Hindalco's official PDFs."""

from __future__ import annotations

import argparse
import io
import json
import re
import ssl
import sys
from datetime import date, datetime, timedelta, timezone
from html.parser import HTMLParser
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

from pypdf import PdfReader


SOURCE_PAGE = "https://www.hindalco.com/businesses/aluminium/primary-aluminium/primary-metal-price"
DATA_PATH = (
    Path(__file__).resolve().parents[1]
    / "app"
    / "resources"
    / "aluminium-buying-guide"
    / "aluminium-prices.json"
)
ALLOWED_HOSTS = {"hindalco.com", "www.hindalco.com"}
MAX_DOWNLOAD_BYTES = 8 * 1024 * 1024
PRODUCT_PATTERN = re.compile(
    r"6201\s+Alloy\s+Wire\s+Rod.*?\(HAC-1\)\s*([0-9][0-9,\s]{4,14})",
    re.IGNORECASE,
)
URL_DATE_PATTERN = re.compile(
    r"primary-ready-reckoner-(\d{1,2})-([a-z]+)-(\d{4})\.pdf",
    re.IGNORECASE,
)
TEXT_DATE_PATTERN = re.compile(r"(\d{1,2})\.(\d{1,2})\.(\d{4})")
MONTHS = {
    month.lower(): index
    for index, month in enumerate(
        (
            "",
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        )
    )
    if month
}


def create_ssl_context() -> ssl.SSLContext:
    macos_ca_bundle = Path("/etc/ssl/cert.pem")
    if sys.platform == "darwin" and macos_ca_bundle.exists():
        return ssl.create_default_context(cafile=macos_ca_bundle)
    return ssl.create_default_context()


SSL_CONTEXT = create_ssl_context()


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[tuple[str, str]] = []
        self._href: str | None = None
        self._text: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() != "a":
            return
        self._href = dict(attrs).get("href")
        self._text = []

    def handle_data(self, data: str) -> None:
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "a" and self._href is not None:
            self.links.append((self._href, " ".join(self._text).strip()))
            self._href = None
            self._text = []


def fetch_bytes(url: str) -> bytes:
    request = Request(
        url,
        headers={
            "User-Agent": "KAMP-Stamping-Aluminium-Price-Updater/1.0",
            "Accept": "text/html,application/pdf;q=0.9,*/*;q=0.8",
        },
    )
    with urlopen(request, timeout=30, context=SSL_CONTEXT) as response:
        final_url = response.geturl()
        parsed_final_url = urlparse(final_url)
        if (
            parsed_final_url.scheme != "https"
            or parsed_final_url.hostname not in ALLOWED_HOSTS
        ):
            raise ValueError(f"Unexpected redirect host for {url}")
        content_length = response.headers.get("Content-Length")
        if content_length and int(content_length) > MAX_DOWNLOAD_BYTES:
            raise ValueError(f"Download is too large: {url}")
        payload = response.read(MAX_DOWNLOAD_BYTES + 1)
    if len(payload) > MAX_DOWNLOAD_BYTES:
        raise ValueError(f"Download is too large: {url}")
    return payload


def parse_effective_date(url: str, link_text: str) -> date | None:
    url_match = URL_DATE_PATTERN.search(url)
    if url_match:
        day, month_name, year = url_match.groups()
        month = MONTHS.get(month_name.lower())
        if month:
            return date(int(year), month, int(day))

    text_match = TEXT_DATE_PATTERN.search(link_text)
    if text_match:
        day, month, year = map(int, text_match.groups())
        return date(year, month, day)
    return None


def normalize_pdf_url(href: str) -> str | None:
    absolute = urljoin(SOURCE_PAGE, href)
    parsed = urlparse(absolute)
    if parsed.scheme != "https" or parsed.hostname not in ALLOWED_HOSTS:
        return None
    if not parsed.path.lower().endswith(".pdf"):
        return None
    if "primary-ready-reckoner" not in parsed.path.lower():
        return None
    return absolute


def extract_price(pdf_payload: bytes) -> int:
    reader = PdfReader(io.BytesIO(pdf_payload))
    extracted = " ".join(page.extract_text() or "" for page in reader.pages)
    normalized = re.sub(r"\s+", " ", extracted)
    match = PRODUCT_PATTERN.search(normalized)
    if not match:
        raise ValueError("6201 HAC-1 price was not found in the PDF")
    price = int(re.sub(r"\D", "", match.group(1)))
    if not 100_000 <= price <= 1_000_000:
        raise ValueError(f"Extracted price is outside the expected range: {price}")
    return price


def format_entry(effective_date: date, price: int, source_url: str) -> dict[str, Any]:
    return {
        "effective_date": effective_date.isoformat(),
        "short_date": f"{effective_date.day} {effective_date:%b}",
        "display_date": f"{effective_date.day} {effective_date:%b %Y}",
        "price_per_mt": price,
        "source_url": source_url,
    }


def validate_change(price: int, effective_date: date, entries: list[dict[str, Any]]) -> None:
    prior_entries = [
        entry
        for entry in entries
        if date.fromisoformat(entry["effective_date"]) < effective_date
    ]
    if not prior_entries:
        return
    prior_price = int(prior_entries[-1]["price_per_mt"])
    change = abs(price - prior_price) / prior_price
    if change > 0.35:
        raise ValueError(
            f"Price changed {change:.1%} from the prior publication; refusing automatic update"
        )


def update_prices(*, dry_run: bool = False) -> bool:
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    entries: list[dict[str, Any]] = sorted(
        data["prices"], key=lambda entry: entry["effective_date"]
    )
    existing_by_date = {entry["effective_date"]: entry for entry in entries}

    parser = LinkParser()
    parser.feed(fetch_bytes(SOURCE_PAGE).decode("utf-8", errors="replace"))

    discovered: dict[date, str] = {}
    tomorrow = datetime.now(timezone.utc).date() + timedelta(days=1)
    for href, link_text in parser.links:
        pdf_url = normalize_pdf_url(href)
        if not pdf_url:
            continue
        effective_date = parse_effective_date(pdf_url, link_text)
        if effective_date and effective_date <= tomorrow:
            discovered[effective_date] = pdf_url

    if not discovered:
        raise ValueError("No Hindalco Ready Reckoner PDFs were found")

    newest_date = max(discovered)
    dates_to_fetch = {
        effective_date
        for effective_date in discovered
        if effective_date.isoformat() not in existing_by_date
    }
    dates_to_fetch.add(newest_date)

    changed = False
    for effective_date in sorted(dates_to_fetch):
        source_url = discovered[effective_date]
        price = extract_price(fetch_bytes(source_url))
        validate_change(price, effective_date, entries)
        entry = format_entry(effective_date, price, source_url)
        existing = existing_by_date.get(effective_date.isoformat())
        if existing != entry:
            existing_by_date[effective_date.isoformat()] = entry
            entries = sorted(existing_by_date.values(), key=lambda item: item["effective_date"])
            changed = True
            print(
                f"Verified {entry['display_date']}: "
                f"Rs {entry['price_per_mt']:,}/MT"
            )

    if not changed:
        print(
            f"No change. Latest verified publication is "
            f"{existing_by_date[newest_date.isoformat()]['display_date']}."
        )
        return False

    data["source_page"] = SOURCE_PAGE
    data["updated_at"] = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    data["prices"] = entries
    rendered = json.dumps(data, indent=2, ensure_ascii=False) + "\n"

    if dry_run:
        print("Dry run: data file would be updated.")
        return True

    temporary_path = DATA_PATH.with_suffix(".json.tmp")
    temporary_path.write_text(rendered, encoding="utf-8")
    temporary_path.replace(DATA_PATH)
    print(f"Updated {DATA_PATH.relative_to(Path(__file__).resolve().parents[1])}")
    return True


def main() -> int:
    argument_parser = argparse.ArgumentParser()
    argument_parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Verify live data without changing the repository",
    )
    arguments = argument_parser.parse_args()
    try:
        update_prices(dry_run=arguments.dry_run)
    except Exception as exc:
        print(f"Aluminium price update failed: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
