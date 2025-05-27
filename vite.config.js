import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import RemoveConsole from 'vite-plugin-remove-console';

export default defineConfig({
  plugins: [
    react(),
    // RemoveConsole()
  ],
  base : "/",
  server : {
    port : 3000
  }
});
