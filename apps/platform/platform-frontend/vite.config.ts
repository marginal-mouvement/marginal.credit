import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { config } from "dotenv";
import { findUpSync } from "find-up";

const envPath = findUpSync(".env");

config({
  path: envPath,
});

const outDir =
  process.env.PLATFORM_FRONT_BUILD_DEST ?? "../../backend/public/frontend";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  envDir: "../../../",
  build: {
    outDir,
    rollupOptions: {
      output: {
        assetFileNames: (assetFileInfo) => `assets/${assetFileInfo.name}`,
        entryFileNames: (entryFileInfo) => `assets/${entryFileInfo.name}.js`,
        chunkFileNames: (chunkFileInfo) => `assets/${chunkFileInfo.name}.js`,
      },
    },
  },
});
