import TransitionLink from "@/components/ui/TransitionLink";
import Logo from "./Logo";
import { NAV, CTA } from "@/lib/nav";
import { SITE, telHref } from "@/lib/site";

/* Pied de page : grand mot-symbole qui « émerge » de l'eau, coordonnées
   officielles, plan du site complet, réseaux, tutelles. */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="ftr surface--nuit" aria-labelledby="ftr-title">
      <div className="flag-rule" aria-hidden="true"><i /><i /><i /></div>
      <div className="shell ftr__top">
        <div className="ftr__brand">
          <Logo inverse />
          <h2 id="ftr-title" className="ftr__motto display">La lutte contre la pollution, notre priorité.</h2>
          <p className="ftr__about">{SITE.about}</p>
          <TransitionLink href={CTA.href} className="ftr__alert">
            <span className="ftr__alert-dot" aria-hidden="true" /> {CTA.label}
          </TransitionLink>
        </div>

        <nav className="ftr__map" aria-label="Plan du site">
          {NAV.filter((n) => n.children).map((group) => (
            <div key={group.label}>
              <p className="eyebrow ftr__h">{group.label}</p>
              <ul>
                {group.children!.map((c) => (
                  <li key={c.href}>
                    <TransitionLink href={c.href}>{c.code ?? c.label}</TransitionLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="eyebrow ftr__h">Informations</p>
            <ul>
              {NAV.filter((n) => !n.children).map((n) => (
                <li key={n.href}>
                  <TransitionLink href={n.href}>{n.label}</TransitionLink>
                </li>
              ))}
              <li><TransitionLink href="/videos/">Vidéos</TransitionLink></li>
              <li><TransitionLink href="/plan-du-site/">Plan du site</TransitionLink></li>
            </ul>
          </div>
        </nav>

        <address className="ftr__contact">
          <p className="eyebrow ftr__h">Nous joindre</p>
          <a href={SITE.contact.mapUrl} target="_blank" rel="noopener noreferrer" className="ftr__addr">
            {SITE.contact.address.map((a) => (
              <span key={a}>{a}</span>
            ))}
          </a>
          {SITE.contact.phones.map((p) => (
            <a key={p} href={telHref(p)}>{p}</a>
          ))}
          {SITE.contact.emails.map((e) => (
            <a key={e} href={`mailto:${e}`}>{e}</a>
          ))}
          <p className="ftr__annex">{SITE.contact.annex}</p>
          <p className="ftr__annex">Antennes : {SITE.antennas.map((a) => a.city).join(", ")}</p>
          {SITE.social.length > 0 && (
            <ul className="ftr__social" aria-label="Réseaux sociaux">
              {SITE.social.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">{s.network}</a>
                </li>
              ))}
            </ul>
          )}
        </address>
      </div>

      <div className="ftr__giant" aria-hidden="true">
        <span className="display">CIAPOL</span>
      </div>

      <div className="shell ftr__bottom">
        <span>© {year} CIAPOL, Centre Ivoirien Antipollution. Établissement public à caractère administratif.</span>
        <span>
          Tutelle : <a href="https://environnement.gouv.ci/" target="_blank" rel="noopener noreferrer">Ministère de l&apos;Environnement et de la Transition Écologique</a>
        </span>
      </div>
    </footer>
  );
}
