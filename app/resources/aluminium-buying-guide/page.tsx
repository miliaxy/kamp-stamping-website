import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../../site-components";
import AluminiumGuideDashboard from "./AluminiumGuideDashboard";

export const metadata: Metadata = {
  title: "Aluminium Buying Guide",
  description: "A practical 6201 alloy wire rod price reference for manufacturing and purchasing teams.",
  alternates: { canonical: "/resources/aluminium-buying-guide/" },
  openGraph: {
    title: "Aluminium Buying Guide | KAMP Stamping",
    description: "Track the published 6201 HAC-1 basic price and explore aluminium purchasing scenarios.",
    type: "website",
  },
};

export default function AluminiumBuyingGuide() {
  return <><Header /><main>
    <section className="tool-hero tool-hero--aluminium"><div className="container">
      <p className="eyebrow eyebrow--aluminium">Resource · Market reference</p>
      <h1>Aluminium Buying Guide</h1>
      <p>Follow published price movement as a directional benchmark for purchasing and production planning.</p>
      <Link className="text-link text-link--light" href="/resources/">Back to resources <span>←</span></Link>
    </div></section>
    <section className="aluminium-dashboard-wrap"><div className="container"><AluminiumGuideDashboard /></div></section>
    <section className="tool-note tool-note--aluminium"><div className="container">
      <strong>Important:</strong>{" "}This resource provides general market context. The price applicable on the actual dispatch date may differ, and taxes, duties, freight and depot charges are additional.
    </div></section>
  </main><Footer /></>;
}
