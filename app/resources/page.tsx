import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, PageHero } from "../site-components";

export const metadata: Metadata = {
  title: "Resources",
  description: "Practical reference resources from KAMP Stamping for manufacturing and purchasing teams.",
  alternates: { canonical: "/resources/" },
};

export default function Resources() {
  return <><Header /><main>
    <PageHero eyebrow="Resources" title="Practical context for manufacturing teams." intro="Occasional reference tools and guides informed by KAMP’s experience in electrical-stamping and motor-component manufacturing." />
    <section className="section section--soft"><div className="container resource-list">
      <article className="resource-card resource-card--copper">
        <p className="eyebrow">Market reference</p>
        <h2>Copper Buying Guide</h2>
        <p>Explore copper-market signals and purchasing scenarios in a practical dashboard intended to support—not replace—your procurement process.</p>
        <Link className="text-link" href="/resources/copper-buying-guide/">View the guide <span>↗</span></Link>
      </article>
      <article className="resource-card resource-card--aluminium">
        <p className="eyebrow">Market reference</p>
        <h2>Aluminium Buying Guide</h2>
        <p>Follow published 6201 alloy wire rod prices, recent movement and quantity-based purchasing scenarios.</p>
        <Link className="text-link" href="/resources/aluminium-buying-guide/">View the guide <span>↗</span></Link>
      </article>
    </div></section>
  </main><Footer /></>;
}
