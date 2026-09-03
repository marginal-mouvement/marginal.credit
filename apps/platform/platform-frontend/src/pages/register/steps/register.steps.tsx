import type { ReactNode } from "react";

import { IntroductionStep } from "./introduction.step.tsx";
import { EmailStep } from "./email.step.tsx";
import { UsernameStep } from "./username.step.tsx";
import { RefererStep } from "./referer.step.tsx";

import { type RegisterStepId, useRegister } from "../register.context.tsx";

const steps = {
  introduction: IntroductionStep,
  email: EmailStep,
  username: UsernameStep,
  referer: RefererStep,
} satisfies Record<RegisterStepId, () => ReactNode>;

export const RegisterSteps = () => {
  const { step } = useRegister();
  const Component = steps[step];
  return <Component />;
};
