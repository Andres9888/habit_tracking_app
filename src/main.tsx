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

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex min-h-screen items-center justify-center bg-stone-50 p-4'>
          <div className='max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-lg'>
            <div className='mb-4 text-4xl'>😕</div>
            <h2 className='mb-2 text-xl font-semibold text-stone-800'>
              Something unexpected happened
            </h2>
            <p className='mb-4 text-stone-600'>
              We're sorry — something went wrong. Try reloading the app to continue.
            </p>
            {__DEV__ && (
              <pre className='mb-4 max-h-32 overflow-auto rounded bg-red-50 p-2 text-left text-xs text-red-800'>
                {String(this.state.error)}
              </pre>
            )}
            <button
              aria-label='Reload application'
              className='rounded-full bg-stone-800 px-6 py-2.5 text-white transition hover:bg-stone-700'
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
