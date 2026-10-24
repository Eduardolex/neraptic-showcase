import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  // Keep the example independent of PostCSS configuration in parent folders.
  css: { postcss: { plugins: [] } },
  server: { host: '127.0.0.1', port: 4187, strictPort: true },
});
