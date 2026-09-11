import { createContext, use, useState, type PropsWithChildren } from "react";

export type RegisterStepId = "introduction" | "email" | "username" | "referer";

export interface RegisterData {
  email: string;
  name: string;
  refererName: string;
}

interface RegisterContextValue {
  step: RegisterStepId;
  setStep: (step: RegisterStepId) => void;
  email: string;
  setEmail: (email: string) => void;
  name: string;
  setName: (name: string) => void;
  refererName: string;
  setRefererName: (name: string) => void;
  usernameError: string;
  setUsernameError: (error: string) => void;
  submit: (data: RegisterData) => Promise<void>;
}

const RegisterContext = createContext<RegisterContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useRegister = () => {
  const context = use(RegisterContext);
  if (!context) throw new Error("useRegister requires RegisterProvider");
  return context;
};

export const RegisterProvider = ({
  children,
  onSubmit,
}: PropsWithChildren<{ onSubmit: (data: RegisterData) => Promise<void> }>) => {
  const [step, setStep] = useState<RegisterStepId>("introduction");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [refererName, setRefererName] = useState("");
  const [usernameError, setUsernameError] = useState("");

  return (
    <RegisterContext.Provider
      value={{
        step,
        setStep,
        email,
        setEmail,
        name,
        setName,
        refererName,
        setRefererName,
        usernameError,
        setUsernameError,
        submit: onSubmit,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
};
