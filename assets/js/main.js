/* ==========================================================================
   CIAPOL — moteur d'interaction & motion design
   Ordre : core UI → préparation du DOM → moteur scroll → scène d'intro → reveals
   Si ce fichier ne s'exécute pas, html.motion-active n'est jamais posé :
   le site reste entièrement lisible (fail-safe).
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var canObserve = 'IntersectionObserver' in window;
  var reduce = root.classList.contains('reduced') ||
               window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Sécurité : si ce fichier ne s'exécutait pas, le timer inline libère la page */
  if (window.__ciapolFailsafe) clearTimeout(window.__ciapolFailsafe);

  initCore();

  if (reduce || !canObserve) {
    root.classList.remove('wipe-in');
    root.classList.add('loaded', 'no-motion');
    return;
  }

  root.classList.add('motion-active');
  prepareDOM();
  initScrollEngine();
  runIntro(startReveals);

  /* ------------------------------------------------------------------ CORE */
  function initCore() {
    /* Rideau de transition entre pages */
    var wipe = document.querySelector('.page-wipe');
    if (wipe) {
      if (root.classList.contains('wipe-in')) {
        /* La page arrive : le rideau recouvre déjà l'écran, on le lève. */
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { wipe.classList.add('is-out'); });
        });
        setTimeout(function () { root.classList.remove('wipe-in'); }, 1100);
      }

      if (!reduce) {
        document.addEventListener('click', function (e) {
          if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey ||
              e.shiftKey || e.altKey || !e.target || !e.target.closest) return;
          var a = e.target.closest('a[href]');
          if (!a || (a.target && a.target !== '_self')) return;
          var url;
          try { url = new URL(a.getAttribute('href'), location.href); }
          catch (err) { return; }
          if (url.origin !== location.origin || !/\.html$/.test(url.pathname)) return;
          if (url.pathname === location.pathname && url.hash) return;
          if (url.pathname === location.pathname && !url.search) return;

          e.preventDefault();
          try { sessionStorage.setItem('ciapol:wipe', '1'); } catch (err) {}
          wipe.classList.add('is-in');
          setTimeout(function () { location.href = url.href; }, 540);
        });

        window.addEventListener('pageshow', function (e) {
          if (e.persisted) {
            wipe.classList.remove('is-in', 'is-out');
            root.classList.remove('wipe-in');
          }
        });
      }
    }

    /* Navigation mobile */
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.nav');
    if (toggle && nav) {
      function closeNav() {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
      }
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
        body.style.overflow = open ? 'hidden' : '';
      });
      nav.addEventListener('click', function (e) {
        if (e.target.closest('a')) closeNav();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
          closeNav();
          toggle.focus();
        }
      });
    }

    /* Header compact au scroll */
    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function () {
        header.style.paddingBlock = window.scrollY > 24 ? '8px' : '16px';
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* Duplication du bandeau pour boucle infinie */
    document.querySelectorAll('.ticker__track').forEach(function (track) {
      if (track.dataset.cloned === 'true') return;
      track.innerHTML += track.innerHTML;
      track.dataset.cloned = 'true';
    });

    /* Formulaire de démonstration */
    document.querySelectorAll('form[data-demo]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var status = form.querySelector('[data-status]');
        if (status) {
          status.hidden = false;
          status.textContent = 'Maquette de démonstration — le message n’a pas été envoyé. Connectez le formulaire au back-office du CIAPOL.';
        }
      });
    });

    /* Compteurs */
    if (canObserve) {
      var counters = document.querySelectorAll('[data-count]');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          io.unobserve(entry.target);
        });
      }, { threshold: .5 });
      counters.forEach(function (el) { io.observe(el); });
    }

    /* Année courante */
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function animateCount(el) {
    var target = Number(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    var sup = el.querySelector('sup');
    var supMarkup = sup ? sup.outerHTML : '';
    var start = performance.now();
    var duration = 1250;
    function step(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.innerHTML = Math.round(target * eased) + suffix + supMarkup;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ------------------------------------------------------- PRÉPARATION DOM */
  function prepareDOM() {
    /* 1. Découpe des titres en mots masqués */
    document.querySelectorAll('h1, .h2, .display--sm, .quote blockquote')
      .forEach(function (h) {
        if (h.closest('.preloader')) return;
        splitRecursive(h);
        h.setAttribute('data-split', '');
        h.querySelectorAll('.word__inner').forEach(function (w, i) {
          w.style.setProperty('--wd', (Math.min(i, 14) * 46) + 'ms');
        });
      });

    /* 2. Images : rideau + parallaxe */
    document.querySelectorAll('.hero__frame, .editorial__media, .news__media, .map-card, .ratio-wide')
      .forEach(function (el) {
        el.setAttribute('data-media', '');
        el.setAttribute('data-parallax', '');
      });

    /* 3. Éléments à révéler */
    var revealSelector = [
      '.reveal',
      '.hero__text',
      '.page-hero .lead',
      '.section-head > *',
      '.editorial__body > :not(h1):not(h2):not(.h2)',
      '.spec-list > div',
      '.steps > li',
      '.report__steps > li',
      '.timeline__item',
      '.structure',
      '.news',
      '.card',
      '.doc',
      '.partners',
      '.quote',
      '.cta-band',
      '.figures',
      '.report',
      '.contact-panel',
      '.map-card',
      '.report-card',
      '.card__list > li',
      '.contact-list > div',
      '.form-grid > .field'
    ].join(',');

    document.querySelectorAll(revealSelector).forEach(function (el) {
      if (el.closest('.preloader')) return;
      if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '');
    });

    /* 4. Cascades : décalage de chaque enfant */
    var groups = [
      '.grid-3', '.grid-2', '.grid-4', '.news-grid', '.structures',
      '.spec-list', '.steps', '.report__steps', '.timeline', '.form-grid',
      '.card__list', '.contact-list', '.partners', '.figures'
    ];
    document.querySelectorAll(groups.join(',')).forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.style.setProperty('--rd', (Math.min(i, 10) * 74) + 'ms');
      });
    });
  }

  function splitRecursive(node) {
    if (node.nodeType === 3) {
      var text = node.nodeValue;
      if (!text || !text.trim()) return;
      var frag = document.createDocumentFragment();
      text.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          return;
        }
        var outer = document.createElement('span');
        outer.className = 'word';
        var inner = document.createElement('span');
        inner.className = 'word__inner';
        inner.textContent = part;
        outer.appendChild(inner);
        frag.appendChild(outer);
      });
      node.parentNode.replaceChild(frag, node);
      return;
    }
    if (node.nodeType !== 1) return;
    if (/^(BR|SVG|IMG|SCRIPT|STYLE)$/.test(node.tagName)) return;
    Array.prototype.slice.call(node.childNodes).forEach(splitRecursive);
  }

  /* ------------------------------------------------------- MOTEUR DE SCROLL */
  function initScrollEngine() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    body.appendChild(bar);

    var track = document.querySelector('.ticker__track');
    var parallax = Array.prototype.map.call(
      document.querySelectorAll('[data-parallax]'),
      function (el) { return { el: el, cur: 0, target: 0 }; }
    );

    var lastY = window.scrollY;
    var lastT = performance.now();
    var velocity = 0;
    var tx = 0;

    function frame(now) {
      var dt = Math.min((now - lastT) / 1000, .05);
      lastT = now;
      var y = window.scrollY;
      var raw = (y - lastY) / Math.max(dt, .008);
      lastY = y;
      velocity += (raw - velocity) * .12;

      /* Progression de lecture */
      var max = Math.max(root.scrollHeight - window.innerHeight, 1);
      bar.style.setProperty('--p', (y / max).toFixed(4));

      /* Bandeau : vitesse et sens pilotés par le scroll */
      if (track) {
        var half = track.scrollWidth / 2 || 1;
        var dir = velocity < -80 ? -1 : 1;
        var speed = 55 + Math.min(Math.abs(velocity) * .22, 320);
        tx -= dir * speed * dt;
        if (tx <= -half) tx += half;
        if (tx > 0) tx -= half;
        track.style.setProperty('--tx', tx.toFixed(2) + 'px');
      }

      /* Parallaxe des visuels visibles uniquement */
      var vh = window.innerHeight;
      parallax.forEach(function (p) {
        var r = p.el.getBoundingClientRect();
        if (r.bottom < -120 || r.top > vh + 120) return;
        var center = r.top + r.height / 2;
        p.target = ((vh / 2 - center) / vh) * 34;
        p.cur += (p.target - p.cur) * Math.min(1, dt * 7);
        p.el.style.setProperty('--py', p.cur.toFixed(2) + 'px');
      });

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ----------------------------------------------------------- SCÈNE INTRO */
  function runIntro(done) {
    var pl = document.getElementById('preloader');
    var force = /[?&]intro=1/.test(location.search);
    var seen = false;
    try { seen = sessionStorage.getItem('ciapol:intro') === '1'; } catch (e) {}

    /* Filet de sécurité : une navigation interne arrive avec un referrer
       same-origin. Même si le stockage est indisponible, l'intro ne doit jamais
       se rejouer entre deux pages — c'est le rideau qui transitionne. */
    var internal = false;
    if (document.referrer) {
      try { internal = new URL(document.referrer).origin === location.origin; }
      catch (e) { internal = false; }
    }

    if (!pl || ((seen || internal) && !force)) {
      /* IMPORTANT : sans scène, il faut retirer le décor d'intro du DOM,
         sinon il reste en overlay plein écran sur la page suivante. */
      if (pl && pl.parentNode) pl.parentNode.removeChild(pl);
      var curtain = document.querySelector('.pl__curtain');
      if (curtain && curtain.parentNode) curtain.parentNode.removeChild(curtain);
      root.classList.add('loaded');
      done();
      return;
    }
    try { sessionStorage.setItem('ciapol:intro', '1'); } catch (e) {}
    playIntro(pl, done);
  }

  function playIntro(pl, done) {
    var pct = pl.querySelector('.pl__pct');
    var fill = pl.querySelector('.pl__bar-fill');
    var skip = pl.querySelector('.pl__skip');
    var curtain = document.querySelector('.pl__curtain');
    var main = document.querySelector('main');
    var DURATION = 2150;
    var start = performance.now();
    var finished = false;

    if (main && 'inert' in main) main.inert = true;

    function tick(now) {
      if (finished) return;
      var p = Math.min((now - start) / DURATION, 1);
      var n = Math.round((1 - Math.pow(1 - p, 2)) * 100);
      if (pct) pct.textContent = String(n).padStart(3, '0');
      if (fill) fill.style.setProperty('--pl', n);
      if (p < 1) requestAnimationFrame(tick);
      else finish();
    }

    function finish() {
      if (finished) return;
      finished = true;
      if (pct) pct.textContent = '100';
      if (fill) fill.style.setProperty('--pl', 100);

      pl.classList.add('pl--out');
      if (curtain) curtain.classList.add('pl--out');
      root.classList.add('loaded');
      if (main && 'inert' in main) main.inert = false;

      setTimeout(done, 380);
      setTimeout(function () {
        if (pl.parentNode) pl.parentNode.removeChild(pl);
        if (curtain && curtain.parentNode) curtain.parentNode.removeChild(curtain);
      }, 1250);
    }

    if (skip) skip.addEventListener('click', finish);
    pl.addEventListener('click', function (e) { if (e.target === pl) finish(); });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Enter') finish();
    });
    requestAnimationFrame(tick);
  }

  /* --------------------------------------------------------------- REVEALS */
  function startReveals() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .05 });

    document.querySelectorAll('[data-split], [data-reveal], .reveal, [data-media]')
      .forEach(function (el) { io.observe(el); });
  }
})();
