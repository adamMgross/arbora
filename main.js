// Arbora — main JS

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        toggle.textContent = isOpen ? '✕' : '☰';
        toggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            toggle.textContent = '☰';
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
}

// Active nav link
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
        link.classList.add('active');
    }
});

// Scroll-triggered reveal (progressive enhancement)
// Content is visible by default; JS adds animation class
document.querySelectorAll('.section, .page-content h2, .page-content h3, .page-content blockquote, .page-content .wip-notice').forEach(el => {
    el.classList.add('reveal');
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Staggered reveal for value cards
document.querySelectorAll('.value-card').forEach((card, i) => {
    card.classList.add('reveal');
    card.style.transitionDelay = (i * 0.08) + 's';
    revealObserver.observe(card);
});

// Nav scroll behavior
const nav = document.querySelector('.site-nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    // Hide on scroll down, show on scroll up (past initial content)
    if (scrollY > 400) {
        if (scrollY > lastScroll + 8) {
            nav.classList.add('nav-hidden');
        } else if (scrollY < lastScroll - 8) {
            nav.classList.remove('nav-hidden');
        }
    } else {
        nav.classList.remove('nav-hidden');
    }

    lastScroll = scrollY;
}, { passive: true });

// Scroll progress bar for content pages
if (document.querySelector('.page-content')) {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        bar.style.width = progress + '%';
    }, { passive: true });
}
