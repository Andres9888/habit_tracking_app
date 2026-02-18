/**
 * ScreenErrorBoundary — drop-in wrapper for any screen.
 * Provides retry (reset error state) and optional go-back navigation.
 *
 * Note: Error Boundary requires a class component for the error catching.
 * This file uses a class component internally but exposes a function component interface.
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

/**
 * Internal class component that handles error catching
 * Using class component is required by React to catch errors
 */
class ErrorCatcher extends Component<
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

/**
 * Function component wrapper that forwards props to the ErrorCatcher
 * This allows the component to be used as a regular function component
 */
export function ScreenErrorBoundary({
  children,
  screenName,
  onGoBack,
  onError,
}: ScreenErrorBoundaryProps): ReactNode {
  return (
    <ErrorCatcher
      screenName={screenName}
      onGoBack={onGoBack}
      onError={onError}
    >
      {children}
    </ErrorCatcher>
  );
}
