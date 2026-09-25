/* ============================================
   Portfolio interactions
   ============================================ */
(function () {
  'use strict';

  const body = document.body;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme (dark mode) ---------- */
  const modeToggle = document.getElementById('modeToggle');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (modeToggle) {
      const dark = theme === 'dark';
      modeToggle.setAttribute('aria-checked', String(dark));
      modeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      applyTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    }
  } catch (e) { /* localStorage unavailable */ }

  if (modeToggle) {
    modeToggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
    });
  }

  /* ---------- Typing effect ---------- */
  const typedEl = document.getElementById('typedText');
  if (typedEl && !prefersReducedMotion) {
    const phrases = ['Computer Scientist', 'Front-End Developer', 'React Developer', 'Lifelong Learner'];
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {
      const current = phrases[phraseIndex];
      typedEl.textContent = current.slice(0, charIndex);

      if (!deleting && charIndex < current.length) {
        charIndex++;
        setTimeout(type, 90);
      } else if (!deleting) {
        deleting = true;
        setTimeout(type, 1800);
      } else if (charIndex > 0) {
        charIndex--;
        setTimeout(type, 45);
      } else {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 350);
      }
    }
    type();
  } else if (typedEl) {
    typedEl.textContent = 'Computer Scientist';
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 70}ms`;
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Navbar shadow + progress bar + back-to-top ---------- */
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('progressBar');
  const backToTop = document.getElementById('backToTop');
  const navHeight = navbar ? navbar.offsetHeight : 100;
  const aboutContainer = document.querySelector('.about-me__info--container');

  function onScroll() {
    const scrollY = window.scrollY;

    if (navbar) {
      navbar.classList.toggle('nav--scrolled', scrollY > 10);

      // Header exists only over the hero: once the about-me info container
      // has scrolled past the header, the nav slides up and away
      if (aboutContainer) {
        const rect = aboutContainer.getBoundingClientRect();
        navbar.classList.toggle('nav--hidden', rect.bottom < navHeight);
      }
    }

    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = docHeight > 0 ? `${(scrollY / docHeight) * 100}%` : '0%';
    }

    if (backToTop) backToTop.classList.toggle('visible', scrollY > 600);

    ticking = false; // re-arm the scroll handler
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Mobile menu (hamburger) ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOverlay = document.getElementById('overlay');
  const menuClose = document.querySelector('.mobile-menu__close');

  function setMenu(open) {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('open', open);
    if (menuOverlay) menuOverlay.classList.toggle('visible', open);
    body.style.overflow = open ? 'hidden' : '';
    body.classList.toggle('menu-open', open);
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });
  }
  if (menuClose) menuClose.addEventListener('click', () => setMenu(false));
  if (menuOverlay) menuOverlay.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });

  /* ---------- Cursor spotlight glow (follows the pointer) ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    body.appendChild(glow);

    const HALF = 240; // half of the 480px glow
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let glowX = targetX;
    let glowY = targetY;
    let started = false;

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      body.classList.add('cursor-active');

      if (!started) {
        glowX = targetX;
        glowY = targetY;
        started = true;
        requestAnimationFrame(animateGlow);
      }
    });

    function animateGlow() {
      glowX += (targetX - glowX) * 0.08;
      glowY += (targetY - glowY) * 0.08;
      glow.style.transform = `translate(${glowX - HALF}px, ${glowY - HALF}px)`;
      requestAnimationFrame(animateGlow);
    }

    document.addEventListener('mouseleave', () => body.classList.remove('cursor-active'));
    document.addEventListener('mouseenter', () => body.classList.add('cursor-active'));
  }

  /* ---------- Contact modal ---------- */
  const modal = document.getElementById('contactModal');

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-modal]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (modal) {
    modal.querySelectorAll('[data-close-modal]').forEach((el) => {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  /* ---------- Contact form: honeypot + validation + robust submit ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const FORM_ENDPOINT = 'https://formsubmit.co/ajax/isacktolesa@gmail.com';
    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fd = new FormData(contactForm);
      const name = (fd.get('name') || '').trim();
      const email = (fd.get('email') || '').trim();
      const message = (fd.get('message') || '').trim();

      // 1) Honeypot: real users never see this field, so a filled one means a bot.
      //    We fake success so bots don't learn the form is protected.
      if ((fd.get('_honey') || '').trim() !== '') {
        contactForm.reset();
        showToast('Message sent! I\'ll get back to you soon. ✅');
        setTimeout(closeModal, 900);
        return;
      }

      // 2) Validation: HTML5 "required" alone lets junk through; check length bounds too.
      if (name.length < 2 || name.length > 100 ||
          !isValidEmail(email) ||
          message.length < 10 || message.length > 5000) {
        showToast('Please check your name, email and message. ❌');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending… <i class="fas fa-spinner fa-spin"></i>';
      }

      // 3) Abort after 15s so the user never hangs on a dead request.
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name: name,
            email: email,
            message: message,
            _subject: `Portfolio message from ${name}`,
            _template: 'table',
            _captcha: 'false',
            _replyto: email,
            _autoresponse: `Hi ${name}, thanks for reaching out through my portfolio! I received your message and will reply to this email soon. — Yisehak`
          }),
          signal: controller.signal
        });

        if (!res.ok) throw new Error(`FormSubmit responded with ${res.status}`);

        showToast('Message sent! I\'ll get back to you soon. ✅');
        contactForm.reset();
        setTimeout(closeModal, 900);
      } catch (err) {
        const offline = !navigator.onLine;
        const aborted = err && err.name === 'AbortError';
        showToast(offline
          ? 'You appear to be offline — please try again. 📡'
          : aborted
            ? 'The request timed out — please try again. ⏳'
            : 'Something went wrong — please try again. ❌');
      } finally {
        clearTimeout(timeoutId);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }

  /* ---------- Toast helper ---------- */
  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  /* ---------- Auto year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
