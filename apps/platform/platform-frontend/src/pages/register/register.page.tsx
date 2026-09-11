import { useNavigate, useParams } from "react-router";
import { use, useEffect, useState } from "react";

import { RegisterProvider, type RegisterData } from "./register.context.tsx";
import { RegisterSteps } from "./steps/register.steps.tsx";

import { AuthContext } from "../../modules/auth/auth.context.tsx";
import { platformSDK } from "../../modules/platform/platformSDK.ts";
import { FullPageSpinner } from "../fullPageSpinner.tsx";
import { Content } from "../../parts/content.tsx";

export const RegisterPage = () => {
  const { login } = use(AuthContext);
  const { keyId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchKeyStatus() {
      if (!keyId) {
        navigate("/");
        return;
      }
      const isAvailable = await platformSDK.key.isAvailable(keyId);
      if (!isAvailable) {
        await login(keyId);
        navigate("/");
        return;
      }
      setIsLoading(false);
    }
    fetchKeyStatus().catch(() => navigate("/"));
  }, [keyId, login, navigate]);

  const handleSubmit = async (data: RegisterData) => {
    if (!keyId) throw new Error("Missing key ID");
    await platformSDK.user.claimKey({
      keyId,
      ...data,
      refererName: data.refererName || undefined,
    });
    await login(keyId);
    navigate("/");
  };

  if (isLoading) return <FullPageSpinner />;

  return (
    <RegisterProvider key={keyId} onSubmit={handleSubmit}>
      <Content className="flex min-h-svh flex-col justify-center gap-6 py-8">
        <RegisterSteps />
      </Content>
    </RegisterProvider>
  );
};
