import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const CORE_ROOT = path.resolve(__dirname, '../..');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      '@core': CORE_ROOT,
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5175,
    strictPort: true,
    fs: {
      allow: [CORE_ROOT],
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 5175,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
