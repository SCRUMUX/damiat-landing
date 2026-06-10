import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Pin React to playground's copy so the @ai-ds/core source we import
      // from ../components/** uses the same React runtime.
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: false,
  },
});
