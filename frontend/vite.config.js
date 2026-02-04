import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5001", // ✅ YOUR BACKEND PORT
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
