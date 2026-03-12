import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from 'react';

import { WebErrorFallback } from './WebErrorFallback';

interface WebErrorBoundaryState {
  error: Error | null;
  hasError: boolean;
}

function reloadPage(): void {
  globalThis.location.reload();
}

export class WebErrorBoundary extends Component<
  PropsWithChildren,
  WebErrorBoundaryState
> {
  override state: WebErrorBoundaryState = { error: null, hasError: false };

  static getDerivedStateFromError(error: Error): WebErrorBoundaryState {
    return { error, hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (__DEV__) {
      console.error('ErrorBoundary caught an error', error, errorInfo);
    }
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return <WebErrorFallback error={this.state.error} onReload={reloadPage} />;
    }

    return this.props.children;
  }
}
