import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "@marginal.credit/ui/theme-provider.tsx";
import { Toaster } from "@marginal.credit/ui/sonner.tsx";

import App from "./App.tsx";
import { AuthContextProvider } from "./modules/auth/auth.context.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider defaultTheme="light">
      <AuthContextProvider>
        <Toaster position="top-center" />
        <App />
      </AuthContextProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
