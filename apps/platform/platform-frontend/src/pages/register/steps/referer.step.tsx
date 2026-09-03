import { useRef, useState, type SubmitEvent } from "react";
import { UserRegex } from "@marginal.credit/platform-sdk";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@marginal.credit/ui/field.tsx";
import { Input } from "@marginal.credit/ui/input.tsx";
import { Button } from "@marginal.credit/ui/button.tsx";
import { Spinner } from "@marginal.credit/ui/spinner.tsx";
import { Key } from "lucide-react";
import { Kbd } from "@marginal.credit/ui/kbd.tsx";
import {
  RadioGroup,
  RadioGroupItem,
} from "@marginal.credit/ui/radio-group.tsx";

import { useRegister } from "../register.context.tsx";

export const RefererStep = () => {
  const {
    refererName,
    setRefererName,
    setStep,
    email,
    name,
    submit,
    setUsernameError,
  } = useRegister();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);

  const [hasParrainage, setHasParrainage] = useState<"yes" | "no">("no");

  const handleNext = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const normalized =
      hasParrainage === "yes" ? refererName.trim().toLowerCase() : "";

    if (submitting.current) return;
    if (normalized && !UserRegex.USERNAME.test(normalized)) {
      setError(
        "Le pseudo de ton parrain doit contenir de 4 à 20 caractères : lettres, chiffres ou tirets bas (_).",
      );
      return;
    }
    if (normalized === name) {
      setError("Tu ne peux pas être ton propre parrain.");
      return;
    }
    setRefererName(normalized);
    submitting.current = true;
    setIsSubmitting(true);
    try {
      await submit({ email, name, refererName: normalized });
    } catch (cause) {
      if (cause instanceof Error && cause.message === `Name "${name}" taken`) {
        setUsernameError("Ce pseudo est déjà utilisé. Choisis-en un autre.");
        setStep("username");
      } else {
        setError(
          "Impossible d’activer ta Clé. Vérifie le pseudo de ton parrain.",
        );
      }
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  };

  const onChangeText = (text: string) => {
    if (!UserRegex.USERNAME_SOFT.test(text)) {
      return;
    }

    setRefererName(text);
    setError("");
  };

  return (
    <form
      noValidate
      onSubmit={handleNext}
      className="flex flex-col gap-4"
      aria-busy={isSubmitting}
    >
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Étape 3 sur 3
      </p>
      <h1 className="text-2xl font-bold">Parrainage</h1>
      <Field>
        <FieldLabel htmlFor="register-has-referer">
          As-tu un parrain ?
        </FieldLabel>
        <RadioGroup
          id="register-has-referer"
          value={hasParrainage}
          className="max-w-sm"
          onValueChange={(value) => setHasParrainage(value as "yes" | "no")}
        >
          <FieldLabel htmlFor="no">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Non</FieldTitle>
                <FieldDescription>
                  Pas grave, peut être que tu seras le parrain de quelqu'un
                  d'autre
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value="no" id="no" />
            </Field>
          </FieldLabel>
          <FieldLabel htmlFor="yes">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Oui</FieldTitle>
                <FieldDescription>
                  Toi et ton parrain gagnerez chacun <Kbd>50F</Kbd>.
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value="yes" id="yes" />
            </Field>
          </FieldLabel>
        </RadioGroup>
      </Field>

      {hasParrainage === "yes" && (
        <Field>
          <FieldLabel htmlFor="register-referer">
            Pseudo de ton parrain
          </FieldLabel>
          <Input
            id="register-referer"
            name="referer"
            autoComplete="off"
            placeholder="brigite68"
            autoFocus
            autoCapitalize="none"
            spellCheck={false}
            value={refererName}
            onChangeText={onChangeText}
            disabled={isSubmitting}
            aria-invalid={!!error}
            aria-describedby={error ? "register-referer-error" : undefined}
          />
          {error && (
            <FieldError id="register-referer-error" role="alert">
              {error}
            </FieldError>
          )}
        </Field>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          disabled={isSubmitting}
          onClick={() => {
            setError("");
            setStep("username");
          }}
        >
          Précédent
        </Button>
        <Button
          type="submit"
          size="lg"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : <Key />} Activer ma Clé
        </Button>
      </div>
    </form>
  );
};
