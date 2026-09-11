import { PlatformSDK } from "@marginal.credit/platform-sdk";
import { toast } from "sonner";

import { PlatformApiKeyStore } from "./platformApiKey.store.ts";

export const platformSDK = new PlatformSDK(
  import.meta.env.VITE_PLATFORM_BASE_URL,
)
  .loginByApiKey(PlatformApiKeyStore.load())
  .withDefaultErrorCallback((error) => {
    toast.error(error.message);
  });
