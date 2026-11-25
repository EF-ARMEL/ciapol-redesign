/* ==========================================================================
   CIAPOL — PURIFICATION SCROLL
   Une grandeur physique, --purity, pilote l'air, la lumière, la netteté des
   images, le capteur et la jauge. Le scroll filtre ; la vitesse brasse ;
   remonter re-pollue ; le curseur crée une bulle d'air propre.
   Aucune dépendance. Si main.js ne démarre pas, ce module ne s'active jamais.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var active = false;
  var veil, cv, ctx, hud, gauge, wave, hint, spark, sctx;
  var elAqi, elPm, elState, elRead, elHintAqi;
  var running = false;
  var W = 0, H = 0, dpr = 1;
  var motes = [];
  var media = [];
  var trace = [];
  var pointer = { x: -800, y: -800, on: false };
  var lastMx = -999, lastMy = -999, lastCanvas = -1;
  var lastQ = -1, lastAQ = -1, lastClean = false;
  var purity = 0, dirt = 1, agitation = 0;
  var lastAqi = -1, lastPm = -1, lastState = '', lastRead = -1;
  var frameN = 0;
  var purgeArmed = true, purgeT = 0, purgeTextUntil = 0;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  function el(cls, html) {
    var d = document.createElement('div');
    d.className = cls;
    if (html) d.innerHTML = html;
    d.setAttribute('aria-hidden', 'true');
    document.body.appendChild(d);
    return d;
  }

  /* Mobile, écran tactile, mode économie de données ou machine modeste :
     le voile, le capteur et la jauge coûtent plus qu'ils n'apportent
     (et masquent du contenu sur petit écran). Le site reste complet sans eux. */
  function isLite() {
    var mq = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
    if (mq('(max-width: 900px)') || mq('(pointer: coarse)')) return true;
    var conn = navigator.connection;
    if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ''))) return true;
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return true;
    return false;
  }

  /* ------------------------------------------------------------------ INIT */
  function init() {
    if (active) return;
    if (!root.classList.contains('motion-active')) return;
    if (root.classList.contains('reduced') || root.classList.contains('no-motion')) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (isLite()) return;

    active = true;
    root.classList.add('air-active');
    build();
    cacheMedia();
    resize();
    bind();
  }

  function build() {
    /* Voile : particules + film sale + grain. Masqué autour du curseur. */
    veil = el('air-veil');
    cv = document.createElement('canvas');
    cv.className = 'air-veil__canvas';
    veil.appendChild(cv);
    var smog = document.createElement('div'); smog.className = 'air-veil__smog'; veil.appendChild(smog);
    var grain = document.createElement('div'); grain.className = 'air-veil__grain'; veil.appendChild(grain);
    ctx = cv.getContext('2d');

    /* Capteur de qualité de l'air — SIMULATION. Les valeurs sont pilotées par
       le scroll, pas par une mesure : le libellé doit le dire, un organisme
       qui publie de vraies données ne peut pas afficher un faux relevé. */
    hud = el('air-hud',
      '<div class="air-hud__top"><span>Simulation / air</span><i class="air-hud__dot"></i></div>' +
      '<div class="air-hud__main"><span class="air-hud__value" data-aqi>168</span>' +
      '<span class="air-hud__unit">AQI<br>fictif</span></div>' +
      '<div class="air-hud__rows">' +
      '<div><span>PM2.5</span><b><span data-pm>94</span> µg/m³</b></div>' +
      '<div><span>État</span><b data-state>Pollué</b></div>' +
      '</div>' +
      '<canvas class="air-hud__spark"></canvas>' +
      '<div class="air-hud__bar"><i></i></div>' +
      '<div class="air-hud__note">Illustration · valeurs non mesurées</div>'
    );
    hud.title = 'Animation illustrative : ces valeurs ne sont pas des mesures réelles du réseau RNO-CI.';
    elAqi = hud.querySelector('[data-aqi]');
    elPm = hud.querySelector('[data-pm]');
    elState = hud.querySelector('[data-state]');
    spark = hud.querySelector('.air-hud__spark');
    sctx = spark.getContext('2d');

    /* Jauge liquide : la progression de lecture devient un niveau de pureté */
    gauge = el('purity-gauge',
      '<span class="purity-gauge__label">Pureté</span>' +
      '<div class="purity-gauge__track">' +
      '<div class="purity-gauge__liquid"></div>' +
      '<div class="purity-gauge__meniscus"></div>' +
      '<div class="purity-gauge__ticks"><span></span><span></span><span></span><span></span><span></span></div>' +
      '<div class="purity-gauge__read" data-read>000 %</div>' +
      '</div>'
    );
    elRead = gauge.querySelector('[data-read]');

    wave = el('purge-wave', '<span>Rinçage · capture des particules</span>');
    hint = el('purify-hint',
      '<span class="purify-hint__dot"></span>' +
      '↓ <b>scroller</b> pour filtrer l’air' +
      '<i data-hint-aqi>168</i> AQI simulé'
    );
    elHintAqi = hint.querySelector('[data-hint-aqi]');
  }

  function cacheMedia() {
    media = [];
    var list = document.querySelectorAll('[data-media]');
    for (var i = 0; i < list.length; i++) {
      /* Le hero est le sanctuaire : il reste net dès la première image.
         Seuls les visuels aval suivent la clarification. */
      if (list[i].hasAttribute('data-clean-start')) continue;
      media.push({ el: list[i], last: -1 });
    }
  }

  function mote() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: .7 + Math.random() * 2.7,
      vx: (Math.random() - .5) * .26,
      vy: -.09 - Math.random() * .30,
      a: .15 + Math.random() * .38,
      cap: .06 + Math.random() * .88,   /* seuil de capture par le filtre */
      ph: Math.random() * 6.283,
      sp: .35 + Math.random() * .95
    };
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var sw = Math.max(60, spark.clientWidth || 200);
    spark.width = Math.round(sw * dpr);
    spark.height = Math.round(24 * dpr);
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* Densité réduite : l'effet reste lisible, le coût de dessin est divisé par ~2. */
    var n = clamp(Math.round(W * H / 24000), 30, 70);
    motes = [];
    for (var i = 0; i < n; i++) motes.push(mote());
  }

  function bind() {
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.on = true;
    }, { passive: true });
    function away() { pointer.on = false; pointer.x = -800; pointer.y = -800; }
    document.addEventListener('pointerleave', away);
    window.addEventListener('blur', away);
  }

  /* ------------------------------------------------------- BOUCLE DE RENDU */
  function update(p, velocity) {
    if (!active) return;
    var now = performance.now();

    /* Inertie : la pureté répond comme un liquide, pas comme un interrupteur. */
    purity += (clamp(p, 0, 1) - purity) * .10;
    dirt = 1 - purity;
    agitation += (clamp(Math.abs(velocity) / 1400, 0, 1) - agitation) * .12;

    /* Hystérésis : l'instrumentation monte au premier geste, se retire
       seulement quand on est vraiment revenu au sommet. */
    var wantRun = running ? purity > .006 : purity > .018;
    if (wantRun !== running) {
      running = wantRun;
      root.classList.toggle('air-running', running);
    }
    if (purgeT > 0) purgeT = Math.max(0, purgeT - 1 / 60);

    /* Une variable héritée sur <html> recalcule le style de TOUT le document.
       On l'écrit par paliers uniquement : zéro écriture quand on ne scrolle pas. */
    var pq = Math.round(purity * 200);
    var aq = Math.round(agitation * 50);
    if (pq !== lastQ || aq !== lastAQ) {
      var qp = pq / 200;
      root.style.setProperty('--purity', qp.toFixed(3));
      root.style.setProperty('--dirt', (1 - qp).toFixed(3));
      root.style.setProperty('--agitation', (aq / 50).toFixed(2));
      lastQ = pq; lastAQ = aq;
    }
    var clean = purity > .72;
    if (clean !== lastClean) {
      root.classList.toggle('air-clean', clean);
      lastClean = clean;
    }

    if (pointer.x !== lastMx || pointer.y !== lastMy) {
      root.style.setProperty('--mx', pointer.x + 'px');
      root.style.setProperty('--my', pointer.y + 'px');
      lastMx = pointer.x; lastMy = pointer.y;
    }

    /* Le canvas passe d'un bleu-gris chargé au BLANC PUR : on nettoie la page. */
    var q = Math.round(purity * 100);
    if (q !== lastCanvas) {
      var c0 = [219, 226, 236], c1 = [255, 255, 255], rgb = [];
      for (var i = 0; i < 3; i++) rgb.push(Math.round(c0[i] + (c1[i] - c0[i]) * purity));
      root.style.setProperty('--canvas', 'rgb(' + rgb.join(',') + ')');
      lastCanvas = q;
    }

    /* Capteur */
    var aqi = Math.round(168 - 156 * purity);
    var pm = Math.round(94 - 90 * purity);
    var state = purity < .28 ? 'Pollué' : (purity < .72 ? 'Filtration' : 'Pur');
    if (now < purgeTextUntil) state = 'Rinçage';
    if (aqi !== lastAqi) {
      elAqi.textContent = aqi;
      elHintAqi.textContent = aqi;
      lastAqi = aqi;
    }
    if (pm !== lastPm) { elPm.textContent = pm; lastPm = pm; }
    if (state !== lastState) { elState.textContent = state; lastState = state; }
    var rd = Math.round(purity * 100);
    if (rd !== lastRead) {
      elRead.textContent = String(rd).padStart(3, '0') + ' %';
      lastRead = rd;
    }

    /* L'indice de geste s'efface dès que l'instrumentation prend le relais. */
    if (running && hint && !hint.classList.contains('is-gone')) {
      hint.classList.add('is-gone');
    }

    /* Climax : rinçage unique, réarmé si l'on remonte (système réversible) */
    if (purity > .58 && purgeArmed) { firePurge(now); purgeArmed = false; }
    if (purity < .44) purgeArmed = true;

    clarity();

    frameN++;
    if (frameN % 3 === 0) {
      trace.push(aqi + (Math.random() - .5) * 6);
      if (trace.length > 64) trace.shift();
      drawSpark();
    }
    render(now);
  }

  function firePurge(now) {
    purgeT = 1.15;
    purgeTextUntil = now + 1150;
    wave.classList.remove('is-on');
    void wave.offsetWidth;
    wave.classList.add('is-on');
  }

  /* Chaque visuel se défloute quand on descend : l'eau devient limpide. */
  function clarity() {
    for (var i = 0; i < media.length; i++) {
      var m = media[i];
      var r = m.el.getBoundingClientRect();
      if (r.bottom < -180 || r.top > H + 180) continue;
      var local = clamp((H * .94 - r.top) / (H * .78), 0, 1);
      var c = clamp(purity * .66 + local * .34, 0, 1);
      if (Math.abs(c - m.last) > .012) {
        m.el.style.setProperty('--clarity', c.toFixed(3));
        m.last = c;
      }
    }
  }

  function render(now) {
    ctx.clearRect(0, 0, W, H);
    var t = now * .001;
    var cleanR2 = pointer.on ? 200 * 200 : -1;
    var purgeFactor = purgeT > 0 ? purgeT / 1.15 : 0;

    for (var i = 0; i < motes.length; i++) {
      var m = motes[i];
      m.x += (m.vx + Math.sin(t * m.sp + m.ph) * .10) * (1 + agitation * 3.5);
      m.y += m.vy * (1 + agitation * 2.2);
      if (m.y < -8) { m.y = H + 8; m.x = Math.random() * W; }
      if (m.x < -8) m.x = W + 8;
      else if (m.x > W + 8) m.x = -8;

      /* Le filtre capture les particules une à une, par seuil. */
      var cap = purity > m.cap ? Math.min((purity - m.cap) / .10, 1) : 0;
      var a = m.a * dirt * (1 - cap) * (1 - purgeFactor) * (1 + agitation * .25);
      if (a <= .004) continue;

      if (cleanR2 > 0) {
        var dx = m.x - pointer.x, dy = m.y - pointer.y;
        if (dx * dx + dy * dy < cleanR2) continue;
      }

      var r = m.r * (1 - cap * .8) * (1 + agitation * .3);
      ctx.fillStyle = 'rgba(38, 56, 88, ' + a.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(m.x, m.y, r, 0, 6.2832);
      ctx.fill();
    }
  }

  function drawSpark() {
    if (!spark.clientWidth) return;   /* masqué en responsive : rien à dessiner */
    var sw = spark.width / dpr, sh = 24;
    sctx.clearRect(0, 0, sw, sh);
    sctx.strokeStyle = '#c3d2e6';
    sctx.lineWidth = 1;
    sctx.beginPath(); sctx.moveTo(0, sh - .5); sctx.lineTo(sw, sh - .5); sctx.stroke();
    if (trace.length < 2) return;

    sctx.strokeStyle = '#004494';
    sctx.lineWidth = 1.5;
    sctx.beginPath();
    var ly = 0;
    for (var i = 0; i < trace.length; i++) {
      var x = (i / (trace.length - 1)) * sw;
      var y = sh - 3 - (clamp(trace[i], 0, 180) / 180) * (sh - 6);
      if (i === 0) sctx.moveTo(x, y); else sctx.lineTo(x, y);
      ly = y;
    }
    sctx.stroke();
    sctx.fillStyle = '#004494';
    sctx.beginPath(); sctx.arc(sw - 2, ly, 2.6, 0, 6.2832); sctx.fill();
  }

  window.__ciapolPurify = { init: init, update: update };
})();
