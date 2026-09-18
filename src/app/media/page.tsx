import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { ContactBanner } from "@/components/contact-banner";
import { ArrowIcon } from "@/components/icons";
import { articles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Médiá a inšpirácia",
  description: "Myšlienky o záhradách, architektúre a živote vonku. Praktické rady a inšpirácia z denníka Eden Gardens.",
  alternates: { canonical: "/media" },
};

export default function MediaPage() {
  return (
    <>
      <PageHeading eyebrow="Médiá / denník" title="Myšlienky, ktoré rastú." description="O záhradách. O architektúre. O malých veciach, ktoré robia život vonku krajším." />
      <section className="container journal-section" aria-label="Články a inšpirácia"><div className="journal-grid">{articles.map((article) => (
        <Link key={article.slug} href={`/media/${article.slug}`} className="journal-card"><div className="journal-image image-wrap"><Image src={article.image} alt={article.title} fill sizes="(max-width: 640px) 90vw, (max-width: 1000px) 45vw, 28vw" className="cover-image" /></div><div className="journal-meta"><span>{article.category}</span><span>{article.readTime}</span></div><h2>{article.title}</h2><p>{article.excerpt}</p><span className="journal-read">Prečítať príbeh<ArrowIcon /></span></Link>
      ))}</div><p className="content-disclaimer">Redakčný denník ukážkového webu. Fotografie sú ilustračné.</p></section>
      <ContactBanner />
    </>
  );
}