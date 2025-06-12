import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import RemoveConsole from "vite-plugin-remove-console";
import path from "path"

export default defineConfig({
  root: path.resolve(__dirname, "src/frontend"), // Указали, где корень фронта
  build: {
    outDir: path.resolve(__dirname, "dist"), // Куда складывать билд
  },
  publicDir: path.resolve(__dirname, "public"), // Где лежит публичка
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/frontend"), // Чтобы можно было писать @/components/...
    },
  },
  plugins: [react(), RemoveConsole()],
  base: "/",
  server: {
    port: 3000,
  },
});
