import { Reveal } from "@/motion/primitives";
import type { Img } from "@/components/detail/parse";

/* Logos des partenaires du projet (texte alternatif officiel). */
export default function Partners({ logos }: { logos: Img[] }) {
  return (
    <Reveal as="ul" className="logos" y={20} stagger={0.06}>
      {logos.map((l) => (
        <li key={l.src} data-reveal-item>
          <img src={l.src} alt={l.alt} loading="lazy" decoding="async" />
        </li>
      ))}
    </Reveal>
  );
}
