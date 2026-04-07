// ── Page transition overlay ───────────────────────────────────
// Shared by main.js and start.js.
// On load:     overlay fades out  (page-in reveal)
// On navigate: overlay fades in, then browser navigates (page-out)

export function initPageTransitions() {
  const overlay = document.getElementById("pageTransition");
  if (!overlay) return;

  // Page-in: double rAF ensures the first paint has happened
  // before we start fading, so the overlay is actually visible first.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add("is-out");
    });
  });

  // Page-out: intercept same-origin link clicks
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href) return;

    // Skip hash-only, mailto, tel, new-tab links
    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      link.target === "_blank"
    ) return;

    // Skip cross-origin
    try {
      const url = new URL(href, location.href);
      if (url.origin !== location.origin) return;
    } catch {
      return;
    }

    e.preventDefault();
    overlay.classList.remove("is-out");

    // Wait for fade-in to finish, then navigate
    setTimeout(() => {
      location.href = href;
    }, 360);
  });
}
