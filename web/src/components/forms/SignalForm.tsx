"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { getLenis } from "@/motion/SmoothScroll";
import { Check, Droplets, Factory, Fish, Trash2, Wind, Waves } from "lucide-react";

const TYPES = [
  { id: "hydrocarbures", label: "Hydrocarbures / produits chimiques", icon: Droplets, hint: "Nappe irisée, odeur de carburant, déversement" },
  { id: "rejet-industriel", label: "Rejet industriel", icon: Factory, hint: "Effluent coloré, mousse, rejet direct dans le milieu" },
  { id: "nuisance-olfactive", label: "Nuisances olfactives / air", icon: Wind, hint: "Odeurs persistantes, fumées, poussières" },
  { id: "mortalite-poissons", label: "Mortalité de poissons", icon: Fish, hint: "Poissons morts en surface, eau anormale" },
  { id: "depot-sauvage", label: "Dépôt sauvage de déchets", icon: Trash2, hint: "Déchets, ordures, déblais abandonnés" },
  { id: "vegetaux", label: "Végétaux aquatiques envahissants", icon: Waves, hint: "Jacinthes d'eau, plan d'eau recouvert" },
];

type Data = {
  type: string;
  lieu: string;
  commune: string;
  date: string;
  description: string;
  nom: string;
  telephone: string;
  email: string;
  consent: boolean;
};

const EMPTY: Data = { type: "", lieu: "", commune: "", date: "", description: "", nom: "", telephone: "", email: "", consent: false };

/* Signalement citoyen en 3 étapes. Le site n'a pas de serveur : à l'envoi,
   le signalement est mis en forme et l'utilisateur l'adresse au CIAPOL par
   courriel (lien prérempli) — rien n'est transmis à l'insu de l'utilisateur. */
