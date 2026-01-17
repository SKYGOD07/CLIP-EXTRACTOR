import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // Frontend lives inside /client
  root: path.resolve(__dirname, "client"),

  plugins: [react()],

  server: {
    port: 5173,
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      // client/src imports
      "@": path.resolve(__dirname, "client/src"),

      // shared types + routes used by both frontend & backend
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
});
