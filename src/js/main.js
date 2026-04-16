// Arbora — Living Architecture JS

// ── Mobile nav toggle ──

const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        toggle.textContent = isOpen ? '\u2715' : '\u2630';
        toggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            toggle.textContent = '\u2630';
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
}

// ── Active nav link ──

const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || currentPage.startsWith(href.replace('.html', '-'))) {
        link.classList.add('active');
    }
});

// ── Scroll-triggered reveal (progressive enhancement) ──
// Content is visible by default; JS adds animation class

const revealSelectors = [
    '.section',
    '.section-sep',
    '.page-content h2',
    '.page-content h3',
    '.page-content blockquote',
    '.page-content .wip-notice',
    '.page-content .invocation'
];

document.querySelectorAll(revealSelectors.join(', ')).forEach(el => {
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

// ── Staggered reveal for cards and grid items ──

document.querySelectorAll('.value-card').forEach((card, i) => {
    card.classList.add('reveal');
    card.style.transitionDelay = (i * 0.1) + 's';
    revealObserver.observe(card);
});

document.querySelectorAll('.meta-item').forEach((item, i) => {
    item.classList.add('reveal');
    item.style.transitionDelay = (i * 0.06) + 's';
    revealObserver.observe(item);
});

document.querySelectorAll('.principles-list li').forEach((li, i) => {
    li.classList.add('reveal');
    li.style.transitionDelay = (i * 0.07) + 's';
    revealObserver.observe(li);
});

document.querySelectorAll('.canon-card').forEach((card, i) => {
    card.classList.add('reveal');
    card.style.transitionDelay = (i * 0.08) + 's';
    revealObserver.observe(card);
});

// Stagger tradition tags by tier
document.querySelectorAll('.tier').forEach(tier => {
    tier.querySelectorAll('.tag').forEach((tag, i) => {
        tag.classList.add('reveal');
        tag.style.transitionDelay = (i * 0.04) + 's';
        revealObserver.observe(tag);
    });
});

// ── Nav scroll behavior ──

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

// ── Subtle parallax on hero tree ──

const heroTree = document.querySelector('.hero-tree');
if (heroTree) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const heroHeight = window.innerHeight;
                    if (scrollY < heroHeight) {
                        const parallax = scrollY * 0.15;
                        const scale = 1 + (scrollY / heroHeight) * 0.03;
                        heroTree.style.transform =
                            `translate(-50%, calc(-50% + ${parallax}px)) scale(${scale})`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
}

// ── Fade scroll hint on scroll ──

const scrollHint = document.querySelector('.hero-scroll-hint');
if (scrollHint) {
    window.addEventListener('scroll', () => {
        const opacity = Math.max(0, 1 - window.scrollY / 200);
        scrollHint.style.opacity = opacity * 0.6;
    }, { passive: true });
}

// ── Scroll progress bar for content pages ──

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

// ── Interactive SVG Tree ──

const arboraTree = document.getElementById('arbora-tree');

if (arboraTree) {
    // Reveal leaf labels on branch hover/touch
    const branches = arboraTree.querySelectorAll('.tree-branch');

    branches.forEach(branch => {
        const showLeaves = () => {
            branch.querySelectorAll('.leaf-label').forEach(leaf => {
                leaf.style.opacity = '0.8';
            });
        };

        const hideLeaves = () => {
            branch.querySelectorAll('.leaf-label').forEach(leaf => {
                leaf.style.opacity = '';
            });
        };

        branch.addEventListener('mouseenter', showLeaves);
        branch.addEventListener('mouseleave', hideLeaves);
        branch.addEventListener('focusin', showLeaves);
        branch.addEventListener('focusout', hideLeaves);
    });

    // Scroll-triggered reveal for the tree itself
    const treeContainer = document.querySelector('.tree-svg-container');
    if (treeContainer) {
        treeContainer.classList.add('reveal');
        revealObserver.observe(treeContainer);
    }
}
