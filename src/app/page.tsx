import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { ArrowIcon, LeafMark, ServiceIcon } from "@/components/icons";
import { TextLink } from "@/components/text-link";
import { ContactBanner } from "@/components/contact-banner";
import { images, projects, services } from "@/lib/content";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="about-section section-space" aria-labelledby="about-title">
        <div className="container about-grid">
          <div className="about-copy">
            <LeafMark className="section-leaf" />
            <p className="eyebrow">O nás</p>
            <h2 id="about-title">Vytvárame záhrady<br />s myšlienkou.</h2>
            <p className="body-copy">Eden Gardens je štúdio záhradnej architektúry, ktoré prepája prírodu, architektúru a váš spôsob života. Navrhujeme a tvoríme záhrady, terasy a exteriéry, v ktorých sa budete cítiť doma.</p>
            <p className="body-copy about-belief">Veríme, že kvalitná záhrada je viac než len priestor — je to spôsob života.</p>
            <TextLink href="/o-nas">Viac o nás</TextLink>
          </div>
          <div className="about-image image-wrap"><Image src={images.greenery} alt="Pokojná záhrada s bohatou zelenou výsadbou" fill sizes="(max-width: 760px) 90vw, 48vw" className="cover-image" /><span className="image-note">Prirodzene. Premyslene. Pre vás.</span></div>
        </div>
      </section>

      <section className="services-section" aria-labelledby="services-title">
        <div className="container">
          <div className="section-heading-line"><h2 className="eyebrow" id="services-title">Naše služby</h2><span className="quiet-note">Od prvej skice po každé ďalšie leto.</span></div>
          <div className="services-grid">
            {services.map((service) => (
              <Link key={service.id} href={`/sluzby#${service.id}`} className="service-card">
                <span className="service-number">{service.number}</span>
                <h3>{service.name}</h3>
                <p>{service.short}</p>
                <div className="service-card-bottom"><span className="service-icon"><ServiceIcon name={service.id} /></span><ArrowIcon className="service-arrow" /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-work section-space" aria-labelledby="work-title">
        <div className="container featured-work-layout">
          <div className="featured-work-intro"><p className="eyebrow">Realizácie</p><h2 id="work-title">Inšpirácia<br />v každom detaile.</h2><TextLink href="/realizacie">Všetky realizácie</TextLink></div>
          <Link className="featured-project image-wrap" href={`/realizacie/${projects[0].slug}`}>
            <Image src={projects[0].image} alt={projects[0].imageAlt} fill sizes="(max-width: 760px) 90vw, 42vw" className="cover-image" />
            <div className="project-overlay"><div><h3>{projects[0].title}</h3><p>{projects[0].location} <span>·</span> {projects[0].year}</p></div><ArrowIcon /></div>
          </Link>
          <div className="featured-project-stack">
            {[projects[1], projects[2]].map((project) => (
              <Link key={project.slug} href={`/realizacie/${project.slug}`} className="featured-project image-wrap"><Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 760px) 45vw, 24vw" className="cover-image" /><div className="project-overlay project-overlay--small"><h3>{project.title}</h3><ArrowIcon /></div></Link>
            ))}
          </div>
        </div>
      </section>
      <ContactBanner />
    </>
  );
}