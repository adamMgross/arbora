const REVEAL_SELECTORS = [
  '.section',
  '.section-sep',
  '.page-content h2',
  '.page-content h3',
  '.page-content blockquote',
  '.page-content .invocation',
];

const STAGGERS: Array<[selector: string, step: number]> = [
  ['.value-card', 0.1],
  ['.meta-item', 0.06],
  ['.principles-list li', 0.07],
  ['.canon-card', 0.08],
];

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
);

export function reveal(el: Element, delaySeconds?: number): void {
  el.classList.add('reveal');
  if (delaySeconds !== undefined) (el as HTMLElement).style.transitionDelay = `${delaySeconds}s`;
  observer.observe(el);
}

export function initReveal(): void {
  document.querySelectorAll(REVEAL_SELECTORS.join(', ')).forEach((el) => el.classList.add('reveal'));
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  for (const [selector, step] of STAGGERS) {
    document.querySelectorAll(selector).forEach((el, i) => reveal(el, i * step));
  }
  document.querySelectorAll('.tier').forEach((tier) => {
    tier.querySelectorAll('.tag').forEach((tag, i) => reveal(tag, i * 0.04));
  });
}
