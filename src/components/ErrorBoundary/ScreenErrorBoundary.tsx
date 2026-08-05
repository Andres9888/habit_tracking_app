/**
 * ScreenErrorBoundary — drop-in wrapper for any screen.
 * Provides retry (reset error state) and optional go-back navigation.
 *
 * Usage:
 *   <ScreenErrorBoundary screenName="Analytics" onGoBack={navigation.goBack}>
 *     <AnalyticsContent />
 *   </ScreenErrorBoundary>
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react';

import { ScreenErrorFallback } from './ScreenErrorFallback';

interface ScreenErrorBoundaryProps {
  children: ReactNode;
  screenName: string;
  onGoBack?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ScreenErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ScreenErrorBoundary extends Component<
  ScreenErrorBoundaryProps,
  ScreenErrorBoundaryState
> {
  constructor(props: ScreenErrorBoundaryProps) {
    super(props);
    this.state = { error: null, hasError: false };
  }

  static getDerivedStateFromError(error: Error): ScreenErrorBoundaryState {
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

  handleRetry = (): void => {
    this.setState({ error: null, hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ScreenErrorFallback
          error={this.state.error}
          screenName={this.props.screenName}
          onGoBack={this.props.onGoBack}
          onRetry={this.handleRetry}
        />
      );
    }
    return this.props.children;
  }
}
