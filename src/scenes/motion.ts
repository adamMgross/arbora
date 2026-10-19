const query = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;

export const reducedMotion = (): boolean => query?.matches ?? false;

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, reducedMotion() ? 0 : ms));
}

export function animate(duration: number, frame: (progress: number) => void): Promise<void> {
  if (reducedMotion()) {
    frame(1);
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      frame(1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

const navBottom = (): number => Math.max(0, document.querySelector('.site-nav')?.getBoundingClientRect().bottom ?? 0);

export function reveal(el: Element, block: ScrollLogicalPosition = 'start'): void {
  const r = el.getBoundingClientRect();
  const settled = r.top >= navBottom() && (r.bottom <= innerHeight || (block === 'start' && r.top < innerHeight / 3));
  if (!settled) el.scrollIntoView({ block, behavior: reducedMotion() ? 'auto' : 'smooth' });
}
