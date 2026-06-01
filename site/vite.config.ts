import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteDir = path.dirname(fileURLToPath(import.meta.url));
const damiatCoreRoot = path.resolve(siteDir, '../core');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve(siteDir, 'node_modules/react'),
      'react-dom': path.resolve(siteDir, 'node_modules/react-dom'),
      '@ai-ds/core': damiatCoreRoot,
      '@damiat/core': damiatCoreRoot,
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: '127.0.0.1',
  },
});
