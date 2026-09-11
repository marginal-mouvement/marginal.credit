import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@marginal.credit/ui/theme-provider.tsx";
import { Toaster } from "@marginal.credit/ui/sonner.tsx";

import "./index.css";

import App from "./App.tsx";
import { ReaderContextProvider } from "./core/reader/reader.context.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <ReaderContextProvider>
        <Toaster position="top-right" />
        <App />
      </ReaderContextProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
