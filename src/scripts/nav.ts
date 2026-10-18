import { onScroll } from './scroll';

function initMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
  const navLinks = document.querySelector<HTMLElement>('.nav-links');
  if (!toggle || !navLinks) return;

  const setOpen = (open: boolean) => {
    navLinks.classList.toggle('open', open);
    toggle.textContent = open ? '✕' : '☰';
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => setOpen(!navLinks.classList.contains('open')));
  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
}

function markActiveLink() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll<HTMLAnchorElement>('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href') ?? '';
    if (href === currentPage || currentPage.startsWith(href.replace('.html', '-'))) link.classList.add('active');
  });
}

function initScrollState() {
  const nav = document.querySelector<HTMLElement>('.site-nav');
  if (!nav) return;
  let lastScroll = 0;
  onScroll((scrollY) => {
    nav.classList.toggle('scrolled', scrollY > 60);
    if (scrollY > 400) {
      if (scrollY > lastScroll + 8) nav.classList.add('nav-hidden');
      else if (scrollY < lastScroll - 8) nav.classList.remove('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }
    lastScroll = scrollY;
  });
}

export function initNav(): void {
  initMenu();
  markActiveLink();
  initScrollState();
}
