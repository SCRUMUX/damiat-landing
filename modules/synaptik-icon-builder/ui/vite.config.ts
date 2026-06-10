import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const coreRoot = path.resolve(__dirname, '../../..');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss')({ config: path.join(__dirname, 'tailwind.config.cjs') }),
        require('autoprefixer')(),
      ],
    },
  },
  server: {
    host: '127.0.0.1',
    port: 3740,
    strictPort: true,
    fs: {
      allow: [coreRoot, __dirname],
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3742',
        changeOrigin: true,
      },
    },
  },
});
