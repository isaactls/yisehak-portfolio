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
  let lastFocusedElement = null;

  function openModal() {
    lastFocusedElement = document.activeElement;
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
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  // Focus trap: keep Tab/Shift+Tab cycling inside the modal while it is open
  if (modal) {
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !modal.classList.contains('open')) return;

      const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const focusable = Array.from(modal.querySelectorAll(focusableSelectors)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
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

  /* ---------- Contact form: validation + honeypot (Web3Forms handles delivery) ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

    // Heuristic: try a HEAD request to a URL that ad-blockers almost always
    // block. If the request fails we can infer an ad-blocker is intercepting
    // requests (which likely also blocked the form submission to the API).
    async function isAdBlockerActive() {
      try {
        await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-store'
        });
        return false; // request went through -> no blocker
      } catch (e) {
        return true; // request blocked -> almost certainly an ad-blocker
      }
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fd = new FormData(contactForm);
      const name = (fd.get('name') || '').trim();
      const email = (fd.get('email') || '').trim();
      const message = (fd.get('message') || '').trim();

      // 1) Honeypot: real users never see this field, so a filled one means a bot.
      if ((fd.get('botcheck') || '').trim() !== '') {
        contactForm.reset();
        showToast('Message sent! I\'ll get back to you soon. ✅');
        setTimeout(closeModal, 900);
        return;
      }

      // 2) Validation: check each field and show specific error messages
      if (!name) {
        showToast('Please enter your name. ❌');
        return;
      }
      if (!isValidEmail(email)) {
        showToast('Please enter a valid email address. ❌');
        return;
      }
      if (!message) {
        showToast('Please enter a message. ❌');
        return;
      }

      // 3) Send via Web3Forms (https://docs.web3forms.com) using fetch, so we
      //    can show a real success/failure message without leaving the page.
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      showToast('Sending your message…');

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: contactForm.access_key.value,
            subject: contactForm.subject.value,
            name: name,
            email: email,
            message: message
          })
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && data.success) {
          contactForm.reset();
          closeModal();
          showToast('Message sent! I\'ll get back to you soon. ✅');
        } else {
          showToast('Something went wrong. Please email me directly instead. ❌');
        }
      } catch (err) {
        // fetch() only rejects like this when the request never completed:
        // offline, DNS/network failure, or an ad-blocker killing the call.
        let msg = 'Network error. Please email me directly instead. ❌';
        if (navigator.onLine === false) {
          msg = 'You appear to be offline. Check your connection and try again. ❌';
        } else if (await isAdBlockerActive()) {
          msg = 'Ad-blocker detected! It blocked your message. Please disable it for this site and send again. 🚫';
        }
        showToast(msg, 8000);
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  /* ---------- Toast helper ---------- */
  let toastTimer;
  function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
  }

  /* ---------- Auto year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
