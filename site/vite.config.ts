import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const siteDir = path.dirname(fileURLToPath(import.meta.url));
const productRoot = path.resolve(siteDir, 'product');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@damiat/product': productRoot,
      '@damiat/core': productRoot,
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    host: '127.0.0.1',
  },
});
