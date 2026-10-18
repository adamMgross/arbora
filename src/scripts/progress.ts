import { onScroll } from './scroll';

export function initProgress(): void {
  if (!document.querySelector('.page-content')) return;
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  onScroll((scrollY) => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${docHeight > 0 ? (scrollY / docHeight) * 100 : 0}%`;
  });
}
