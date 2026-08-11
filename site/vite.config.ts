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
      // Force all react/react-dom imports to the consumer's copy — prevents
      // a double-React instance when @ai-ds/core is installed from git+https
      // or a file: symlink that has its own node_modules.
      react: path.resolve(siteDir, 'node_modules/react'),
      'react-dom': path.resolve(siteDir, 'node_modules/react-dom'),
      '@damiat/product': productRoot,
      '@damiat/core': productRoot,
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  server: {
    port: 5173,
    strictPort: false,
    host: '127.0.0.1',
  },
});
