import Link from "next/link";
import { Footer, Header, PageHero, ServiceCard } from "../site-components";

const services = [
  { number: "01", title: "Lamination punching", description: "Precision laminations for electrical motors, fans and rotating equipment, supported by carefully maintained tooling and production controls." },
  { number: "02", title: "CNC winding", description: "Copper and aluminium CNC winding for conventional motors and BLDC applications, built for repeatability across production volumes." },
  { number: "03", title: "Decarburisation & annealing", description: "Hi-Perm annealing processes that help improve magnetic properties, material stability and finished-component performance." },
  { number: "04", title: "Rotor die casting", description: "Integrated rotor die casting that supports a more complete manufacturing path from lamination stack to finished motor component." },
];

export default function Services() {
  return <><Header /><main>
    <PageHero eyebrow="Manufacturing capabilities" title="Processes built around production reliability." intro="KAMP supports OEMs with an integrated range of electrical-stamping and motor-component processes from its Bhiwadi facility." />
    <section className="section section--ink"><div className="container service-grid service-grid--page">{services.map((s)=><ServiceCard key={s.number} {...s} />)}</div></section>
    <section className="section"><div className="container image-story"><div className="image-story__image"><img src="/images/quality-inspection-v3.jpg" alt="Dimensional inspection of a motor lamination stack using a digital caliper" /></div><div><p className="eyebrow">Why KAMP</p><h2>One manufacturing partner. Fewer handoffs.</h2><ul className="check-list"><li>More than four decades of industry experience</li><li>Modern production base in Bhiwadi, Rajasthan</li><li>Experienced team focused on quality and delivery</li><li>Support for copper, aluminium and BLDC applications</li><li>Pan-India customer relationships</li></ul><Link className="button button--dark" href="/contact/">Discuss your component</Link></div></div></section>
  </main><Footer /></>;
}
