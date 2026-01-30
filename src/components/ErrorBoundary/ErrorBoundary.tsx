/**
 * ErrorBoundary Component
 * Catches JavaScript errors in child component tree
 * and displays a fallback UI instead of crashing
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
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

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
            backgroundColor: '#fafaf9',
          }}
        >
          <Text
            style={{
              fontSize: 48,
              marginBottom: 16,
            }}
          >
            😕
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: '#1c1917',
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            Something went wrong
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#78716c',
              marginBottom: 24,
              textAlign: 'center',
            }}
          >
            We encountered an unexpected error. Please try again.
          </Text>
          <Pressable
            style={{
              backgroundColor: '#22c55e',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
            }}
            onPress={this.handleRetry}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
              Try Again
            </Text>
          </Pressable>
          {__DEV__ && this.state.error && (
            <Text
              style={{
                marginTop: 24,
                fontSize: 12,
                color: '#dc2626',
                fontFamily: 'monospace',
                textAlign: 'left',
                maxWidth: 300,
              }}
            >
              {this.state.error.message}
            </Text>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
