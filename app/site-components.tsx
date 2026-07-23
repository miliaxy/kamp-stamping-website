import Link from "next/link";

const navItems = [
  ["Home", "/"],
  ["Capabilities", "/services/"],
  ["Products", "/products/"],
  ["About", "/about-us/"],
  ["Resources", "/resources/"],
  ["Contact", "/contact/"],
] as const;

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="brand" href="/" aria-label="KAMP Stamping home">
          <img src="/images/kamp-logo.png" alt="KAMP" />
          <span><strong>KAMP</strong><small>Stamping Pvt. Ltd.</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <details className="mobile-nav">
          <summary aria-label="Open navigation"><span /><span /></summary>
          <nav aria-label="Mobile navigation">
            {navItems.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          </nav>
        </details>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src="/images/kamp-logo.png" alt="KAMP" />
          <p>Precision electrical stampings and motor components since 1984.</p>
        </div>
        <div>
          <h3>Visit</h3>
          <p>G1-597, RIICO Industrial Area<br />Khushkhera, Rajasthan 301707<br />India</p>
        </div>
        <div>
          <h3>Contact</h3>
          <p><a href="tel:+919810103058">+91 98101 03058</a><br />
          <a href="mailto:kampstamping@gmail.com">kampstamping@gmail.com</a></p>
        </div>
        <div>
          <h3>Explore</h3>
          <p><Link href="/products/">Products</Link><br />
          <Link href="/services/">Capabilities</Link><br />
          <Link href="/about-us/">About KAMP</Link><br />
          <Link href="/resources/">Resources</Link></p>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} KAMP Stamping Pvt. Ltd.</span>
        <span>Made in Rajasthan. Serving India.</span>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <section className="page-hero">
      <div className="container page-hero__inner">
        <p className="eyebrow eyebrow--copper">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
    </section>
  );
}

export function ServiceCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <article className="service-card">
      <span>{number}</span><h3>{title}</h3><p>{description}</p>
    </article>
  );
}

export function ProductCard({ image, title, eyebrow }: { image: string; title: string; eyebrow: string }) {
  return (
    <article className="product-card">
      <div className="product-card__image"><img src={image} alt={title} /></div>
      <p>{eyebrow}</p><h3>{title}</h3>
    </article>
  );
}
