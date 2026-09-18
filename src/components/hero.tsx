"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowIcon } from "@/components/icons";
import { TextLink } from "@/components/text-link";
import { projects } from "@/lib/content";

const slides = [projects[0], projects[2], projects[3]];

export function Hero() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Rotation is opt-in. Entering with a pointer or keyboard stops it until
    // the visitor explicitly presses play again; reduced-motion CSS removes fades.
    if (!playing) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((previous) => (previous + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [playing, active]);

  function changeSlide(direction: number) {
    setActive((previous) => (previous + direction + slides.length) % slides.length);
  }

  return (
    <section
      className="hero"
      aria-label="Záhrady Eden Gardens"
      aria-roledescription="prezentácia"
      onPointerEnter={() => setPlaying(false)}
      onFocusCapture={() => setPlaying(false)}
    >
      <div className="hero-slides" aria-hidden="true">
        {slides.map((slide, index) => (
          <div key={slide.slug} className={`hero-slide ${index === active ? "is-active" : ""}`}>
            <Image src={slide.image} alt="" fill sizes="100vw" priority={index === 0} className="cover-image" />
          </div>
        ))}
      </div>
      <div className="hero-shade" />
      <div className="container hero-content">
        <p className="eyebrow hero-eyebrow">Záhradná architektúra s citom</p>
        <h1>Záhrady, ktoré<br />sa stanú domovom.</h1>
        <p className="hero-services">Návrh <span>·</span> Realizácia <span>·</span> Údržba</p>
        <TextLink href="/realizacie" light>Pozrieť realizácie</TextLink>
      </div>
      <div className="container hero-bottom">
        <div className="hero-caption" aria-live={playing ? "off" : "polite"} aria-atomic="true"><span className="hero-caption-line" /><span>{slides[active].title}<small>Ilustračný koncept · {slides[active].location}</small></span></div>
        <div className="hero-controls">
          <button className="icon-button hero-play" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pozastaviť prezentáciu" : "Spustiť prezentáciu"} aria-pressed={playing}>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">{playing ? <path d="M7 5v10M13 5v10" stroke="currentColor" strokeWidth="1.4" /> : <path d="m7 5 8 5-8 5V5Z" stroke="currentColor" strokeWidth="1.1" />}</svg>
          </button>
          <button className="icon-button hero-previous" onClick={() => changeSlide(-1)} aria-label="Predchádzajúca záhrada"><ArrowIcon /></button>
          <span className="hero-count"><span>0{active + 1}</span><span className="hero-count-divider" /><span>0{slides.length}</span></span>
          <button className="icon-button" onClick={() => changeSlide(1)} aria-label="Nasledujúca záhrada"><ArrowIcon /></button>
        </div>
      </div>
    </section>
  );
}