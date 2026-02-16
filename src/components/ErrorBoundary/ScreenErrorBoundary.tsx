/**
 * ScreenErrorBoundary — drop-in wrapper for any screen.
 * Provides retry (reset error state) and optional go-back navigation.
 * Integrates error categorization for better error messaging.
 *
 * Usage:
 *   <ScreenErrorBoundary screenName="Analytics" onGoBack={navigation.goBack}>
 *     <AnalyticsContent />
 *   </ScreenErrorBoundary>
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react';

import { ScreenErrorFallback } from './ScreenErrorFallback';
import { categorizeError } from '../../lib/errors/errorTypes';

interface ScreenErrorBoundaryProps {
  children: ReactNode;
  screenName: string;
  onGoBack?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRetryAttempt?: (attemptNumber: number) => void;
}

interface ScreenErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

export class ScreenErrorBoundary extends Component<
  ScreenErrorBoundaryProps,
  ScreenErrorBoundaryState
> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ScreenErrorBoundaryProps) {
    super(props);
    this.state = { error: null, hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<ScreenErrorBoundaryState> {
    return { error, hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (__DEV__) {
      console.error(
        `[ScreenErrorBoundary:${this.props.screenName}]`,
        error,
        errorInfo.componentStack
      );
    }
    this.props.onError?.(error, errorInfo);
  }

  componentWillUnmount(): void {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = (): void => {
    const newRetryCount = this.state.retryCount + 1;
    this.setState({ error: null, hasError: false, retryCount: newRetryCount });
    this.props.onRetryAttempt?.(newRetryCount);
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      const categorized = categorizeError(this.state.error);
      return (
        <ScreenErrorFallback
          error={this.state.error}
          screenName={this.props.screenName}
          onGoBack={this.props.onGoBack}
          onRetry={this.handleRetry}
          errorCategory={categorized.category}
          userMessage={categorized.userMessage}
          isRetryable={categorized.isRetryable}
          retryCount={this.state.retryCount}
        />
      );
    }
    return this.props.children;
  }
}
