"use client";

import { useEffect } from "react";
import { observeScrollReveals } from "@/lib/scroll-reveal";

export function ScrollAnimations() {
  useEffect(() => {
    const main = document.getElementById("main-content");
    if (main) return observeScrollReveals(main);
  }, []);

  return null;
}