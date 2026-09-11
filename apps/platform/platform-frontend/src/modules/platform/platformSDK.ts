import { PlatformSDK } from "@marginal.credit/platform-sdk";
import { toast } from "sonner";

import { KeyStore } from "../key/key.store.ts";

export const platformSDK = new PlatformSDK(
  import.meta.env.VITE_PLATFORM_BASE_URL,
)
  .withDefaultErrorCallback((error) => {
    toast.error(error.message);
  })
  .loginByKey(KeyStore.load());
