import { use } from "react";

import { AuthContext } from "./auth.context.tsx";

export function useUser() {
  const { user } = use(AuthContext);

  return user!;
}
