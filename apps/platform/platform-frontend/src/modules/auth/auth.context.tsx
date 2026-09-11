import type { SimpleUser } from "@marginal.credit/platform-sdk";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { platformSDK } from "../platform/platformSDK.ts";
import { KeyStore } from "../key/key.store.ts";

interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: SimpleUser;
  login: (keyId?: string) => Promise<void>;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue>(null!);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<SimpleUser | undefined>(undefined);

  const logout = useCallback(() => {
    setUser(undefined);
    setIsLoading(false);
    platformSDK.logout();
    KeyStore.erase();
  }, []);

  const authenticate = useCallback(
    async (keyId?: string) => {
      if (keyId) {
        platformSDK.loginByKey(keyId);
        KeyStore.save(keyId);
      }

      const seemsAuth = platformSDK.seemsAuthenticated();

      if (!seemsAuth) {
        logout();
        return;
      }

      try {
        const user = await platformSDK.user.me();
        setUser(user);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        logout();
      }
    },
    [logout],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    authenticate().catch(console.error);
  }, [authenticate, logout]);

  const value = useMemo(
    () => ({
      isLoading,
      isAuthenticated: !!user,
      user,
      login: authenticate,
      logout,
    }),
    [isLoading, user, authenticate, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
