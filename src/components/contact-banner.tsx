import Link from "next/link";
import { ArrowIcon, LeafMark } from "@/components/icons";

export function ContactBanner() {
  return (
    <section className="contact-banner" aria-labelledby="contact-banner-title">
      <LeafMark className="contact-banner-leaf" />
      <div className="container contact-banner-inner" data-reveal="up">
        <div><p className="eyebrow">Začína sa to rozhovorom</p><h2 id="contact-banner-title">Máte projekt?</h2><p>Napíšte nám a radi sa s vami porozprávame<br className="desktop-break" /> o možnostiach vašej záhrady.</p></div>
        <Link className="solid-button" href="/kontakt">Poďme sa porozprávať<ArrowIcon /></Link>
      </div>
    </section>
  );
}