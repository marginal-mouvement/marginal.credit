import type { KeyId } from "@marginal.credit/backend-framework";

export interface RequestContext {
  getToken(): string | undefined;
  setToken(token: string): void;
  getKeyId(): KeyId | undefined;
}
