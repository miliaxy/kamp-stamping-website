import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../../site-components";

export const metadata: Metadata = {
  title: "Copper Buying Guide",
  description: "A practical copper-market reference dashboard for manufacturing and purchasing teams.",
  alternates: { canonical: "/resources/copper-buying-guide/" },
  openGraph: {
    title: "Copper Buying Guide | KAMP Stamping",
    description: "Explore copper-market signals and purchasing scenarios in a practical reference dashboard.",
    type: "website",
  },
};

export default function CopperBuyingGuide() {
  return <><Header /><main>
    <section className="tool-hero"><div className="container">
      <p className="eyebrow eyebrow--copper">Resource · Market reference</p>
      <h1>Copper Buying Guide</h1>
      <p>Explore copper-market signals and purchasing scenarios in a practical dashboard for manufacturing and purchasing teams.</p>
      <Link className="text-link text-link--light" href="/resources/">Back to resources <span>←</span></Link>
      <br />
      <a className="text-link text-link--light" href="https://miliaxy.github.io/copper-tool/copper-dashboard-v3.html" target="_blank" rel="noreferrer">Open dashboard full screen <span>↗</span></a>
    </div></section>
    <section className="tool-frame-wrap"><div className="container"><iframe className="tool-frame" src="https://miliaxy.github.io/copper-tool/copper-dashboard-v3.html" title="KAMP Copper Buying Guide dashboard" loading="eager" /></div></section>
    <section className="tool-note"><div className="container"><strong>Important:</strong> This resource provides general market context. It is not financial advice and should not be the sole basis for a purchasing decision.</div></section>
  </main><Footer /></>;
}
