/**
 * AsyncErrorBoundary - Handles unhandled promise rejections
 * Wraps error boundaries to catch promise rejections that escape normal error boundaries
 */

import React, { Component, type ReactNode, type ErrorInfo } from 'react';
import { ErrorFallback } from './ErrorFallback';

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  screenName?: string;
  onError?: (error: Error, errorInfo?: ErrorInfo) => void;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface AsyncErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class AsyncErrorBoundary extends Component<
  AsyncErrorBoundaryProps,
  AsyncErrorBoundaryState
> {
  private unhandledRejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;

  constructor(props: AsyncErrorBoundaryProps) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
      hasError: false,
    };
  }

  componentDidMount(): void {
    this.unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const error = reason instanceof Error ? reason : new Error(String(reason));

      if (__DEV__) {
        console.error(
          `[AsyncErrorBoundary${this.props.screenName ? `:${this.props.screenName}` : ''}] Unhandled promise rejection:`,
          error
        );
      }

      this.setState({
        error,
        errorInfo: null,
        hasError: true,
      });

      this.props.onError?.(error);
    };

    window.addEventListener('unhandledrejection', this.unhandledRejectionHandler);
  }

  componentWillUnmount(): void {
    if (this.unhandledRejectionHandler) {
      window.removeEventListener('unhandledrejection', this.unhandledRejectionHandler);
    }
  }

  static getDerivedStateFromError(error: Error): Partial<AsyncErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    if (__DEV__) {
      console.error(
        `[AsyncErrorBoundary${this.props.screenName ? `:${this.props.screenName}` : ''}] Caught error:`,
        error
      );
      console.error('[AsyncErrorBoundary] Component stack:', errorInfo.componentStack);
    }

    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({
      error: null,
      errorInfo: null,
      hasError: false,
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }
      return (
        <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />
      );
    }

    return this.props.children;
  }
}
