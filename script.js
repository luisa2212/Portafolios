/* =============================================
   script.js  –  Portfolio JS
   ============================================= */

// ── 1. Set current year in footer ────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── 2. Navbar: scroll shadow + active link highlighting ──────────────────────
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  // Scroll shadow
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link
  let currentId = '';
  sections.forEach(section => {
    const top = section.offsetTop - 90;
    if (window.scrollY >= top) {
      currentId = section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

// ── 3. Mobile hamburger menu ──────────────────────────────────────────────────
const hamburger    = document.getElementById('hamburger');
const navLinksEl   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close menu when a nav link is clicked
navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ── 4. Scroll-reveal animation (Intersection Observer) ───────────────────────
const revealElements = document.querySelectorAll(
  '.project-card, .about-grid, .contact-grid, .info-item'
);

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

// Add base style for reveal, then observe
revealElements.forEach(el => {
  el.style.opacity  = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  revealObserver.observe(el);
});

// Helper: add revealed class via JS (avoids needing CSS class definitions here)
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .revealed {
      opacity: 1 !important;
      transform: none !important;
    }
  </style>
`);

// ── 5. Contact form validation & submission ───────────────────────────────────
const form       = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

const fields = [
  { id: 'name',    errorId: 'nameError',    label: 'Name',    validate: v => v.trim().length >= 2 },
  { id: 'email',   errorId: 'emailError',   label: 'Email',   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
  { id: 'subject', errorId: 'subjectError', label: 'Subject', validate: v => v.trim().length >= 3 },
  { id: 'message', errorId: 'messageError', label: 'Message', validate: v => v.trim().length >= 10 },
];

function validateField(fieldConfig) {
  const input     = document.getElementById(fieldConfig.id);
  const errorSpan = document.getElementById(fieldConfig.errorId);
  const value     = input.value;

  if (!fieldConfig.validate(value)) {
    if (fieldConfig.id === 'email') {
      errorSpan.textContent = 'Please enter a valid email address.';
    } else {
      errorSpan.textContent = `${fieldConfig.label} is required.`;
    }
    input.classList.add('invalid');
    return false;
  }

  errorSpan.textContent = '';
  input.classList.remove('invalid');
  return true;
}

// Real-time validation on blur
fields.forEach(f => {
  const input = document.getElementById(f.id);
  input.addEventListener('blur', () => validateField(f));
  input.addEventListener('input', () => {
    if (input.classList.contains('invalid')) validateField(f);
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();

  const allValid = fields.map(validateField).every(Boolean);
  if (!allValid) return;

  // Simulate async send
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  setTimeout(() => {
    form.reset();
    fields.forEach(f => {
      document.getElementById(f.id).classList.remove('invalid');
      document.getElementById(f.errorId).textContent = '';
    });
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
    formSuccess.classList.add('visible');
    setTimeout(() => formSuccess.classList.remove('visible'), 4000);
  }, 1000);
});
