"use client";

import { useMemo, useState } from "react";
import priceData from "./aluminium-prices.json";

type AnalysisView = "billing" | "thirty-days";

const allHistory = priceData.prices.map((entry) => ({
  date: entry.short_date,
  displayDate: entry.display_date,
  effectiveDate: entry.effective_date,
  price: entry.price_per_mt,
  sourceUrl: entry.source_url,
}));

const currentEntry = allHistory.at(-1)!;
const previousEntry = allHistory.at(-2) ?? currentEntry;
const currentPrice = currentEntry.price;
const currentEffectiveDate = new Date(`${currentEntry.effectiveDate}T00:00:00Z`);
const millisecondsPerDay = 24 * 60 * 60 * 1000;

const last30DaysStart = new Date(currentEffectiveDate);
last30DaysStart.setUTCDate(last30DaysStart.getUTCDate() - 29);

const billingPeriodStart = new Date(
  Date.UTC(
    currentEffectiveDate.getUTCFullYear(),
    currentEffectiveDate.getUTCMonth() -
      (currentEffectiveDate.getUTCDate() < 21 ? 1 : 0),
    21,
  ),
);

const previousBillingPeriodStart = new Date(
  Date.UTC(
    billingPeriodStart.getUTCFullYear(),
    billingPeriodStart.getUTCMonth() - 1,
    21,
  ),
);
const previousBillingPeriodEnd = new Date(
  billingPeriodStart.getTime() - millisecondsPerDay,
);

const last30DaysHistory = allHistory.filter((entry) => {
  const entryDate = new Date(`${entry.effectiveDate}T00:00:00Z`);
  return entryDate >= last30DaysStart && entryDate <= currentEffectiveDate;
});

const billingPeriodHistory = allHistory.filter((entry) => {
  const entryDate = new Date(`${entry.effectiveDate}T00:00:00Z`);
  return entryDate >= billingPeriodStart && entryDate <= currentEffectiveDate;
});

const effectiveEntryOn = (date: Date) =>
  allHistory.findLast(
    (entry) => new Date(`${entry.effectiveDate}T00:00:00Z`) <= date,
  );

const businessDayPrices = (start: Date, end: Date) => {
  const dailyPrices: { date: Date; price: number }[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const weekday = cursor.getUTCDay();
    if (weekday !== 0 && weekday !== 6) {
      const effectiveEntry = effectiveEntryOn(cursor);
      if (effectiveEntry) {
        dailyPrices.push({
          date: new Date(cursor),
          price: effectiveEntry.price,
        });
      }
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dailyPrices;
};

const averagePrice = (dailyPrices: { price: number }[]) =>
  dailyPrices.reduce((sum, entry) => sum + entry.price, 0) / dailyPrices.length;

const billingPeriodDailyPrices = businessDayPrices(
  billingPeriodStart,
  currentEffectiveDate,
);
const previousBillingPeriodDailyPrices = businessDayPrices(
  previousBillingPeriodStart,
  previousBillingPeriodEnd,
);
const billingPeriodAverage = averagePrice(billingPeriodDailyPrices);
const previousBillingPeriodAverage = averagePrice(previousBillingPeriodDailyPrices);
const billingPeriodOpeningPrice =
  billingPeriodDailyPrices[0]?.price ?? currentPrice;

const last30DaysOpeningEntry = last30DaysHistory[0] ?? currentEntry;
const last30DaysHighEntry = last30DaysHistory.reduce(
  (highest, entry) => (entry.price > highest.price ? entry : highest),
  currentEntry,
);
const last30DaysHigh = last30DaysHighEntry.price;

const monthDayFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const dayMonthYearFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const formatRupees = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value))}`;

const formatRupeesPerKg = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;

const formatLakhs = (value: number) => `₹${(value / 100000).toFixed(2)}L`;

const formatSignedRupees = (value: number) =>
  `${value >= 0 ? "+" : "−"}${formatRupees(Math.abs(value))}`;

const formatPercent = (value: number) =>
  `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

const formatPeriod = (start: Date, end: Date) =>
  `${monthDayFormatter.format(start)} – ${dayMonthYearFormatter.format(end)}`;

