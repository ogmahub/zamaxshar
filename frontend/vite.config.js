import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "router": ["react-router-dom"],
          "motion": ["framer-motion"],
          "i18n": ["i18next", "react-i18next"],
          "utils": ["axios", "react-hot-toast"],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      "/api": {
        target: "https://zamaxshar.onrender.com",
        changeOrigin: true,
        secure: true
      }
    }
  }
});
