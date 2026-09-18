import type { Metadata } from "next";
import Image from "next/image";
import { ContactBanner } from "@/components/contact-banner";
import { PageHeading } from "@/components/page-heading";
import { LeafMark } from "@/components/icons";
import { TextLink } from "@/components/text-link";
import { images } from "@/lib/content";

export const metadata: Metadata = {
  title: "O nás",
  description: "Spoznajte filozofiu Eden Gardens. Tvoríme záhrady s myšlienkou, rešpektom k prírode a citom pre detail.",
  alternates: { canonical: "/o-nas" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeading eyebrow="O nás" title="Príroda je naša najlepšia inšpirácia." description="Veríme v miesta, ktoré nemusia kričať, aby vás oslovili. V záhrady, ktoré sú prirodzenou súčasťou života." />
      <div className="container about-editorial-image image-wrap"><Image src={images.garden} alt="Premyslené prepojenie záhrady, terasy a modernej architektúry" fill priority sizes="90vw" className="cover-image" /><span className="image-note">Priestor pre život. Miesto pre vás.</span></div>
      <section className="container about-story section-space"><div data-reveal="up"><LeafMark className="standalone-leaf" /><p className="eyebrow">Naša filozofia</p><h2>Nie iba pekná záhrada.<br />Váš kúsok sveta.</h2></div><div data-reveal="up" data-reveal-delay="1"><p className="large-copy">Záhrada by mala byť miestom, kam sa chcete vracať. Kde môžete spomaliť, nadýchnuť sa a byť jednoducho doma.</p><p className="body-copy">V Eden Gardens vnímame exteriér ako pokračovanie domova. Prepájame záhradnú architektúru s každodenným životom — od prvého ranného svetla na terase až po posledný večerný pohľad z okna.</p><p className="body-copy">Našou ambíciou je tvoriť nadčasové priestory. Také, ktoré rešpektujú miesto, prirodzene starnú a každým rokom získavajú na charaktere.</p><TextLink href="/sluzby">Spoznajte náš prístup</TextLink></div></section>
      <section className="values-section section-space"><div className="container"><p className="eyebrow" data-reveal="up">Čomu veríme</p><div className="values-grid">{[
        ["01", "Rešpekt k miestu", "Každá záhrada má svoje svetlo, pôdu a príbeh. Naším prvým krokom je porozumieť im."],
        ["02", "Zmysel pre detail", "Od proporcií priestoru po výber jednej rastliny. Práve drobnosti vytvárajú harmonický celok."],
        ["03", "Prirodzená rovnováha", "Krása a funkčnosť nie sú protiklady. Dobrá záhrada potrebuje oboje, rovnako ako priestor na život."],
      ].map(([number, title, text], index) => <div key={number} data-reveal="up" data-reveal-delay={index}><span className="service-number">{number}</span><h3>{title}</h3><p className="body-copy">{text}</p></div>)}</div></div></section>
      <ContactBanner />
    </>
  );
}