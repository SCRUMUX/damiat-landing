import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { SynaptikTheme } from './providers/SynaptikTheme.js';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SynaptikTheme>
      <App />
    </SynaptikTheme>
  </React.StrictMode>,
);
