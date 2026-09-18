const REVEAL_SELECTOR = "[data-reveal]";

/** Enhance existing markup without hiding it in CSS or changing React's DOM. */
export function observeScrollReveals(root: HTMLElement): () => void {
  if (
    typeof window === "undefined" ||
    typeof IntersectionObserver === "undefined" ||
    typeof MutationObserver === "undefined" ||
    typeof window.matchMedia !== "function" ||
    typeof root.animate !== "function"
  ) return () => {};

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const printMedia = window.matchMedia("print");
  const seen = new WeakSet<HTMLElement>();
  const pending = new Set<HTMLElement>();
  const playing = new Map<HTMLElement, Animation>();
  let disposed = false;

  function isReadingTarget(element: HTMLElement) {
    return element.contains(document.activeElement) ||
      !!element.closest(":target") || !!element.querySelector(":target");
  }

  function finish(element: HTMLElement) {
    observer.unobserve(element);
    pending.delete(element);
    playing.get(element)?.cancel();
    playing.delete(element);
  }

  function finishAll() {
    for (const element of pending) observer.unobserve(element);
    pending.clear();
    for (const animation of playing.values()) animation.cancel();
    playing.clear();
  }

  function play(element: HTMLElement) {
    if (disposed || reducedMotion.matches || printMedia.matches || !root.contains(element) || isReadingTarget(element)) return;

    const style = window.getComputedStyle(element);
    const distance = style.getPropertyValue("--reveal-distance").trim() || "24px";
    const scale = style.getPropertyValue("--reveal-scale").trim() || "1";

    // The effect exists only while playing. Failed/unsupported animations leave
    // the normal, visible content intact; no hidden classes or inline styles persist.
    try {
      const animation = element.animate([
        { opacity: 0, transform: `translate3d(0, ${distance}, 0) scale(${scale})` },
        { opacity: 1, transform: "none" },
      ], {
        duration: Number.parseFloat(style.getPropertyValue("--reveal-duration")) || 760,
        delay: Number.parseFloat(style.getPropertyValue("--reveal-delay")) || 0,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards",
      });

      playing.set(element, animation);
      animation.onfinish = () => finish(element);
      animation.oncancel = () => playing.delete(element);
    } catch {
      // Animation is decorative and must never prevent access to the content.
    }
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting || !(entry.target instanceof HTMLElement) || !pending.has(entry.target)) continue;
      observer.unobserve(entry.target);
      pending.delete(entry.target);
      play(entry.target);
    }
  }, { rootMargin: "0px 0px 24px 0px", threshold: 0 });

  function register(element: HTMLElement) {
    if (seen.has(element)) return;
    seen.add(element);

    // Never fade out content already on screen after hydration, filtering or
    // scroll restoration. Headings/LCP images are intentionally not annotated.
    if (reducedMotion.matches || printMedia.matches || isReadingTarget(element) || element.getBoundingClientRect().top < window.innerHeight) return;
    pending.add(element);
    observer.observe(element);
  }

  function scan(element: HTMLElement) {
    if (element.matches(REVEAL_SELECTOR)) register(element);
    element.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(register);
  }

  // Next.js streams/replaces route content and the portfolio inserts cards when
  // filtered. Observe additions, not attributes, so React stays in control.
  const mutations = new MutationObserver((records) => {
    if (disposed) return;
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof HTMLElement && root.contains(node)) scan(node);
      }
    }
    for (const element of pending) {
      if (!root.contains(element)) finish(element);
    }
    for (const element of playing.keys()) {
      if (!root.contains(element)) finish(element);
    }
  });

  function finishWithin(target: Element) {
    for (const element of [...pending, ...playing.keys()]) {
      if (element.contains(target) || target.contains(element)) finish(element);
    }
  }

  function onFocus(event: FocusEvent) {
    if (event.target instanceof Element) finishWithin(event.target);
  }

  function onHashChange() {
    const target = root.querySelector(":target");
    if (target) finishWithin(target);
  }

  function onMotionChange() {
    if (reducedMotion.matches || printMedia.matches) finishAll();
  }

  scan(root);
  mutations.observe(root, { childList: true, subtree: true });
  root.addEventListener("focusin", onFocus);
  window.addEventListener("hashchange", onHashChange);
  window.addEventListener("beforeprint", finishAll);
  reducedMotion.addEventListener("change", onMotionChange);
  printMedia.addEventListener("change", onMotionChange);

  return () => {
    disposed = true;
    finishAll();
    observer.disconnect();
    mutations.disconnect();
    root.removeEventListener("focusin", onFocus);
    window.removeEventListener("hashchange", onHashChange);
    window.removeEventListener("beforeprint", finishAll);
    reducedMotion.removeEventListener("change", onMotionChange);
    printMedia.removeEventListener("change", onMotionChange);
  };
}