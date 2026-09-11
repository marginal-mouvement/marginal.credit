import { type SubmitEvent } from "react";
import { UserRegex } from "@marginal.credit/platform-sdk";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@marginal.credit/ui/field.tsx";
import { Input } from "@marginal.credit/ui/input.tsx";
import { Button } from "@marginal.credit/ui/button.tsx";
import { ArrowRightIcon } from "lucide-react";

import { useRegister } from "../register.context.tsx";

export const UsernameStep = () => {
  const {
    name,
    setName,
    setStep,
    usernameError: error,
    setUsernameError: setError,
  } = useRegister();

  const handleNext = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const normalized = name.trim().toLowerCase();
    if (!UserRegex.USERNAME.test(normalized)) {
      setError(
        "Choisis un pseudo de 4 à 20 caractères : lettres, chiffres ou tirets bas (_).",
      );
      return;
    }
    setName(normalized);
    setStep("referer");
  };

  const onChangeText = (text: string) => {
    if (!UserRegex.USERNAME_SOFT.test(text)) {
      return;
    }

    setName(text);
    setError("");
  };

  return (
    <form noValidate onSubmit={handleNext} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Étape 2 sur 3
      </p>
      <h1 className="text-2xl font-bold">Choisis ton pseudo</h1>
      <Field>
        <FieldLabel htmlFor="register-username">Pseudo</FieldLabel>
        <Input
          id="register-username"
          name="username"
          autoComplete="username"
          placeholder="brigite69"
          autoFocus
          autoCapitalize="none"
          spellCheck={false}
          value={name}
          onChangeText={onChangeText}
          aria-invalid={!!error}
          aria-describedby={
            error ? "register-username-error" : "register-username-description"
          }
        />
        <FieldDescription id="register-username-description">
          De 4 à 20 caractères : lettres, chiffres ou tirets (-, _).
        </FieldDescription>
        {error && (
          <FieldError id="register-username-error" role="alert">
            {error}
          </FieldError>
        )}
      </Field>
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => {
            setError("");
            setStep("email");
          }}
        >
          Précédent
        </Button>
        <Button type="submit" size="lg" className="flex-1">
          Suivant <ArrowRightIcon />
        </Button>
      </div>
    </form>
  );
};
