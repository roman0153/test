import Link from "next/link";
import { LeafMark } from "@/components/icons";
import { navigation, site } from "@/lib/content";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Link className="brand" href="/" aria-label="Eden Gardens — úvodná stránka"><LeafMark className="brand-mark" /><span>EDEN GARDENS</span></Link>
          <p className="footer-tagline">Premyslené záhrady.<br />Prirodzene krásny život.</p>
        </div>
        <nav aria-label="Navigácia v päte" className="footer-nav">
          {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className="footer-contact">
          <p className="eyebrow">Máte svoju predstavu?</p>
          <Link href="/kontakt" className="footer-contact-link">Dajme jej priestor.</Link>
          {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
          {site.phone && <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>{site.phone}</a>}
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Eden Gardens</span>
        <span className="demo-note">Ukážková prezentácia · Ilustračné fotografie</span>
        <Link href="/ochrana-sukromia">Ochrana súkromia</Link>
      </div>
    </footer>
  );
}