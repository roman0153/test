import type { Metadata } from "next";
import Image from "next/image";
import { PageHeading } from "@/components/page-heading";
import { ContactBanner } from "@/components/contact-banner";
import { TextLink } from "@/components/text-link";
import { CheckIcon, ServiceIcon } from "@/components/icons";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Služby",
  description: "Návrh záhrady, realizácia, pravidelná údržba a závlahové systémy. Premyslený prístup od prvého rozhovoru po dlhodobú starostlivosť.",
  alternates: { canonical: "/sluzby" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeading eyebrow="Naše služby" title="Od myšlienky k vašej záhrade." description="Jedna vízia. Všetky kroky. Pomôžeme vám s celým príbehom záhrady alebo práve s tou časťou, ktorú potrebujete." />
      <div className="container service-details">
        {services.map((service) => (
          <section className="service-detail" id={service.id} key={service.id} aria-labelledby={`${service.id}-title`}>
            <div className="service-detail-image image-wrap"><Image src={service.image} alt={`Ilustrácia služby ${service.name.toLocaleLowerCase("sk")}`} fill sizes="(max-width: 760px) 90vw, 45vw" className="cover-image" /></div>
            <div className="service-detail-copy">
              <div className="service-detail-label"><p className="eyebrow">{service.number} / {service.name}</p><ServiceIcon name={service.id} /></div>
              <h2 id={`${service.id}-title`}>{service.title}</h2>
              <p className="body-copy">{service.description}</p>
              <ul className="service-inclusions">{service.details.map((detail) => <li key={detail}><CheckIcon />{detail}</li>)}</ul>
              <TextLink href={`/kontakt?sluzba=${service.id}`}>Mám záujem</TextLink>
            </div>
          </section>
        ))}
      </div>
      <section className="process-section section-space">
        <div className="container"><p className="eyebrow">Ako spolupracujeme</p><h2>Prirodzený proces.<br />Jasný smer.</h2><div className="process-grid">{[
          ["01", "Spoznáme sa", "Porozprávame sa o vašich predstavách, mieste a možnostiach."],
          ["02", "Nájdeme koncept", "Navrhneme riešenie, ktoré prepája váš životný štýl s charakterom miesta."],
          ["03", "Dáme mu podobu", "Dohodneme rozsah, rozpočet a jednotlivé kroky realizácie."],
          ["04", "Necháme ho rásť", "Odovzdáme záhradu a dohodneme vhodnú následnú starostlivosť."],
        ].map(([number, title, text]) => <div key={number}><span className="process-number">{number}</span><h3>{title}</h3><p>{text}</p></div>)}</div></div>
      </section>
      <ContactBanner />
    </>
  );
}