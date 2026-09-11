import { Button } from "@marginal.credit/ui/button.tsx";
import { ArrowRightIcon } from "lucide-react";

import { useRegister } from "../register.context.tsx";
import key from "../../../assets/key.png";

export const IntroductionStep = () => {
  const { setStep } = useRegister();
  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-center animate-bounce">
        <img className="max-w-32" src={key} alt="key" />
      </div>
      <h1 className="text-2xl font-bold muted">Bienvenue chez Marginal</h1>
      <div className="flex flex-col gap-4 text-sm">
        <p>
          La Clé Marginal te permet de devenir un(e) membre du mouvement et de
          découvrir des collections et des contenus exclusifs.
        </p>
        <p>Plus tu gagnes de points, plus tu débloques d’avantages.</p>
        <div>
          <p>Tes points te permettent d' :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>accéder à des événements privés</li>
            <li>acheter des vêtements</li>
          </ul>
        </div>
        <div>
          <p>Pour gagner des points, il te suffit de :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>badger ta Clé sur une borne Marginal</li>
            <li>faire des achats en boutique</li>
            <li>parrainer de nouveaux(elles) membres</li>
          </ul>
        </div>
      </div>
      <div className="flex pt-4">
        <Button
          type="button"
          size="lg"
          className="flex-1 p-4"
          onClick={() => setStep("email")}
        >
          Suivant <ArrowRightIcon />
        </Button>
      </div>
    </section>
  );
};
