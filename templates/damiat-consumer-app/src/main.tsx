import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../../config/css-variables/tokens.css';
import './index.css';
import { App } from './App';

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root');

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
