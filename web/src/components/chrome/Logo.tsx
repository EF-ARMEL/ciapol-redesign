/* Logo officiel du CIAPOL (fichier fourni par l'institution) + mot-symbole. */
export default function Logo({ inverse = false, compact = false }: { inverse?: boolean; compact?: boolean }) {
  return (
    <span className={`logo ${inverse ? "logo--inverse" : ""}`}>
      <span className="logo__mark">
        <img src="/media/site/logo-ciapol.png" alt="" width={200} height={137} />
      </span>
      {!compact && (
        <span className="logo__text">
          <span className="logo__name">CIAPOL</span>
          <span className="logo__full">Centre Ivoirien Antipollution</span>
        </span>
      )}
    </span>
  );
}