const formatShortPeriod = (start: Date, end: Date) =>
  `${monthDayFormatter.format(start)} – ${monthDayFormatter.format(end)}`;

const trendDirection = (value: number) =>
  value > 0.25 ? "Rising ↑" : value < -0.25 ? "Falling ↓" : "Flat →";

export default function AluminiumGuideDashboard() {
  const [quantity, setQuantity] = useState(2.5);
  const [analysisView, setAnalysisView] = useState<AnalysisView>("billing");

  const orderValue = currentPrice * quantity;
  const billingPeriodAverageOrderValue = billingPeriodAverage * quantity;
  const billingPeriodChange =
    ((currentPrice - billingPeriodOpeningPrice) / billingPeriodOpeningPrice) * 100;
  const last30DaysChange =
    ((currentPrice - last30DaysOpeningEntry.price) / last30DaysOpeningEntry.price) * 100;
  const changeSincePrevious =
    ((currentPrice - previousEntry.price) / previousEntry.price) * 100;
  const changeFromLast30DaysHigh =
    ((currentPrice - last30DaysHigh) / last30DaysHigh) * 100;
  const changeFromBillingPeriodAverage =
    ((currentPrice - billingPeriodAverage) / billingPeriodAverage) * 100;
  const comparisonDifference = billingPeriodAverageOrderValue - orderValue;
  const latestIsBelowAverage = comparisonDifference >= 0;
  const averagePosition =
    changeFromBillingPeriodAverage < 0
      ? "below"
      : changeFromBillingPeriodAverage > 0
        ? "above"
        : "equal to";

  const signal =
    changeFromBillingPeriodAverage > 0.35
      ? {
          short: "Firming",
          headline: "firming above the billing period average",
          explanation: "The latest price is above the current billing period average.",
        }
      : changeFromBillingPeriodAverage < -0.35
        ? {
            short: "Easing",
            headline: "easing below the billing period average",
            explanation: "The latest price is below the current billing period average.",
          }
        : {
            short: "Steady",
            headline: "steady near the billing period average",
            explanation: "The latest price remains close to the current billing period average.",
          };

  const chartHistory =
    analysisView === "billing" ? billingPeriodHistory : last30DaysHistory;
  const chartStart =
    analysisView === "billing" ? billingPeriodStart : last30DaysStart;
  const chartTitle =
    analysisView === "billing" ? "Current Billing Period" : "Last 30 Days";
  const chartPeriod = formatPeriod(chartStart, currentEffectiveDate);
  const chartLow = Math.min(...chartHistory.map((entry) => entry.price));
  const chartHigh = Math.max(...chartHistory.map((entry) => entry.price));
  const chartRange = Math.max(chartHigh - chartLow, 1);
  const chartPadding = Math.max(chartRange * 0.18, 750);
  const chartDomainLow = chartLow - chartPadding;
  const chartDomainHigh = chartHigh + chartPadding;
  const chartDomainRange = chartDomainHigh - chartDomainLow;
  const chartPoints = chartHistory.map((entry, index) => ({
    ...entry,
    x: chartHistory.length === 1 ? 50 : (index / (chartHistory.length - 1)) * 100,
    y: ((entry.price - chartDomainLow) / chartDomainRange) * 100,
  }));
  const chartHighEntry = chartHistory.reduce(
    (highest, entry) => (entry.price > highest.price ? entry : highest),
    chartHistory[0],
  );
  const chartSummary = `${chartTitle}, ${chartPeriod}. The price moved from ${formatRupees(chartHistory[0].price)} per metric tonne on ${chartHistory[0].displayDate} to ${formatRupees(currentPrice)} on ${currentEntry.displayDate}. The high among the plotted publications was ${formatRupees(chartHigh)} on ${chartHighEntry.displayDate}.`;

  const scenarios = useMemo(
    () => [
      { label: "2% lower than latest", price: currentPrice * 0.98, tone: "lower" },
      { label: "Latest price", price: currentPrice, tone: "current" },
      { label: "2% higher than latest", price: currentPrice * 1.02, tone: "higher" },
    ],
    [],
  );

  return (
    <div className="aluminium-dashboard">
      <header className="aluminium-dashboard__header">
        <div className="dashboard-brand">
          <span className="dashboard-brand__mark" aria-hidden="true">●</span>
          <strong>KAMP STAMPING — Aluminium Tool</strong>
        </div>
        <a
          className="dashboard-source"
          href={currentEntry.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          <span>Hindalco source</span>
          Updated every 3 hours · Latest {currentEntry.displayDate} ↗
        </a>
      </header>

      <div className="aluminium-dashboard__body">
        <div className="aluminium-dashboard__intro">
          <h2>Aluminium Purchase Reference Dashboard</h2>
          <p>How is the published basic price of 6201 Alloy Wire Rod, Dia 9.5 mm (HAC-1) moving?</p>
        </div>

        <section className="aluminium-dashboard__section" aria-labelledby="market-inputs-heading">
          <h3 className="aluminium-section-title" id="market-inputs-heading">Market Inputs</h3>
          <div className="aluminium-metrics" aria-label="Current aluminium market indicators">
            <article className="aluminium-metric aluminium-metric--primary">
              <span>Latest price</span>
              <strong>{formatRupees(currentPrice)}<small>/MT</small></strong>
              <p>Effective {currentEntry.displayDate}</p>
            </article>
            <article className="aluminium-metric">
              <span>Billing period avg</span>
              <strong>{formatRupees(billingPeriodAverage)}<small>/MT</small></strong>
              <p>
                {monthDayFormatter.format(billingPeriodStart)} – today ·{" "}
                {billingPeriodDailyPrices.length} days
              </p>
            </article>
            <article className="aluminium-metric">
              <span>Billing period trend</span>
              <strong className={billingPeriodChange > 0 ? "value-higher" : billingPeriodChange < 0 ? "value-lower" : ""}>
                {formatPercent(billingPeriodChange)}
              </strong>
              <p>{trendDirection(billingPeriodChange)}</p>
            </article>
            <article className="aluminium-metric">
              <span>Price per kilogram</span>
              <strong>{formatRupeesPerKg(currentPrice / 1000)}<small>/kg</small></strong>
              <p>Basic-price equivalent · Effective {currentEntry.displayDate}</p>
            </article>
            <article className="aluminium-metric">
              <span>Change vs previous</span>
              <strong className={changeSincePrevious > 0 ? "value-higher" : changeSincePrevious < 0 ? "value-lower" : ""}>
                {formatPercent(changeSincePrevious)}
              </strong>
              <p>Vs {previousEntry.displayDate} · {formatSignedRupees(currentPrice - previousEntry.price)}/MT</p>
            </article>
            <article className="aluminium-metric">
              <span>Prev period avg</span>
              <strong>{formatRupees(previousBillingPeriodAverage)}<small>/MT</small></strong>
              <p>
                {formatShortPeriod(previousBillingPeriodStart, previousBillingPeriodEnd)} ·{" "}
                {previousBillingPeriodDailyPrices.length} days
              </p>
            </article>
            <article className="aluminium-metric">
              <span>30-day trend</span>
              <strong className={last30DaysChange > 0 ? "value-higher" : last30DaysChange < 0 ? "value-lower" : ""}>
                {formatPercent(last30DaysChange)}
              </strong>
              <p>{trendDirection(last30DaysChange)}</p>
            </article>
            <article className="aluminium-metric">
              <span>Last 30-day high</span>
              <strong>{formatRupees(last30DaysHigh)}<small>/MT</small></strong>
              <p>
                {last30DaysHighEntry.displayDate} ·{" "}
                {currentPrice === last30DaysHigh
                  ? "latest price matches the high"
                  : `latest is ${Math.abs(changeFromLast30DaysHigh).toFixed(1)}% lower`}
              </p>
            </article>
          </div>
        </section>

        <section className="aluminium-dashboard__section" aria-labelledby="order-heading">
          <h3 className="aluminium-section-title" id="order-heading">Your Order</h3>
          <div className="aluminium-order__control">
            <div className="aluminium-order__title">
              <label htmlFor="aluminium-quantity">Purchase quantity (tonnes)</label>
              <strong>{quantity.toFixed(1)} T</strong>
            </div>
            <input
              id="aluminium-quantity"
              type="range"
              min="0.5"
              max="50"
              step="0.5"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
            />
            <div className="aluminium-order__range" aria-hidden="true">
              <span>0.5 T</span>
              <span>50 T</span>
            </div>
          </div>
          <div className="aluminium-order__cards">
            <article className="aluminium-metric">
              <span>At latest price</span>
              <strong>{formatLakhs(orderValue)}</strong>
              <p>{formatRupees(currentPrice)}/MT · {currentEntry.date}</p>
            </article>
            <article className="aluminium-metric">
              <span>At billing period average</span>
              <strong>{formatLakhs(billingPeriodAverageOrderValue)}</strong>
              <p>{formatRupees(billingPeriodAverage)}/MT</p>
            </article>
            <article className="aluminium-metric">
              <span>Latest vs period average</span>
              <strong>{formatLakhs(Math.abs(comparisonDifference))}</strong>
              <p>Latest price is {latestIsBelowAverage ? "lower" : "higher"}</p>
            </article>
            <article className="aluminium-metric">
              <span>Directional read</span>
              <strong className="aluminium-metric__signal">{signal.short}</strong>
              <p>{signal.explanation}</p>
            </article>
          </div>
          <div className="aluminium-signal" aria-labelledby="directional-signal-title">
            <span className="aluminium-signal__icon" aria-hidden="true">→</span>
            <div>
              <h4 id="directional-signal-title">Directional signal: {signal.headline}</h4>
              <p>
                The latest price is {Math.abs(changeFromBillingPeriodAverage).toFixed(1)}%{" "}
                {averagePosition} the current billing period average and{" "}
                {currentPrice === last30DaysHigh
                  ? "matches the last 30-day high"
                  : `${Math.abs(changeFromLast30DaysHigh).toFixed(1)}% below the ${last30DaysHighEntry.date} 30-day high`}
                . Over the last 30 days it has moved {formatPercent(last30DaysChange)} from{" "}
                {last30DaysOpeningEntry.date} to {currentEntry.date}.
              </p>
            </div>
          </div>
        </section>

        <section className="aluminium-dashboard__section" aria-labelledby="history-heading">
          <h3 className="aluminium-section-title" id="history-heading">Price Analysis</h3>
          <div className="aluminium-analysis">
            <div className="aluminium-analysis__tabs" role="group" aria-label="Price analysis period">
              <button
                className={`aluminium-analysis__tab${analysisView === "billing" ? " is-active" : ""}`}
                type="button"
                aria-pressed={analysisView === "billing"}
                onClick={() => setAnalysisView("billing")}
              >
                Current Billing Period
              </button>
              <button
                className={`aluminium-analysis__tab${analysisView === "thirty-days" ? " is-active" : ""}`}
                type="button"
                aria-pressed={analysisView === "thirty-days"}
                onClick={() => setAnalysisView("thirty-days")}
              >
                Last 30 Days
              </button>
            </div>
            <div className="aluminium-analysis__heading">
              <div>
                <strong>{chartTitle}</strong>
                <p>{chartPeriod} · {chartHistory.length} price publications</p>
              </div>
              <div className="aluminium-chart-legend">
                <span><i /> Price (₹/MT)</span>
              </div>
            </div>
            <div className="aluminium-chart-scroll">
              <div
                className="aluminium-line-chart"
                role="img"
                aria-label={chartSummary}
              >
                <div className="aluminium-line-chart__plot">
                  {chartPoints.slice(1).map((point, index) => {
                    const previousPoint = chartPoints[index];
                    const previousTop = 100 - previousPoint.y;
                    const currentTop = 100 - point.y;
                    const lineHalfWidth = 0.8;
                    return (
                      <div
                        className="aluminium-line-chart__segment-wrap"
                        key={`${previousPoint.effectiveDate}-${point.effectiveDate}`}
                        style={{
                          left: `${previousPoint.x}%`,
                          width: `${point.x - previousPoint.x}%`,
                        }}
                      >
                        <i
                          className="aluminium-line-chart__area"
                          style={{
                            clipPath: `polygon(0 ${previousTop}%, 100% ${currentTop}%, 100% 100%, 0 100%)`,
                          }}
                        />
                        <i
                          className="aluminium-line-chart__segment"
                          style={{
                            clipPath: `polygon(0 ${previousTop - lineHalfWidth}%, 0 ${previousTop + lineHalfWidth}%, 100% ${currentTop + lineHalfWidth}%, 100% ${currentTop - lineHalfWidth}%)`,
                          }}
                        />
                      </div>
                    );
                  })}
                  {chartPoints.map((point, index) => (
                    <div
                      className={`aluminium-line-chart__point${
                        index === 0
                          ? " is-first"
                          : index === chartPoints.length - 1
                            ? " is-last"
                            : ""
                      }`}
                      key={point.effectiveDate}
                      style={{ left: `${point.x}%`, bottom: `${point.y}%` }}
                      title={`${point.displayDate}: ${formatRupees(point.price)}/MT`}
                    >
                      <span className="aluminium-line-chart__value">
                        ₹{(point.price / 1000).toFixed(point.price % 1000 ? 2 : 0)}k
                      </span>
                      <i />
                    </div>
                  ))}
                  {chartPoints.map((point, index) => (
                    <span
                      className={`aluminium-line-chart__date${
                        index === 0
                          ? " is-first"
                          : index === chartPoints.length - 1
                            ? " is-last"
                            : ""
                      }`}
                      key={`date-${point.effectiveDate}`}
                      style={{ left: `${point.x}%` }}
                    >
                      {point.date}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="aluminium-chart-mobile-summary" aria-hidden="true">
              <span>
                <small>Start</small>
                <strong>{formatRupees(chartHistory[0].price)}/MT</strong>
                <small>{chartHistory[0].date}</small>
              </span>
              <span>
                <small>Latest</small>
                <strong>{formatRupees(currentPrice)}/MT</strong>
                <small>{currentEntry.date}</small>
              </span>
            </div>
            <p className="aluminium-analysis__note">
              Current Billing Period follows the same 21st–20th cycle used in the Copper
              Buying Guide. Each point represents a price publication; publication dates
              are shown along the horizontal axis.
            </p>
          </div>
        </section>

        <section className="aluminium-dashboard__section" aria-labelledby="scenarios-heading">
          <h3 className="aluminium-section-title" id="scenarios-heading">Scenario Analysis — What if prices move?</h3>
          <div className="aluminium-scenarios">
            <p className="aluminium-scenarios__intro">Illustrative values for a {quantity.toFixed(1)}-tonne order, based on the latest published price</p>
            <div className="aluminium-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Price</th>
                    <th>Estimated basic value</th>
                    <th>Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map((scenario) => {
                    const scenarioValue = scenario.price * quantity;
                    const difference = scenarioValue - orderValue;
                    return (
                      <tr key={scenario.label}>
                        <td><span className={`scenario-dot scenario-dot--${scenario.tone}`} />{scenario.label}</td>
                        <td>{formatRupees(scenario.price)}/MT</td>
                        <td>{formatLakhs(scenarioValue)}</td>
                        <td className={difference < 0 ? "value-lower" : difference > 0 ? "value-higher" : ""}>
                          {difference === 0 ? "—" : `${difference > 0 ? "+" : "−"}${formatLakhs(Math.abs(difference))}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <footer className="aluminium-dashboard__footer">
          <p>
            <strong>How to use this:</strong>{" "}Treat the latest published basic
            price as a directional benchmark for procurement planning, not a guaranteed supplier quote.
          </p>
          <p>
            The charts use the official Primary Aluminium Products Price Ready Reckoners
            dated {allHistory[0].displayDate}–{currentEntry.displayDate}. Billing-period averages
            use weekdays, carrying each effective price forward until the next publication.
            Chart points show publication dates only.
          </p>
        </footer>
      </div>
    </div>
  );
}
