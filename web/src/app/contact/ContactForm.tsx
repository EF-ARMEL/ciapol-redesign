"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";

/* Formulaire « Contactez nous » : reprend à l'identique les champs du
   formulaire officiel (archive ciapol.ci) : Name, Email, Téléphone (motif
   des caractères téléphoniques), Message, bouton « Envoyer ».
   Le site n'a pas de serveur : après validation, le message est rédigé
   dans la messagerie du visiteur (mailto:), ce que l'interface dit
   clairement. Rien n'est transmis à son insu. */

type Data = { name: string; email: string; phone: string; message: string };
const EMPTY: Data = { name: "", email: "", phone: "", message: "" };

const PHONE_RE = /^[0-9()#&+*\-=.\s]+$/;
const PHONE_MSG = "Only numbers and phone characters (#, -, *, etc) are accepted.";

export default function ContactForm({ email }: { email?: string }) {
  const [d, setD] = useState<Data>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Data, string>>>({});
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  const set = (k: keyof Data, v: string) => setD((s) => ({ ...s, [k]: v }));

  const validate = () => {
    const e: Partial<Record<keyof Data, string>> = {};
    if (!d.name.trim()) e.name = "Indiquez votre nom et prénom.";
    if (!d.email.trim()) e.email = "Indiquez votre adresse électronique.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = "Adresse électronique invalide.";
    if (!d.phone.trim()) e.phone = "Indiquez votre numéro de téléphone.";
    else if (!PHONE_RE.test(d.phone.trim())) e.phone = PHONE_MSG;
    setErrors(e);
    return e;
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    const first = (Object.keys(e) as (keyof Data)[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(first))}`)?.focus();
      return;
    }
    setDone(true);
    requestAnimationFrame(() => doneRef.current?.focus());
  };

  const body = [
    `Nom et prénom : ${d.name.trim()}`,
    `Email : ${d.email.trim()}`,
    `Téléphone : ${d.phone.trim()}`,
    "",
    d.message.trim() || "(aucun message)",
  ].join("\n");
  const subject = `Contact site web : ${d.name.trim()}`;
  const mailto = email ? `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : undefined;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  if (done) {
    return (
      <div className="ctf ctf--done">
        <h2 ref={doneRef} tabIndex={-1} className="display ctf__h">
          Votre message est prêt
        </h2>
        <p className="ctf__p">
          Ce site ne transmet pas les formulaires lui-même. Pour que votre message parvienne au CIAPOL, ouvrez-le dans votre
          messagerie : il est déjà rédigé et adressé à {email ? <b>{email}</b> : "l'adresse officielle"}. Il ne partira qu&apos;au
          moment où vous l&apos;enverrez depuis votre messagerie.
        </p>
        <pre className="ctf__recap" aria-label="Aperçu du message">{body}</pre>
        <div className="ctf__actions">
          {mailto ? (
            <a className="inst-btn" href={mailto}>
              Ouvrir dans ma messagerie
            </a>
          ) : null}
          <button type="button" className="inst-btn inst-btn--quiet" onClick={copy}>
            {copied ? "Message copié" : "Copier le message"}
          </button>
          <button
            type="button"
            className="inst-btn inst-btn--quiet"
            onClick={() => {
              setDone(false);
              setCopied(false);
            }}
          >
            Modifier
          </button>
        </div>
        <p className="ctf__hint" role="status" aria-live="polite">
          {copied ? "Le message est dans votre presse-papiers : vous pouvez le coller dans le courriel de votre choix." : ""}
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} className="ctf" onSubmit={submit} noValidate>
      <p className="ctf__req">
        Les champs marqués d&apos;un astérisque <span aria-hidden="true">*</span> sont obligatoires.
      </p>
      <div className="ctf__grid">
        <Field id={id("name")} label={<span lang="en">Name</span>} required error={errors.name}>
          <input
            id={id("name")}
            name="form_fields[name]"
            type="text"
            placeholder="Nom et prenom"
            required
            autoComplete="name"
            value={d.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${id("name")}-err` : undefined}
          />
        </Field>
        <Field id={id("email")} label="Email" required error={errors.email}>
          <input
            id={id("email")}
            name="form_fields[email]"
            type="email"
            placeholder="Email"
            required
            autoComplete="email"
            inputMode="email"
            value={d.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${id("email")}-err` : undefined}
          />
        </Field>
        <Field id={id("phone")} label="Téléphone" required error={errors.phone}>
          <input
            id={id("phone")}
            name="form_fields[field_e2802ee]"
            type="tel"
            placeholder="Téléphone"
            required
            autoComplete="tel"
            inputMode="tel"
            value={d.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? `${id("phone")}-err` : undefined}
          />
        </Field>
      </div>
      <Field id={id("message")} label="Message">
        <textarea
          id={id("message")}
          name="form_fields[message]"
          rows={4}
          placeholder="Message"
          value={d.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </Field>
      <p className="ctf__note">
        À l&apos;envoi, votre message est préparé dans votre propre messagerie électronique{email ? <> à l&apos;adresse {email}</> : null}.
      </p>
      <div className="ctf__actions">
        <button type="submit" className="inst-btn">
          Envoyer
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: ReactNode;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className={`ctf__field ${error ? "has-err" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required ? (
          <span className="ctf__star" aria-hidden="true">
            {" "}*
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="ctf__err">
          {error}
        </p>
      ) : null}
    </div>
  );
}
