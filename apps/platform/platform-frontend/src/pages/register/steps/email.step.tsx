import { useState, type SubmitEvent } from "react";
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

export const EmailStep = () => {
  const { email, setEmail, setStep } = useRegister();
  const [error, setError] = useState("");

  const handleNext = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const normalized = email.trim().toLowerCase();
    if (!UserRegex.EMAIL.test(normalized)) {
      setError("Entre une adresse e-mail valide.");
      return;
    }
    setEmail(normalized);
    setStep("username");
  };

  return (
    <form noValidate onSubmit={handleNext} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Étape 1 sur 3
      </p>
      <h1 className="text-2xl font-bold">Ton adresse e-mail</h1>
      <Field>
        <FieldLabel htmlFor="register-email">E-mail</FieldLabel>
        <Input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="marginal92@example.com"
          autoFocus
          autoCapitalize="none"
          spellCheck={false}
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setError("");
          }}
          aria-invalid={!!error}
          aria-describedby={
            error ? "register-email-error" : "register-email-description"
          }
        />
        <FieldDescription id="register-email-description">
          On te spammera pas, promis.
        </FieldDescription>
        {error && (
          <FieldError id="register-email-error" role="alert">
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
            setStep("introduction");
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
