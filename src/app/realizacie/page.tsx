import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { ProjectGrid } from "@/components/project-grid";
import { ContactBanner } from "@/components/contact-banner";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Realizácie",
  description: "Inšpirácia v každom detaile. Prezrite si ukážkové koncepty rodinných a mestských záhrad aj zelených terás.",
  alternates: { canonical: "/realizacie" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeading eyebrow="Realizácie" title="Každá záhrada má svoj príbeh." description="Rozličné miesta. Rozličné predstavy. Rovnaký cit pre priestor a detail. Nájdite inšpiráciu pre ten váš." />
      <section className="container projects-section" aria-label="Naše projekty"><ProjectGrid projects={projects} /><p className="content-disclaimer">Portfólio obsahuje ilustračné koncepty a fotografie, nie zdokumentované zákazky štúdia.</p></section>
      <ContactBanner />
    </>
  );
}