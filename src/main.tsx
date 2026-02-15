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
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          aria-label='An error occurred in the application'
          className='flex min-h-screen items-center justify-center bg-stone-50 p-4'
          role='alert'
        >
          <div className='max-w-md text-center'>
            <div className='mb-4 text-5xl'>😕</div>
            <h2 className='mb-2 text-2xl font-semibold text-stone-900'>
              We hit a bump
            </h2>
            <p className='mb-2 font-semibold text-stone-900'>
              Your data is safe.
            </p>
            <p className='mb-6 text-sm leading-relaxed text-stone-600'>
              Something unexpected happened, but nothing was lost. Try reloading
              the app.
            </p>
            {__DEV__ && (
              <pre className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-left text-xs text-red-700'>
                {String(this.state.error)}
              </pre>
            )}
            <button
              aria-label='Reload application'
              className='rounded-xl bg-stone-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-stone-800'
              type='button'
              onClick={() => window.location.reload()}
            >
              Reload App
            </button>
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
