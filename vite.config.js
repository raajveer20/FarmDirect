import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(async ({ command }) => {
  const plugins = [
    react(),
    tailwindcss()
  ];

  // Only load the DB API plugin during local dev server, never during production build
  if (command === 'serve') {
    const { farmDirectApiPlugin } = await import('./src/server/apiPlugin.js');
    plugins.push(farmDirectApiPlugin());
  }

  return {
    server: {
      host: '0.0.0.0',
      port: 5173
    },
    plugins,
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('recharts') || id.includes('d3')) {
                return 'vendor-recharts';
              }
              if (id.includes('leaflet')) {
                return 'vendor-leaflet';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-lucide';
              }
              return 'vendor-other';
            }
          }
        }
      }
    }
  };
});
