import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TextLink } from "@/components/text-link";
import { ContactBanner } from "@/components/contact-banner";
import { articles } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) return { title: "Článok sa nenašiel" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/media/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.excerpt, publishedTime: article.date, images: [{ url: article.image, alt: article.title }] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  return (
    <>
      <article>
        <header className="container article-heading"><div className="breadcrumb"><Link href="/media">Denník</Link><span aria-hidden="true">/</span><span>{article.category}</span></div><p className="eyebrow">{article.category} <span className="eyebrow-divider">/</span> {article.readTime}</p><h1>{article.title}</h1><p className="article-excerpt">{article.excerpt}</p><time dateTime={article.date}>{new Intl.DateTimeFormat("sk", { dateStyle: "long", timeZone: "UTC" }).format(new Date(article.date))}</time></header>
        <div className="container article-cover image-wrap"><Image src={article.image} alt={article.title} fill priority sizes="90vw" className="cover-image" /></div>
        <div className="article-body">{article.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}<div className="article-signature"><span className="eyebrow">Denník Eden Gardens</span><p>Inšpirácia pre váš život vonku.</p></div><TextLink href="/media">Späť na všetky články</TextLink></div>
      </article>
      <ContactBanner />
    </>
  );
}