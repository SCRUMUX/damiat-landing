import React, { useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';

import '@damiat/core/config/css-variables/tokens.css';
import '@damiat/core/blocks/_shared/marquee-keyframes.css';
import './index.css';
import { App } from './App';

function ThemeRoot({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', 'light');
    document.body.style.background = 'var(--color-bg-base)';
    document.body.style.color = 'var(--color-text-primary)';
  }, []);

  return <>{children}</>;
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeRoot>
      <App />
    </ThemeRoot>
  </React.StrictMode>,
);
