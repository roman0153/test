import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { site } from "@/lib/content";

export const metadata: Metadata = { title: "Ochrana súkromia", robots: { index: false, follow: true } };

export default function PrivacyPage() {
  return (
    <>
      <PageHeading eyebrow="Ochrana súkromia" title="S rešpektom aj k vašim údajom." description="Informácie o fungovaní formulára v tejto ukážkovej prezentácii." />
      <div className="article-body privacy-body">
        <div className="notice"><strong>Ukážkový web</strong><p>Pred verejným spustením je potrebné doplniť skutočného prevádzkovateľa, jeho kontaktné údaje, právny základ a dobu uchovávania. Tento text nie je kompletným oznámením o ochrane osobných údajov pre konkrétnu firmu. Do ukážky neposielajte citlivé údaje.</p></div>
        <section><h2>Čo formulár spracúva</h2><p>Meno, e-mail, voliteľný telefón, lokalitu projektu, vybranú službu a obsah vašej správy. Údaje slúžia na spracovanie dopytu a odpoveď. Formulár vyžaduje potvrdenie, že ste sa s touto informáciou oboznámili.</p></section>
        <section><h2>Kam sa správa odošle</h2><p>V lokálnom vývojovom režime bez e-mailovej konfigurácie sa správa uloží do súboru na počítači, na ktorom beží web. E-mail sa v tomto režime neodosiela. Ak prevádzkovateľ nakonfiguruje doručovanie, správa sa odošle prostredníctvom služby Resend na jeho nastavenú e-mailovú adresu. Produkčný web bez konfigurácie správy neprijíma.</p></section>
        <section><h2>Technické údaje a fotografie</h2><p>Dočasný limit odosielania využíva identifikátor odvodený od IP adresy poskytnutej hostingom. Aplikácia nepoužíva analytické ani reklamné cookies. Ilustračné fotografie sa získavajú zo služby Unsplash; prevádzkovateľ hostingu a poskytovatelia doručovania môžu spracúvať technické údaje podľa svojich podmienok. Pred spustením odporúčame nahradiť fotografie vlastnými lokálnymi súbormi.</p></section>
        <section><h2>Vaše otázky</h2><p>V nasadenej verzii sa môžete obrátiť na prevádzkovateľa so žiadosťou o prístup, opravu alebo vymazanie údajov, ako aj s ďalšími požiadavkami podľa príslušných predpisov. {site.email ? <>Kontakt: <a href={`mailto:${site.email}`}>{site.email}</a>.</> : "Kontaktná adresa prevádzkovateľa zatiaľ nie je nastavená."}</p></section>
      </div>
    </>
  );
}