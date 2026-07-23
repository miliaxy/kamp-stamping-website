import { Footer, Header, PageHero } from "../site-components";

export default function Contact() {
  return <><Header /><main>
    <PageHero eyebrow="Contact KAMP" title="Tell us what you need to manufacture." intro="Send your component drawing, material requirement, expected production volume or a brief description. Our team will respond to discuss the next step." />
    <section className="section"><div className="container contact-grid"><div className="contact-card"><p className="eyebrow">Business enquiries</p><h2>Start the conversation.</h2><a className="contact-link" href="mailto:kampstamping@gmail.com"><span>Email</span>kampstamping@gmail.com</a><a className="contact-link" href="tel:+919810103058"><span>Phone</span>+91 98101 03058</a><p className="contact-note">For faster evaluation, include the component name, drawing or dimensions, material grade and approximate annual volume.</p></div><div className="address-card"><p className="eyebrow eyebrow--copper">Manufacturing facility</p><h2>Bhiwadi, Rajasthan</h2><address>G1-597, RIICO Industrial Area<br />Khushkhera, Rajasthan 301707<br />India</address><a className="text-link text-link--light" href="https://maps.google.com/?q=G1-597%2C+RIICO+Industrial+Area%2C+Khushkhera%2C+Rajasthan+301707" target="_blank" rel="noreferrer">Open in Google Maps <span>↗</span></a></div></div></section>
  </main><Footer /></>;
}
