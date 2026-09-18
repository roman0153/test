import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { images } from "@/lib/content";

export function ContactBanner() {
  return (
    <section className="contact-banner" aria-labelledby="contact-banner-title">
      <Image src={images.courtyard} alt="" fill sizes="100vw" className="cover-image" />
      <div className="contact-banner-shade" />
      <div className="container contact-banner-inner" data-reveal="up">
        <div><p className="eyebrow">Začína sa to rozhovorom</p><h2 id="contact-banner-title">Máte projekt?</h2><p>Napíšte nám a radi sa s vami porozprávame<br className="desktop-break" /> o možnostiach vašej záhrady.</p></div>
        <Link className="outline-button outline-button--light" href="/kontakt">Poďme sa porozprávať<ArrowIcon /></Link>
      </div>
    </section>
  );
}