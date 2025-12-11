import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  
  // --- GANTI BAGIAN INI (LEBIH AMPUH) ---
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Hapus console.log
        drop_debugger: true, // Hapus debugger
      },
    },
  },
  // --------------------------------------

  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));