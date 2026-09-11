import { useContext } from "react";

import { AuthContext } from "./modules/auth/auth.context.tsx";
import { AuthenticatedContainer } from "./containers/authenticated.container.tsx";
import { UnauthenticatedContainer } from "./containers/unauthenticated.container.tsx";
import { FullPageSpinner } from "./pages/fullPageSpinner.tsx";

export function App() {
  const { isLoading, isAuthenticated } = useContext(AuthContext);

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (isAuthenticated) {
    return <AuthenticatedContainer />;
  }

  return <UnauthenticatedContainer />;
}

export default App;
