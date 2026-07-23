import Link from "next/link";
import { Footer, Header, PageHero, ProductCard } from "../site-components";

const products = [
  { image: "/images/motor-lamination-stack-v2.jpg", title: "Motor lamination stacks", eyebrow: "Motor components" },
  { image: "/images/wound-stator-v2.jpg", title: "Wound stators", eyebrow: "Copper winding" },
  { image: "/images/custom-motor-lamination-v2.jpg", title: "Custom motor laminations", eyebrow: "Electrical stampings" },
  { image: "/images/product-transformer.jpg", title: "Transformer cores", eyebrow: "Electrical stampings" },
];

export default function Products() {
  return <><Header /><main>
    <PageHero eyebrow="Product range" title="Electrical stampings made for demanding applications." intro="Explore representative components manufactured for motor, fan, BLDC and transformer applications. Contact us for drawings, material requirements and production volumes." />
    <section className="section"><div className="container product-grid product-grid--page">{products.map((p)=><ProductCard key={p.title} {...p} />)}</div></section>
    <section className="section section--ink"><div className="container split"><div><p className="eyebrow eyebrow--copper">Need a custom component?</p><h2>Share the drawing. We’ll discuss the manufacturing path.</h2></div><div className="prose-large"><p>Our team can review your application, material, tooling and expected volumes before recommending next steps.</p><Link className="button button--primary" href="/contact/">Start a conversation</Link></div></div></section>
  </main><Footer /></>;
}
