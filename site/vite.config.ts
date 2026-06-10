import path from 'node:path';

import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';



import { resolveCoreRoot } from './resolveCoreRoot';



const siteDir = path.dirname(fileURLToPath(import.meta.url));

const damiatCoreRoot = resolveCoreRoot(siteDir);



if (process.env.NODE_ENV !== 'production') {

  console.log(`[damiat-landing] core root: ${damiatCoreRoot}`);

}



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

    strictPort: false,

    host: '127.0.0.1',

  },

});

