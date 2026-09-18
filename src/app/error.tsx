"use client";

import Link from "next/link";
import { LeafMark } from "@/components/icons";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container empty-state"><LeafMark /><p className="eyebrow">Malá prestávka</p><h1>Niečo sa nepodarilo.</h1><p>Skúste stránku načítať znova. Vaša záhrada nikam neodíde.</p><div className="empty-actions"><button className="solid-button" onClick={reset}>Skúsiť znova</button><Link href="/" className="outline-button">Späť na úvod</Link></div></section>
  );
}