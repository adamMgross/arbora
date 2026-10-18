import { onScroll } from './scroll';

export function initHero(): void {
  const heroTree = document.querySelector<HTMLElement>('.hero-tree');
  if (heroTree && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    onScroll((scrollY) => {
      const heroHeight = window.innerHeight;
      if (scrollY >= heroHeight) return;
      const parallax = scrollY * 0.15;
      const scale = 1 + (scrollY / heroHeight) * 0.03;
      heroTree.style.transform = `translate(-50%, calc(-50% + ${parallax}px)) scale(${scale})`;
    });
  }

  const scrollHint = document.querySelector<HTMLElement>('.hero-scroll-hint');
  if (scrollHint) {
    onScroll((scrollY) => {
      const opacity = Math.max(0, 1 - scrollY / 200);
      scrollHint.style.opacity = String(opacity * 0.6);
    });
  }
}
