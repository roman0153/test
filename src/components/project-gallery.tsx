"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowIcon, CloseIcon } from "@/components/icons";

export function ProjectGallery({ images, title }: { images: { src: string; alt: string }[]; title: string }) {
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  function show(index: number) {
    setSelected(index);
    dialogRef.current?.showModal();
    setOpen(true);
  }

  function next(direction: number) {
    setSelected((current) => (current + direction + images.length) % images.length);
  }

  return (
    <>
      <div className="project-gallery">
        {images.map((image, index) => (
          <button key={image.src} className="gallery-image image-wrap" onClick={() => show(index)} aria-label={`Zväčšiť fotografiu: ${image.alt}`}>
            <Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 90vw, 45vw" className="cover-image" /><span className="gallery-expand" aria-hidden="true">+</span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={`Fotogaléria — ${title}`}
        onClose={() => setOpen(false)}
        onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); next(1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); next(-1); }
        }}
      >
        <div className="lightbox-top"><span>{title}</span><button className="icon-button" onClick={() => dialogRef.current?.close()} aria-label="Zavrieť fotogalériu" autoFocus><CloseIcon /></button></div>
        <div className="lightbox-picture"><Image src={images[selected].src} alt={images[selected].alt} fill sizes="90vw" style={{ objectFit: "contain" }} /></div>
        <div className="lightbox-bottom"><button className="icon-button lightbox-previous" onClick={() => next(-1)} aria-label="Predchádzajúca fotografia"><ArrowIcon /></button><p aria-live="polite">{images[selected].alt}<span>{selected + 1} / {images.length}</span></p><button className="icon-button" onClick={() => next(1)} aria-label="Nasledujúca fotografia"><ArrowIcon /></button></div>
      </dialog>
    </>
  );
}