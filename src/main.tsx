import React, { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const ROOT_ELEMENT_ID = 'root';
const FALLBACK_HEADING = 'We hit a bump';
const FALLBACK_SECONDARY_TEXT = 'Your data is safe.';
const FALLBACK_DESCRIPTION =
  'Something unexpected happened, but nothing was lost. Try reloading the app.';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

function WebErrorFallback({
  error,
  onReload,
}: {
  error: Error | null;
  onReload: () => void;
}): ReactNode {
  return (
    <div
      aria-label='An error occurred in the application'
      className='flex min-h-screen items-center justify-center bg-stone-50 p-4'
      role='alert'
    >
      <div className='max-w-md text-center'>
        <div className='mb-4 text-5xl'>😕</div>
        <h2 className='mb-2 text-2xl font-semibold text-stone-900'>
          {FALLBACK_HEADING}
        </h2>
        <p className='mb-2 font-semibold text-stone-900'>
          {FALLBACK_SECONDARY_TEXT}
        </p>
        <p className='mb-6 text-sm leading-relaxed text-stone-600'>
          {FALLBACK_DESCRIPTION}
        </p>
        {__DEV__ && <pre className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-left text-xs text-red-700'>{String(error)}</pre>}
        <button
          aria-label='Reload application'
          className='rounded-xl bg-stone-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-stone-800'
          type='button'
          onClick={onReload}
        >
          Reload App
        </button>
      </div>
    </div>
  );
}

class WebErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (__DEV__) {
      console.error('ErrorBoundary caught an error', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return <WebErrorFallback error={this.state.error} onReload={() => window.location.reload()} />;
    }

    return this.props.children;
  }
}

function getRootElement(): HTMLElement {
  const rootElement = document.getElementById(ROOT_ELEMENT_ID);

  if (!rootElement) {
    throw new Error(`Root element with id "${ROOT_ELEMENT_ID}" not found in HTML`);
  }

  return rootElement;
}

createRoot(getRootElement()).render(
  <StrictMode>
    <WebErrorBoundary>
      <App />
    </WebErrorBoundary>
  </StrictMode>
);
