import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  plugins: [react(), tsconfigPaths(), tailwindcss()],
});
