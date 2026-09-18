import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectGallery } from "@/components/project-gallery";
import { TextLink } from "@/components/text-link";
import { ContactBanner } from "@/components/contact-banner";
import { projects } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: "Projekt sa nenašiel" };
  return {
    title: project.title,
    description: project.intro,
    alternates: { canonical: `/realizacie/${project.slug}` },
    openGraph: { title: project.title, description: project.intro, images: [{ url: project.image, alt: project.imageAlt }] },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const nextProject = projects[(index + 1) % projects.length];

  return (
    <>
      <div className="container project-detail-heading">
        <div className="breadcrumb"><Link href="/realizacie">Realizácie</Link><span aria-hidden="true">/</span><span>{project.title}</span></div>
        <p className="eyebrow">{project.category} <span className="eyebrow-divider">/</span> Ilustračný koncept</p>
        <h1>{project.title}</h1>
        <p className="project-detail-intro">{project.intro}</p>
      </div>
      <div className="project-detail-hero image-wrap"><Image src={project.image} alt={project.imageAlt} fill sizes="100vw" priority className="cover-image" /></div>
      <section className="container project-story section-space">
        <div data-reveal="up"><p className="eyebrow">O projekte</p><h2>Priestor, ktorý<br />dáva zmysel.</h2><div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
        <div data-reveal="up" data-reveal-delay="1"><p className="body-copy">{project.description}</p><dl className="project-facts"><div><dt>Lokalita konceptu</dt><dd>{project.location}</dd></div><div><dt>Rok štúdie</dt><dd>{project.year}</dd></div><div><dt>Modelová plocha</dt><dd>{project.area}</dd></div></dl></div>
      </section>
      <section className="container project-gallery-section" aria-label="Fotogaléria projektu"><ProjectGallery images={project.gallery} title={project.title} /><p className="content-disclaimer">Fotografie slúžia ako vizuálna inšpirácia a nezobrazujú jeden konkrétny realizovaný projekt.</p></section>
      <div className="container project-next"><span className="eyebrow">Ďalší príbeh</span><TextLink href={`/realizacie/${nextProject.slug}`}>{nextProject.title}</TextLink></div>
      <ContactBanner />
    </>
  );
}