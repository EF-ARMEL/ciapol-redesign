/* ==========================================================================
   LA LAGUNE — shader de fond
   Une seule grandeur, uPurity (0 → 1), fait passer l'eau d'un état pollué
   (vase en suspension, nappe d'hydrocarbure irisée, macro-déchets) à une
   lagune limpide (bleu profond, caustiques lumineuses, reflets verts).
   uClean est un champ de dépollution local laissé par le curseur (l'écrémeur).
   GLSL ES 1.0 : compatible WebGL 1, donc avec la quasi-totalité des mobiles.
   ========================================================================== */

export const VERT = /* glsl */ `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const FRAG = /* glsl */ `
precision mediump float;

uniform vec2  uRes;
uniform float uTime;
uniform float uPurity;     // 0 = pollué, 1 = salubre
uniform float uAgitation;  // vitesse de scroll lissée (0..1)
uniform vec2  uMouse;      // px, origine en bas à gauche
uniform float uMouseOn;    // 0..1
uniform float uDensity;    // 1 desktop, <1 mobile (allège les octaves)

// --- bruit de valeur + fbm --------------------------------------------------
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    if (float(i) > 2.0 + uDensity * 2.0) break;
    v += a * noise(p);
    p = r * p * 2.03 + 11.7;
    a *= 0.5;
  }
  return v;
}

