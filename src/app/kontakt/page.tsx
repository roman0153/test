import type { Metadata } from "next";
import Image from "next/image";
import { PageHeading } from "@/components/page-heading";
import { ContactForm } from "@/components/contact-form";
import { images, site } from "@/lib/content";
import { getContactMode } from "@/lib/contact-delivery";
import { isInquiryService } from "@/lib/contact-validation";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Máte predstavu o svojej záhrade? Napíšte Eden Gardens a začnime spoločný rozhovor o vašom projekte.",
  alternates: { canonical: "/kontakt" },
};

type Props = { searchParams: Promise<{ sluzba?: string | string[] }> };

export default async function ContactPage({ searchParams }: Props) {
  const { sluzba } = await searchParams;
  const defaultService = isInquiryService(sluzba) ? sluzba : "ine";

  return (
    <>
      <PageHeading eyebrow="Kontakt" title="Dajme vašim predstavám priestor." description="Veľká záhrada alebo malá terasa. Hotová predstava alebo prvá myšlienka. Radi si vypočujeme váš príbeh." />
      <section className="container contact-layout" aria-label="Kontakt a dopytový formulár">
        <aside className="contact-intro"><h2>Začnime rozhovorom.</h2><p className="body-copy">Napíšte nám, o akom priestore premýšľate a čo je pre vás dôležité. Spoločne nájdeme ďalší krok.</p>{site.email && <div className="contact-detail"><p className="eyebrow">Napíšte nám</p><a href={`mailto:${site.email}`}>{site.email}</a></div>}{site.phone && <div className="contact-detail"><p className="eyebrow">Zavolajte nám</p><a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>{site.phone}</a></div>}<div className="contact-detail"><p className="eyebrow">Na prvé stretnutie</p><p>Vaša predstava.<br />Fotografia miesta.<br />A chuť začať.</p></div><div className="contact-image image-wrap" data-reveal="image"><Image src={images.greenery} alt="Pokojná zelená záhrada ako inšpirácia pre nový projekt" fill sizes="(max-width: 640px) 90vw, 30vw" className="cover-image" /></div></aside>
        <ContactForm defaultService={defaultService} mode={getContactMode()} />
      </section>
      <section className="faq-section" aria-labelledby="faq-title"><div className="container faq-layout"><div data-reveal="up"><p className="eyebrow">Dobré vedieť</p><h2 id="faq-title">Prvé otázky.<br />Jasné odpovede.</h2></div><div className="faq-list">{[
        ["Kedy je vhodné začať s návrhom záhrady?", "Ideálne už pri plánovaní domu alebo rekonštrukcie. Včasný návrh pomáha prepojiť architektúru, terén, technické rozvody a budúcu výsadbu. Začať však môžeme aj pri existujúcej záhrade."],
        ["Čo si pripraviť na úvodný rozhovor?", "Pomôže fotografia alebo jednoduchý plán pozemku, približná lokalita a predstava o tom, ako chcete záhradu používať. Ak máte orientačný rozpočet či termín, pridajte aj tie. Nemusíte mať všetko premyslené."],
        ["Je možný návrh aj bez realizácie?", "Áno. Rozsah spolupráce možno rozdeliť na návrh, realizáciu a následnú starostlivosť. Konkrétne výstupy aj nadväzujúce kroky je vždy potrebné dohodnúť podľa potrieb projektu."],
        ["Koľko stojí návrh alebo realizácia?", "Cena závisí od veľkosti, členitosti, požadovaných výstupov a náročnosti riešenia. Zmysluplný rozpočet sa dá pripraviť až po spoznaní miesta a vašich očakávaní."],
      ].map(([question, answer], index) => <details key={question} data-reveal="up" data-reveal-delay={index % 2}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>
    </>
  );
}