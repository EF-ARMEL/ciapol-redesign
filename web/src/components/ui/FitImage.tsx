/* Photo affichée en entier, jamais recadrée : l'image est contenue dans son
   cadre et posée sur un fond flouté tiré d'elle-même (pas de bandes vides).
   Les photos d'actualité du CIAPOL mêlent paysages et portraits : un cadre
   unique en « cover » coupait têtes et légendes. */
export default function FitImage({
  src,
  alt = "",
  eager = false,
  className = "",
}: {
  src: string;
  alt?: string;
  eager?: boolean;
  className?: string;
}) {
  return (
    <span className={`fit ${className}`}>
      <img className="fit__bg" src={src} alt="" aria-hidden="true" loading={eager ? "eager" : "lazy"} decoding="async" />
      <img
        className="fit__img"
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        {...(eager ? { fetchPriority: "high" as const } : {})}
      />
    </span>
  );
}
