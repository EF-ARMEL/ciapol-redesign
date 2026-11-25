/* État partagé de la lagune, hors React (lu à chaque frame, sans re-render).
   - progress : avancée de lecture de la page (0..1), écrite par le scroll.
   - override : une section scénarisée (ex. « Parcours de dépollution ») peut
     prendre la main sur la pureté le temps de sa traversée.
   - windows : nombre de « fenêtres d'eau » visibles ; à 0, le shader ne dessine
     plus rien (le contenu opaque le recouvre entièrement). */

type Lagoon = {
  progress: number;
  velocity: number;
  override: number | null;
  windows: number;
  mode: "full" | "lite" | "off";
};

export const lagoon: Lagoon = {
  progress: 0,
  velocity: 0,
  override: null,
  windows: 0,
  mode: "full",
};

/** Pureté cible : la page se « dépollue » plus vite au début qu'à la fin,
    pour que la transformation soit sensible dès les premiers écrans. */
export function targetPurity(): number {
  if (lagoon.override !== null) return lagoon.override;
  const p = Math.min(Math.max(lagoon.progress, 0), 1);
  return 1 - Math.pow(1 - p, 1.6);
}
