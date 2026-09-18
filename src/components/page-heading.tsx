import Link from "next/link";

export function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <section className="page-heading container">
      <div className="breadcrumb"><Link href="/">Eden Gardens</Link><span aria-hidden="true">/</span><span>{eyebrow}</span></div>
      <p className="eyebrow">{eyebrow}</p>
      <div className="page-heading-row"><h1>{title}</h1>{description && <p>{description}</p>}</div>
    </section>
  );
}