/**
 * Web Entry Point
 *
 * Bootstraps the React app for the web platform with its own Convex client
 * and a lightweight error boundary.
 *
 * NOTE: This file uses a standalone ErrorBoundary rather than the shared
 * SentryErrorBoundary from `./lib/sentry` because Sentry is initialized
 * lazily inside `<App />` (via `scheduleSentryInit`). If Sentry's boundary
 * wrapped the root here, errors during Sentry init itself would be lost.
 * This boundary is intentionally dependency-free so the web shell always
 * has a fallback UI.
 */

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// ---------------------------------------------------------------------------
// Design tokens (keep in sync with Tailwind / theme config)
// ---------------------------------------------------------------------------

/** Fallback error UI colour tokens so the boundary doesn't rely on CSS. */
const ERROR_TOKENS = {
  background: '#FEF2F2',   // red-50
  border: '#FCA5A5',       // red-300
  text: '#991B1B',         // red-800
  buttonBg: '#292524',     // stone-800
  buttonText: '#FFFFFF',
} as const;

// ---------------------------------------------------------------------------
// Root error boundary (dependency-free)
// ---------------------------------------------------------------------------

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: unknown }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    if (__DEV__) console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className='m-4 rounded-md border p-4'
          style={{
            backgroundColor: ERROR_TOKENS.background,
            borderColor: ERROR_TOKENS.border,
            color: ERROR_TOKENS.text,
          }}
        >
          <h2 className='mb-2 font-semibold'>Something went wrong</h2>
          <pre className='whitespace-pre-wrap text-sm'>
            {String(this.state.error)}
          </pre>
          <button
            aria-label='Reload application'
            className='mt-3 rounded px-3 py-1'
            style={{
              backgroundColor: ERROR_TOKENS.buttonBg,
              color: ERROR_TOKENS.buttonText,
            }}
            type='button'
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Convex client
// ---------------------------------------------------------------------------

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
if (!convexUrl) {
  throw new Error('VITE_CONVEX_URL is required but was not provided');
}
const convex = new ConvexReactClient(convexUrl);

// ---------------------------------------------------------------------------
// Mount
// ---------------------------------------------------------------------------

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ConvexProvider>
  </StrictMode>
);
