type ScrollHandler = (scrollY: number) => void;

const handlers: ScrollHandler[] = [];
let queued = false;

function flush() {
  queued = false;
  const scrollY = window.scrollY;
  for (const handler of handlers) handler(scrollY);
}

function schedule() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(flush);
}

export function onScroll(handler: ScrollHandler): void {
  if (handlers.length === 0) window.addEventListener('scroll', schedule, { passive: true });
  handlers.push(handler);
}
