import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../config/css-variables/tokens.css';
import './index.css';
import { PlaygroundApp } from './PlaygroundApp';

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root');
createRoot(container).render(
  <React.StrictMode>
    <PlaygroundApp />
  </React.StrictMode>,
);
