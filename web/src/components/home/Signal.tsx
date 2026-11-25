import WaterWindow from "@/motion/WaterWindow";
import Button from "@/components/ui/Button";
import { Reveal, SplitReveal } from "@/motion/primitives";

/* Conclusion de l'accueil : l'eau est désormais limpide. Appel à l'action
   citoyen — signaler une pollution. */
export default function Signal() {
  return (
    <WaterWindow as="section" className="signal" aria-labelledby="signal-title">
      <div className="shell signal__inner">
        <Reveal>
          <span className="tag signal__tag">Vigilance citoyenne</span>
        </Reveal>
        <SplitReveal as="h2" id="signal-title" mode="words" className="signal__title display">
          Une eau claire, ça se protège ensemble.
        </SplitReveal>
        <Reveal delay={0.15} className="signal__row">
          <p className="signal__lead">
            Déversement d&apos;hydrocarbures, rejet industriel, nuisances olfactives, mortalité de poissons, dépôt
            sauvage : signalez-le au CIAPOL. Chaque signalement aide nos équipes à intervenir plus vite.
          </p>
          <div className="signal__actions">
            <Button href="/signaler/" variant="alert" magnetic>
              Signaler une pollution
            </Button>
            <Button href="/contact/" variant="ghost">Contacter le CIAPOL</Button>
          </div>
        </Reveal>
      </div>
    </WaterWindow>
  );
}