export default function SignalForm({ email }: { email?: string }) {
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Data>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => setD((s) => ({ ...s, [k]: v }));
  const ref = useMemo(() => `SIG-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`, []);

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0 && !d.type) e.type = "Choisissez le type de pollution constatée.";
    if (s === 1) {
      if (d.lieu.trim().length < 3) e.lieu = "Indiquez le lieu (quartier, site, repère).";
      if (d.commune.trim().length < 2) e.commune = "Indiquez la commune ou la ville.";
      if (d.description.trim().length < 15) e.description = "Décrivez la situation en quelques phrases (15 caractères minimum).";
    }
    if (s === 2) {
      if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = "Adresse électronique invalide.";
      if (!d.consent) e.consent = "Votre accord est nécessaire pour transmettre le signalement.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* Après chaque changement d'étape, on ramène le début du formulaire sous
     l'en-tête et on place le focus sur la nouvelle étape (lecteurs d'écran).
     En cas d'erreur, le focus va au premier champ fautif. */
  const top = useRef<HTMLDivElement>(null);
  const [moved, setMoved] = useState(0);
  useEffect(() => {
    if (!moved) return;
    const el = top.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hdr-bottom")) || 90) - 16;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(Math.max(0, y), { immediate: true, force: true });
    else window.scrollTo({ top: Math.max(0, y) });
    const target =
      el.querySelector<HTMLElement>(".has-err input, .has-err textarea, [aria-invalid='true'] input") ??
      el.querySelector<HTMLElement>(".sig__legend, .sig__h");
    if (target) {
      if (!/^(INPUT|TEXTAREA)$/.test(target.tagName)) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  }, [moved]);
  const bump = () => setMoved((n) => n + 1);

  const next = (ev?: React.MouseEvent) => {
    ev?.preventDefault();
    if (validate(step)) setStep((s) => Math.min(2, s + 1));
    bump();
  };
  const back = (ev: React.MouseEvent) => {
    ev.preventDefault();
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
    bump();
  };
  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (validate(2)) setDone(true);
    bump();
  };

  const typeLabel = TYPES.find((t) => t.id === d.type)?.label ?? "";
  const body = [
    `Référence : ${ref}`,
    `Type : ${typeLabel}`,
    `Lieu : ${d.lieu}, ${d.commune}`,
    d.date ? `Date / heure constatée : ${d.date.replace("T", " ")}` : "",
    "",
    "Description :",
    d.description,
    "",
    `Signalé par : ${d.nom || "anonyme"}${d.telephone ? " · " + d.telephone : ""}${d.email ? " · " + d.email : ""}`,
  ].filter((l) => l !== null).join("\n");
  const mailto = email ? `mailto:${email}?subject=${encodeURIComponent(`Signalement de pollution ${ref} : ${typeLabel}`)}&body=${encodeURIComponent(body)}` : undefined;

  if (done) {
    return (
      <div ref={top} className="sig sig--done" role="status" aria-live="polite">
        <span className="sig__ok"><Check size={34} strokeWidth={2.4} /></span>
        <h2 className="sig__h display">Signalement prêt</h2>
        <p className="sig__p">
          Référence <b>{ref}</b>. Pour qu&apos;il parvienne aux équipes du CIAPOL, envoyez-le maintenant depuis votre
          messagerie : le message est déjà rédigé.
        </p>
        <pre className="sig__recap">{body}</pre>
        <div className="sig__nav">
          {mailto ? (
            <a className="sig__btn sig__btn--main" href={mailto}>
              Envoyer au CIAPOL par courriel
            </a>
          ) : null}
          <button type="button" className="sig__btn" onClick={() => { setD(EMPTY); setStep(0); setDone(false); }}>
            Nouveau signalement
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={top}>
    <form className="sig" onSubmit={submit} noValidate aria-describedby="sig-steps">
      <ol id="sig-steps" className="sig__steps" aria-label="Étapes du signalement">
        {["Type", "Lieu & description", "Coordonnées"].map((s, i) => (
          <li key={s} className={i === step ? "is-on" : i < step ? "is-done" : ""} aria-current={i === step ? "step" : undefined}>
            <span>{i < step ? <Check size={14} /> : i + 1}</span> {s}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <fieldset className="sig__set">
          <legend className="sig__legend">Quelle pollution avez-vous constatée ?</legend>
          <div className="sig__types" role="radiogroup" aria-invalid={!!errors.type}>
            {TYPES.map((t) => (
              <label key={t.id} className={`sig__type ${d.type === t.id ? "is-on" : ""}`}>
                <input type="radio" name="type" value={t.id} checked={d.type === t.id} onChange={() => set("type", t.id)} />
                <t.icon size={26} strokeWidth={1.6} aria-hidden="true" />
                <span className="sig__type-l">{t.label}</span>
                <span className="sig__type-h">{t.hint}</span>
              </label>
            ))}
          </div>
          {errors.type ? <p className="sig__err" role="alert">{errors.type}</p> : null}
        </fieldset>
      )}

      {step === 1 && (
        <fieldset className="sig__set">
          <legend className="sig__legend">Où et quand ?</legend>
          <div className="sig__grid">
            <Field id="lieu" label="Lieu précis" error={errors.lieu} required>
              <input id="lieu" value={d.lieu} onChange={(e) => set("lieu", e.target.value)} placeholder="Ex. : berge de la lagune Ébrié, près du pont…" autoComplete="off" />
            </Field>
            <Field id="commune" label="Commune / ville" error={errors.commune} required>
              <input id="commune" value={d.commune} onChange={(e) => set("commune", e.target.value)} placeholder="Ex. : Marcory, San-Pédro…" autoComplete="address-level2" />
            </Field>
            <Field id="date" label="Date et heure du constat">
              <input id="date" type="datetime-local" value={d.date} onChange={(e) => set("date", e.target.value)} />
            </Field>
          </div>
          <Field id="description" label="Description" error={errors.description} required>
            <textarea id="description" rows={6} value={d.description} onChange={(e) => set("description", e.target.value)} placeholder="Ce que vous avez vu, senti, l'étendue, la source supposée…" />
          </Field>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="sig__set">
          <legend className="sig__legend">Vos coordonnées <small>(facultatives)</small></legend>
          <div className="sig__grid">
            <Field id="nom" label="Nom et prénoms">
              <input id="nom" value={d.nom} onChange={(e) => set("nom", e.target.value)} autoComplete="name" />
            </Field>
            <Field id="telephone" label="Téléphone">
              <input id="telephone" type="tel" value={d.telephone} onChange={(e) => set("telephone", e.target.value)} autoComplete="tel" />
            </Field>
            <Field id="email" label="Courriel" error={errors.email}>
              <input id="email" type="email" value={d.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
            </Field>
          </div>
          <label className={`sig__consent ${errors.consent ? "has-err" : ""}`}>
            <input type="checkbox" checked={d.consent} onChange={(e) => set("consent", e.target.checked)} />
            <span>J&apos;accepte que ces informations soient transmises au CIAPOL pour le traitement de mon signalement.</span>
          </label>
          {errors.consent ? <p className="sig__err" role="alert">{errors.consent}</p> : null}
        </fieldset>
      )}

      <div className="sig__nav">
        {step > 0 ? (
          <button key="back" type="button" className="sig__btn" onClick={back}>
            Retour
          </button>
        ) : <span />}
        {step < 2 ? (
          <button key="next" type="button" className="sig__btn sig__btn--main" onClick={next}>
            Continuer
          </button>
        ) : (
          <button key="submit" type="submit" className="sig__btn sig__btn--main">
            Préparer le signalement
          </button>
        )}
      </div>
    </form>
    </div>
  );
}

function Field({ id, label, error, required, children }: { id: string; label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className={`sig__field ${error ? "has-err" : ""}`}>
      <label htmlFor={id}>
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </label>
      {children}
      {error ? <p className="sig__err" role="alert">{error}</p> : null}
    </div>
  );
}
