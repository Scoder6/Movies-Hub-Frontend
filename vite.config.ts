import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173, // Frontend development server port
    open: true, // Auto-open browser in development
    strictPort: true, // Fail if port is in use
    proxy: {
      '^/api/.*': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    },
    // Handle SPA fallback for client-side routing
    fs: {
      strict: false
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    minify: "terser",
    sourcemap: mode === "development",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          vendor: ["lodash", "axios"]
        }
      }
    }
  }
}));
