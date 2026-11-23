/* CIAPOL — interactions */
(function () {
  'use strict';

  /* ---------------------------------------------------------- Navigation */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------------------- Header scroll */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.style.paddingBlock = window.scrollY > 24 ? '8px' : '16px';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------ Reveal on view */
  const items = document.querySelectorAll('.reveal');
  if (items.length) {
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-in'));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in');
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      );
      items.forEach((el) => io.observe(el));
    }
  }

  /* ------------------------------------------------ Bandeau défilant loop */
  document.querySelectorAll('.ticker__track').forEach((track) => {
    if (track.dataset.cloned === 'true') return;
    track.innerHTML += track.innerHTML;
    track.dataset.cloned = 'true';
  });

  /* --------------------------------------------------------- Formulaire */
  document.querySelectorAll('form[data-demo]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = form.querySelector('[data-status]');
      if (status) {
        status.hidden = false;
        status.textContent =
          'Maquette de démonstration — le message n’a pas été envoyé. Connectez le formulaire au back-office du CIAPOL.';
      }
    });
  });

  /* ------------------------------------------------------------ Compteurs */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const animate = (el) => {
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            io2.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => io2.observe(el));
  }

  /* ---------------------------------------------------------------- Année */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
