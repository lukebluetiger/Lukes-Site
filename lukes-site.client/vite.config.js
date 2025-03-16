import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  server: {
    // Development server settings - these won't affect production build
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5062',  
        changeOrigin: true,
        secure: false
      },
      '/hubs': {
        target: 'http://localhost:5062', 
        ws: true,
        changeOrigin: true,
        secure: false,
      },
      '/images': {
        target: 'http://localhost:5062',
        changeOrigin: true
      }
    }
  },
  build: {
    // Ensure assets are included properly in build
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate source maps for better debugging
    sourcemap: true,
  },
});