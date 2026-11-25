"use client";

import { useState, type ReactNode } from "react";
import { Check, Link2 } from "lucide-react";

/* Partage par liens simples (aucun SDK, aucun script tiers chargé). */
const I = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d={d} />
  </svg>
);
const ICONS: Record<string, ReactNode> = {
  facebook: <I d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />,
  x: <I d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z" />,
  linkedin: <I d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3V9.5zm6.5 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6.1V21h-4v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4V9.5z" />,
  whatsapp: <I d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />,
};

export default function ShareRail({ url, title, sourceUrl }: { url: string; title: string; sourceUrl?: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { key: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { key: "x", label: "X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { key: "linkedin", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { key: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
  ];

  const copy = async () => {
    const href = window.location.href.split(/[?#]/)[0] || url;
    try {
      await navigator.clipboard.writeText(href);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = href;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div className="share">
      <p className="eyebrow share__label" id="share-label">
        Partager
      </p>
      <ul className="share__list" aria-labelledby="share-label">
        {links.map((l) => (
          <li key={l.key}>
            <a
              className="share__btn"
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Partager sur ${l.label} (nouvel onglet)`}
              title={l.label}
            >
              {ICONS[l.key]}
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            className={`share__btn ${copied ? "is-ok" : ""}`}
            onClick={copy}
            aria-label="Copier le lien de l'article"
            title="Copier le lien"
          >
            {copied ? <Check size={18} aria-hidden="true" /> : <Link2 size={18} aria-hidden="true" />}
          </button>
        </li>
      </ul>
      <p className="share__status" role="status">
        {copied ? "Lien copié" : ""}
      </p>
      {sourceUrl ? (
        <p className="share__source">
          Source :{" "}
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
            article original sur <strong>ciapol.ci</strong>
            <span className="sr-only"> (nouvel onglet)</span>
          </a>
        </p>
      ) : null}
    </div>
  );
}
