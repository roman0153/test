import { LeafMark } from "@/components/icons";
import { TextLink } from "@/components/text-link";

export default function NotFound() {
  return (
    <section className="container empty-state"><LeafMark /><p className="eyebrow">404 / Cestička sa končí</p><h1>Táto stránka<br />ešte nevyrástla.</h1><p>Možno ste odbočili inam. Vráťte sa na úvod a nájdite svoju inšpiráciu.</p><TextLink href="/">Späť do záhrady</TextLink></section>
  );
}