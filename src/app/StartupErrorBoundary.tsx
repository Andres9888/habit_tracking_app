import type { PropsWithChildren } from 'react';
import { Component } from 'react';

import { AppStartupFallback } from './AppStartupFallback';

type ErrorBoundaryState = {
  hasError: boolean;
};

export class StartupErrorBoundary extends Component<
  PropsWithChildren,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch() {
    if (__DEV__) {
      // Keep startup issues visible in the fallback, do not rethrow.
    }
  }

  override render() {
    if (this.state.hasError) {
      return <AppStartupFallback />;
    }

    return this.props.children;
  }
}