// --- caustiques : filaments lumineux de l'eau claire ------------------------
// Réseau de caustiques (itération de type « water caustic », tuilable).
float caustic(vec2 uv, float t) {
  vec2 p = uv * 6.2831 - 250.0;
  vec2 i = p;
  float c = 1.0;
  float inten = 0.0065;
  for (int n = 0; n < 4; n++) {
    float tt = t * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= 4.0;
  c = 1.17 - pow(c, 1.4);
  return clamp(pow(abs(c), 7.0), 0.0, 1.0);
}

// --- macro-déchets : sacs, bouteilles, emballages qui dérivent ---------------
// Renvoie (masque, teinte) : teinte 0 = déchet sombre, 1 = plastique délavé.
vec2 debris(vec2 p, float t) {
  vec2 g = p * 2.6 + vec2(t * 0.045, -t * 0.03);
  vec2 id = floor(g), f = fract(g) - 0.5;
  float h = hash(id);
  if (h < 0.58) return vec2(0.0);
  float ang = h * 6.2831 + t * (h - 0.79) * 0.5;
  mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
  vec2 d = rot * (f + vec2(hash(id + 3.1) - 0.5, hash(id + 7.7) - 0.5) * 0.45);
  float kind = hash(id + 9.2);
  float dist;
  if (kind < 0.45) {
    // bouteille : capsule allongée
    vec2 a = vec2(-0.09 - 0.05 * h, 0.0), b = vec2(0.09 + 0.05 * h, 0.0);
    vec2 pa = d - a, ba = b - a;
    float k = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    dist = length(pa - ba * k) - (0.022 + 0.012 * hash(id + 2.4));
  } else {
    // sac / film plastique : forme molle déformée par le bruit
    float r = 0.07 + 0.06 * hash(id + 4.4);
    float wob = (noise(d * 18.0 + id + t * 0.2) - 0.5) * 0.05;
    dist = length(d * vec2(1.0, 1.4)) - r + wob;
  }
  float m = smoothstep(0.018, -0.006, dist);
  return vec2(m * (0.55 + 0.45 * hash(id + 6.6)), step(0.62, hash(id + 12.3)));
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  float t = uTime;

  // Écrémeur : bulle propre autour du curseur, bord ondulant
  float md = length((frag - uMouse) / uRes.y);
  float ring = 0.16 + 0.012 * sin(t * 3.0 + atan(frag.y - uMouse.y, frag.x - uMouse.x) * 6.0);
  float skim = uMouseOn * smoothstep(ring, ring * 0.35, md);
  float purity = clamp(uPurity + skim * 0.85, 0.0, 1.0);
  float dirt = 1.0 - purity;

  // Écoulement : domaine déformé (courant lagunaire)
  float flow = t * (0.035 + uAgitation * 0.08);
  vec2 q = vec2(fbm(p * 1.6 + vec2(flow, 0.0)), fbm(p * 1.6 + vec2(3.1, -flow)));
  float r = fbm(p * 2.2 + q * 2.4 + vec2(flow * 1.4, flow * 0.6));

  // ---------- ÉTAT POLLUÉ ----------
  vec3 vase  = vec3(0.180, 0.170, 0.125);
  vec3 limon = vec3(0.420, 0.365, 0.255);
  vec3 polluted = mix(vase, limon, smoothstep(0.25, 0.85, r));
  polluted *= 0.78 + 0.35 * q.x;

  // Nappe d'hydrocarbure : interférence en couche mince
  float sf = fbm(p * 1.05 + q * 1.4 + vec2(-flow * 0.8, flow * 0.3));
  float slick = smoothstep(0.44, 0.62, sf);
  float phase = r * 4.2 + q.y * 2.6 + sf * 3.0 + t * 0.05;
  vec3 irid = 0.5 + 0.5 * cos(6.2831 * (phase + vec3(0.0, 0.33, 0.67)));
  // film : base noire pétrole + bandes irisées sur les bords de la nappe
  float band = smoothstep(0.0, 0.35, slick) * (1.0 - smoothstep(0.65, 1.0, slick));
  // irisation sourde : on désature vers la luminance avant de mélanger
  irid = mix(vec3(dot(irid, vec3(0.299, 0.587, 0.114))), irid, 0.62) * vec3(0.85, 0.8, 0.95);
  vec3 oil = mix(vec3(0.035, 0.035, 0.03), irid * 0.72, 0.16 + band * 0.42);
  polluted = mix(polluted, oil, slick * 0.82);

  // Particules en suspension + macro-déchets
  float specks = smoothstep(0.86, 0.95, noise(p * 70.0 + vec2(0.0, t * 0.6)));
  polluted = mix(polluted, vec3(0.08, 0.075, 0.06), specks * 0.5);
  vec2 deb = debris(p, t);
  vec3 debCol = mix(vec3(0.07, 0.068, 0.06), vec3(0.62, 0.66, 0.64), deb.y);
  polluted = mix(polluted, debCol, deb.x * 0.85);

  // ---------- ÉTAT SALUBRE ----------
  vec3 deep    = vec3(0.016, 0.090, 0.227);   // nuit CIAPOL
  vec3 lagoon  = vec3(0.000, 0.247, 0.549);   // bleu CIAPOL
  vec3 shallow = vec3(0.098, 0.655, 0.788);   // lagune
  vec3 clean = mix(deep, lagoon, smoothstep(0.0, 0.9, uv.y + (r - 0.5) * 0.4));
  clean = mix(clean, shallow, smoothstep(0.55, 1.0, r) * 0.35);
  float ca = caustic(p * 0.55 + q * 0.12, t * 0.35);
  clean += vec3(0.55, 0.82, 1.0) * ca * (0.35 + 0.35 * uv.y);
  clean += vec3(0.06, 0.62, 0.35) * smoothstep(0.7, 1.0, q.y) * 0.18;   // reflet vert « salubre »

  // ---------- TRANSITION ----------
  // Le front de dépollution n'est pas un fondu : il avance dans le bruit,
  // comme une eau qui se clarifie par plaques.
  float front = smoothstep(purity - 0.12, purity + 0.12, r * 0.85 + 0.075);
  vec3 col = mix(clean, polluted, front * smoothstep(0.0, 0.02, dirt));

  // Liseré d'écume sur le front et sur l'écrémeur
  float edge = (1.0 - abs(front - 0.5) * 2.0) * dirt;
  col += vec3(0.85, 0.95, 1.0) * pow(max(edge, 0.0), 6.0) * 0.35;
  float skimEdge = uMouseOn * smoothstep(0.02, 0.0, abs(md - ring)) * dirt;
  col += vec3(0.8, 0.95, 1.0) * skimEdge * 0.4;

  // Vignettage + grain (anti-banding)
  float vig = smoothstep(1.25, 0.35, length(uv - 0.5) * 1.4);
  col *= 0.72 + 0.28 * vig;
  col += (hash(frag + fract(t)) - 0.5) * 0.025;

  gl_FragColor = vec4(col, 1.0);
}
`;
