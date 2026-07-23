import Link from "next/link";
import { Footer, Header, ProductCard, ServiceCard } from "./site-components";

const services = [
  {
    number: "01",
    title: "Lamination punching",
    description:
      "Precision electrical laminations produced for motors, fans and rotating equipment with close attention to consistency.",
  },
  {
    number: "02",
    title: "CNC winding",
    description:
      "Copper and aluminium winding capabilities for conventional and energy-efficient BLDC motor applications.",
  },
  {
    number: "03",
    title: "Annealing",
    description:
      "Decarburisation and Hi-Perm annealing processes designed to improve magnetic performance and material stability.",
  },
  {
    number: "04",
    title: "Rotor die casting",
    description:
      "Integrated rotor die-casting support for dependable, production-ready motor components.",
  },
];

const products = [
  {
    image: "/images/motor-lamination-stack-v2.jpg",
    title: "Motor lamination stacks",
    eyebrow: "Motor components",
  },
  {
    image: "/images/wound-stator-v2.jpg",
    title: "Wound stators",
    eyebrow: "Copper winding",
  },
  {
    image: "/images/custom-motor-lamination-v2.jpg",
    title: "Custom motor laminations",
    eyebrow: "Electrical stampings",
  },
  {
    image: "/images/product-transformer.jpg",
    title: "Transformer cores",
    eyebrow: "Electrical stampings",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="hero__media" aria-hidden="true">
            <img src="/images/factory.jpg" alt="" />
          </div>
          <div className="hero__scrim" />
          <div className="container hero__content">
            <p className="eyebrow eyebrow--light">Electrical stampings since 1984</p>
            <h1>Precision in every layer.</h1>
            <p className="hero__lead">
              Electrical motor stampings, CNC winding, annealing and die-cast
              rotors manufactured for OEMs across India.
            </p>
            <div className="hero__actions">
              <Link className="button button--primary" href="/contact/">
                Discuss a requirement
              </Link>
              <Link className="button button--ghost" href="/products/">
                Explore products
              </Link>
            </div>
          </div>
          <div className="container hero__stats" aria-label="Company highlights">
            <div><strong>40+</strong><span>years of manufacturing</span></div>
            <div><strong>2 acre</strong><span>facility in Bhiwadi</span></div>
            <div><strong>50–100</strong><span>experienced team members</span></div>
            <div><strong>Pan-India</strong><span>customer base</span></div>
          </div>
        </section>

        <section className="section intro-grid">
          <div className="container split">
            <div>
              <p className="eyebrow">Built for dependable production</p>
              <h2>Manufacturing experience that moves with industry.</h2>
            </div>
            <div className="prose-large">
              <p>
                KAMP Stamping combines experienced people, modern machinery and
                carefully selected materials to deliver consistent components
                on time.
              </p>
              <Link className="text-link" href="/about-us/">Learn about KAMP <span>↗</span></Link>
            </div>
          </div>
        </section>

        <section className="section section--ink">
          <div className="container section-heading">
            <div>
              <p className="eyebrow eyebrow--copper">Capabilities</p>
              <h2>From lamination to finished rotor.</h2>
            </div>
            <Link className="text-link text-link--light" href="/services/">View all capabilities <span>↗</span></Link>
          </div>
          <div className="container service-grid">
            {services.map((service) => <ServiceCard key={service.number} {...service} />)}
          </div>
        </section>

        <section className="section">
          <div className="container section-heading">
            <div>
              <p className="eyebrow">Product range</p>
              <h2>Components engineered for performance.</h2>
            </div>
            <Link className="text-link" href="/products/">See the full range <span>↗</span></Link>
          </div>
          <div className="container product-grid">
            {products.map((product) => <ProductCard key={product.title} {...product} />)}
          </div>
        </section>

        <section className="section trust">
          <div className="container">
            <p className="eyebrow">Trusted across India</p>
            <div className="client-list" aria-label="Selected customers">
              <span>Bajaj Electricals</span><span>Eon Electric</span>
              <span>Ottomate</span><span>RR Cables</span>
              <span>Halonix</span><span>Marc Enterprises</span>
            </div>
          </div>
        </section>

        <section className="cta-band">
          <div className="container cta-band__inner">
            <div>
              <p className="eyebrow eyebrow--light">Your next production requirement</p>
              <h2>Let’s make it precisely.</h2>
            </div>
            <Link className="button button--light" href="/contact/">Contact KAMP</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
