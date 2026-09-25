/* ============================================
   Portfolio interactions
   ============================================ */
(function () {
  'use strict';

  const body = document.body;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme (dark mode) ---------- */
  const modeImg = document.querySelector('.mode img');
  const html = document.documentElement;

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (modeImg) {
      modeImg.src = theme === 'dark' ? './image/night.png' : './image/light.png';
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

  if (modeImg) {
    modeImg.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
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

  /* ---------- Skill levels on hover ---------- */
  document.querySelectorAll('.language').forEach((el) => {
    const level = el.getAttribute('data-level');
    if (!level) return;
    const label = document.createElement('span');
    label.className = 'language__level';
    label.textContent = `${level}%`;
    el.appendChild(label);
  });

  /* ---------- Navbar shadow + progress bar + back-to-top (one scroll handler) ---------- */
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('progressBar');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrollY = window.scrollY;

    if (navbar) navbar.classList.toggle('nav--scrolled', scrollY > 10);

    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = docHeight > 0 ? `${(scrollY / docHeight) * 100}%` : '0%';
    }

    if (backToTop) backToTop.classList.toggle('visible', scrollY > 600);
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

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function setMenu(open) {
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('open', open);
    body.style.overflow = open ? 'hidden' : '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });
  }

  /* ---------- Project card 3D tilt ---------- */
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      const maxTilt = 4;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * maxTilt * 2}deg) rotateX(${-y * maxTilt * 2}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
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

  /* ---------- Copy email ---------- */
  const copyBtn = document.getElementById('copyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = 'isacktolesa@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast('Email copied to clipboard! 📋');
      } catch (err) {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = email;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Email copied to clipboard! 📋');
      }
    });
  }

  /* ---------- Contact form -> mailto ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const name = (fd.get('name') || '').trim();
      const email = (fd.get('email') || '').trim();
      const message = (fd.get('message') || '').trim();

      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const bodyText = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:isacktolesa@gmail.com?subject=${subject}&body=${bodyText}`;

      showToast('Opening your email app… ✉️');
      closeModal();
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
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  /* ---------- Auto year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Language level tooltip injected above ---------- */
})();
