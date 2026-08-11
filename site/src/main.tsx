import React, { useLayoutEffect, Component, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import '@ai-ds/core/tokens';
import './index.css';
import { App } from './App';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[DAMIAT] Render error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'monospace', color: '#ef4444', background: '#1a1a2e', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Runtime Error</h1>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', opacity: 0.8 }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <ErrorBoundary>
      <ThemeRoot>
        <App />
      </ThemeRoot>
    </ErrorBoundary>
  </React.StrictMode>,
);
