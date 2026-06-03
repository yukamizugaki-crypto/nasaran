/* =============================================
   nasaran — JavaScript
   Scroll reveals, char animations, nav behavior
   ============================================= */

'use strict';

// ── 1. Header: add .scrolled on scroll ──────────────────────────────────────
const header = document.querySelector('.site-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const st = window.scrollY;
  if (st > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  lastScroll = st;
}, { passive: true });


// ── 2. Mobile nav toggle ────────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const globalNav = document.getElementById('globalNav');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  globalNav.classList.toggle('open');
  document.body.classList.toggle('nav-open');
  document.body.style.overflow = globalNav.classList.contains('open') ? 'hidden' : '';
});

// Close nav on link click
globalNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    globalNav.classList.remove('open');
    document.body.classList.remove('nav-open');
    document.body.style.overflow = '';
  });
});


// ── 3. Intersection Observer — scroll reveals ───────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.js-reveal').forEach(el => revealObserver.observe(el));


// ── 4. Hero fadeup elements ──────────────────────────────────────────────────
// Trigger after page load with staggered delays
window.addEventListener('load', () => {
  const fadeEls = document.querySelectorAll('.js-fadeup');
  fadeEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 800 + i * 200);
  });
});


// ── 5. Character-split animation for hero text ──────────────────────────────
function splitChars(el) {
  const text = el.getAttribute('data-text') || el.textContent;
  el.innerHTML = '';
  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.transitionDelay = `${0.35 + i * 0.06}s`;
    el.appendChild(span);
  });
}

document.querySelectorAll('.reveal-char').forEach(el => splitChars(el));

// Observe reveal-char elements
const charObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        charObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

// Hero chars fire on load
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal-char').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
  });
  // Non-hero reveal-chars use observer
  document.querySelectorAll('.reveal-char:not(.hero .reveal-char)').forEach(el => {
    charObserver.observe(el);
  });
});


// ── 6. Smooth scroll offset for fixed header ────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 24;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// ── 7. Stagger children in grids on reveal ──────────────────────────────────
function staggerChildren(parentSelector, childSelector, delay = 0.1) {
  document.querySelectorAll(parentSelector).forEach(parent => {
    const children = parent.querySelectorAll(childSelector);
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * delay}s`;
    });
  });
}

staggerChildren('.course-grid', '.course-card', 0.12);
staggerChildren('.menu-grid', '.menu-card, .menu-others', 0.1);


// ── 8. Parallax-lite for hero bg on scroll ──────────────────────────────────
const heroBg = document.querySelector('.hero-img-placeholder');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight * 1.5) {
      heroBg.style.transform = `translateY(${scrolled * 0.25}px)`;
    }
  }, { passive: true });
}


// ── 9. Cursor: subtle amber dot on desktop ──────────────────────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  const dot = document.createElement('div');
  dot.id = 'cursorDot';
  Object.assign(dot.style, {
    position: 'fixed',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'rgba(212,149,106,0.7)',
    pointerEvents: 'none',
    zIndex: '9999',
    transform: 'translate(-50%,-50%)',
    transition: 'opacity 0.2s',
    mixBlendMode: 'screen',
  });
  document.body.appendChild(dot);

  let mx = 0, my = 0;
  let cx = 0, cy = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animateDot() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    dot.style.left = cx + 'px';
    dot.style.top = cy + 'px';
    requestAnimationFrame(animateDot);
  }
  animateDot();
}


// ── 10. Ginger Ale Popup Modal ──────────────────────────────────────────────
const gingerTrigger = document.getElementById('gingerTrigger');
const gingerModal = document.getElementById('gingerModal');
const gingerModalClose = document.getElementById('gingerModalClose');

if (gingerTrigger && gingerModal && gingerModalClose) {
  gingerTrigger.addEventListener('click', () => {
    gingerModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const closeModal = () => {
    gingerModal.classList.remove('open');
    if (!document.body.classList.contains('nav-open')) {
      document.body.style.overflow = '';
    }
  };

  gingerModalClose.addEventListener('click', closeModal);
  gingerModal.addEventListener('click', (e) => {
    if (e.target === gingerModal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && gingerModal.classList.contains('open')) {
      closeModal();
    }
  });
}


// ── 11. Private Section Image Slider ─────────────────────────────────────────
const slides = document.querySelectorAll('.private-slider .slide');
if (slides.length > 1) {
  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 4000);
}
