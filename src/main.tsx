import { ConvexProvider, ConvexReactClient } from 'convex/react';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

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

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      return (
        <div
          aria-label='An error occurred in the application'
          className={`flex min-h-screen items-center justify-center p-4 ${
            isDarkMode ? 'bg-stone-900' : 'bg-stone-50'
          }`}
          role='alert'
        >
          <div className='max-w-md text-center'>
            <div className='mb-4 text-5xl'>😕</div>
            <h2 className={`mb-2 text-2xl font-semibold ${
              isDarkMode ? 'text-stone-100' : 'text-stone-900'
            }`}>
              We hit a bump
            </h2>
            <p className={`mb-2 font-semibold ${
              isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
            }`}>
              Your data is safe.
            </p>
            <p className={`mb-6 text-sm leading-relaxed ${
              isDarkMode ? 'text-stone-400' : 'text-stone-600'
            }`}>
              Something unexpected happened, but nothing was lost. Try reloading
              or retry below.
            </p>
            {__DEV__ && (
              <pre className={`mb-4 rounded-lg border p-3 text-left text-xs ${
                isDarkMode
                  ? 'border-red-900 bg-red-950/50 text-red-300'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}>
                {String(this.state.error)}
              </pre>
            )}
            <div className="flex flex-col gap-3">
              <button
                aria-label='Retry without reloading'
                className={`rounded-xl px-6 py-3 font-semibold transition-all hover:scale-105 active:scale-95 ${
                  isDarkMode
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-900/30'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'
                }`}
                type='button'
                onClick={this.handleRetry}
              >
                Try Again
              </button>
              <button
                aria-label='Reload application'
                className={`rounded-xl px-6 py-3 font-semibold transition-colors ${
                  isDarkMode
                    ? 'bg-stone-800 text-stone-200 hover:bg-stone-700'
                    : 'bg-stone-200 text-stone-900 hover:bg-stone-300'
                }`}
                type='button'
                onClick={() => window.location.reload()}
              >
                Reload App
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
if (!convexUrl) {
  throw new Error('VITE_CONVEX_URL is required but was not provided');
}
const convex = new ConvexReactClient(convexUrl);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ConvexProvider>
  </StrictMode>
);
