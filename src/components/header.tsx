"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/lib/content";
import { ArrowIcon, CloseIcon, LeafMark } from "@/components/icons";

export function Header() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen]);

  function openMenu() {
    dialogRef.current?.showModal();
    setMenuOpen(true);
  }

  function closeMenu() {
    dialogRef.current?.close();
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="Eden Gardens — úvodná stránka">
            <LeafMark className="brand-mark" /><span>EDEN GARDENS</span>
          </Link>
          <nav className="desktop-nav" aria-label="Hlavná navigácia">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
          <button ref={toggleRef} className="menu-toggle" onClick={openMenu} aria-label="Otvoriť navigáciu" aria-expanded={menuOpen} aria-controls="navigation-drawer">
            <span /><span /><span />
          </button>
        </div>
      </header>
      <dialog
        id="navigation-drawer"
        className="navigation-drawer"
        ref={dialogRef}
        aria-label="Navigácia"
        onClose={() => { setMenuOpen(false); toggleRef.current?.focus(); }}
        onClick={(event) => { if (event.target === event.currentTarget) closeMenu(); }}
      >
        <div className="drawer-content">
          <div className="drawer-top"><LeafMark /><button className="icon-button" onClick={closeMenu} aria-label="Zavrieť navigáciu" autoFocus><CloseIcon /></button></div>
          <p className="eyebrow">Miesto pre váš nový príbeh</p>
          <nav aria-label="Rozšírená navigácia" className="drawer-nav">
            <Link href="/" onClick={closeMenu} aria-current={pathname === "/" ? "page" : undefined}><span>00</span>Úvod<ArrowIcon /></Link>
            {navigation.map((item, index) => (
              <Link key={item.href} href={item.href} onClick={closeMenu} aria-current={isActive(item.href) ? "page" : undefined}>
                <span>0{index + 1}</span>{item.label}<ArrowIcon />
              </Link>
            ))}
          </nav>
          <p className="drawer-note">Záhrady s myšlienkou.<br />Priestory pre život.</p>
        </div>
      </dialog>
    </>
  );
}