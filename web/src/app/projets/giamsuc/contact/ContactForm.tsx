"use client";

import { useState, type FormEvent } from "react";

export type Field = { label: string; name: string; type: string; required: boolean; placeholder?: string; options?: string[] };

type State = Record<string, string>;

/* Formulaire du sous-site GIAMSUC, reproduit champ pour champ. Le site est
   statique : rien n'est transmis automatiquement. À l'envoi, le message est
   vérifié puis préparé dans la messagerie de l'internaute (lien mailto). */
export default function ContactForm({ fields, submitLabel, email }: { fields: Field[]; submitLabel: string; email: string }) {
  const [v, setV] = useState<State>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const idOf = (n: string) => `gc-${n.replace(/[^a-z0-9]+/gi, "-")}`;

  const validate = () => {
    const e: Record<string, string> = {};
    for (const f of fields) {
      const val = (v[f.name] ?? "").trim();
      if (f.required && !val) e[f.name] = `Le champ « ${f.label} » est obligatoire.`;
      if (f.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) e[f.name] = "Adresse électronique invalide.";
    }
    setErrors(e);
    return e;
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      const first = fields.find((f) => e[f.name]);
      if (first) document.getElementById(idOf(first.name))?.focus();
      return;
    }
    setDone(true);
  };

  const subjectField = fields.find((f) => f.type === "select");
  const subject = `GIAMSUC : ${subjectField ? v[subjectField.name] ?? "" : "message"}`;
  const body = fields.map((f) => `${f.label} : ${v[f.name] ?? ""}`).join("\n");
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (done) {
    return (
      <div className="gform__done" role="status" aria-live="polite" tabIndex={-1} ref={(el) => el?.focus()}>
        <p className="display gform__done-title">Message prêt</p>
        <p>
          Votre message est complet. Ce site ne dispose pas de serveur d&apos;envoi : pour le transmettre, ouvrez-le dans
          votre messagerie, il y est déjà rédigé à l&apos;adresse <strong>{email}</strong>.
        </p>
        <div className="gform__actions">
          <a href={mailto} className="btn btn--primary">
            <span className="btn__label">Ouvrir dans ma messagerie</span>
          </a>
          <button type="button" className="gform__reset" onClick={() => setDone(false)}>
            Modifier le message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="gform" onSubmit={submit} noValidate>
      {fields.map((f) => {
        const id = idOf(f.name);
        const err = errors[f.name];
        const common = {
          id,
          name: f.name,
          value: v[f.name] ?? "",
          required: f.required,
          "aria-invalid": err ? true : undefined,
          "aria-describedby": err ? `${id}-err` : undefined,
        };
        const set = (val: string) => setV((s) => ({ ...s, [f.name]: val }));
        const auto =
          f.type === "email" ? "email" : f.label === "Téléphone" ? "tel" : f.label === "Nom" ? "family-name" : f.label === "Prénoms" ? "given-name" : undefined;
        return (
          <div key={f.name} className={`gform__field ${f.type === "textarea" || f.type === "select" ? "gform__field--full" : ""}`}>
            <label htmlFor={id} className="gform__label">
              {f.label}
              {f.required ? <span aria-hidden="true"> *</span> : <span className="gform__opt"> (facultatif)</span>}
            </label>
            {f.type === "select" ? (
              <select {...common} onChange={(e) => set(e.target.value)} className="gform__input">
                <option value="">{f.options?.[0]}</option>
                {f.options?.slice(1).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea {...common} rows={4} onChange={(e) => set(e.target.value)} className="gform__input" />
            ) : (
              <input
                {...common}
                type={f.type === "email" ? "email" : f.label === "Téléphone" ? "tel" : "text"}
                placeholder={f.placeholder}
                autoComplete={auto}
                onChange={(e) => set(e.target.value)}
                className="gform__input"
              />
            )}
            {err ? (
              <p id={`${id}-err`} className="gform__err">
                {err}
              </p>
            ) : null}
          </div>
        );
      })}
      <div className="gform__field--full gform__submit">
        <button type="submit" className="btn btn--primary">
          <span className="btn__label">{submitLabel}</span>
        </button>
        <p className="gform__hint">Les champs marqués * sont obligatoires.</p>
      </div>
    </form>
  );
}
