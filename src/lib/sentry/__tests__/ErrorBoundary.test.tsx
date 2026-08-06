/**
 * Sentry Error Boundary Tests
 * Tests for the error boundary component.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { SentryErrorBoundary } from '../ErrorBoundary';

// Mock @sentry/react-native
jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
}));

// Mock the init module
jest.mock('../init', () => ({
  isSentryInitialized: jest.fn(() => true),
}));

// Component that throws an error
const ThrowingComponent = ({
  shouldThrow = true,
}: {
  shouldThrow?: boolean;
}) => {
  if (shouldThrow) {
    throw new Error('Test error from ThrowingComponent');
  }
  return <Text>No error</Text>;
};

// Suppress console.error for expected errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (args[0]?.includes?.('Error boundaries should implement')) return;
    if (args[0]?.includes?.('[ErrorBoundary]')) return;
    originalError.call(console, ...args);
  };
});
afterAll(() => {
  console.error = originalError;
});

describe('SentryErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('normal rendering', () => {
    it('renders children when no error occurs', () => {
      const { getByText } = render(
        <SentryErrorBoundary>
          <Text>Hello World</Text>
        </SentryErrorBoundary>
      );

      expect(getByText('Hello World')).toBeTruthy();
    });

    it('renders multiple children', () => {
      const { getByText } = render(
        <SentryErrorBoundary>
          <Text>Child 1</Text>
          <Text>Child 2</Text>
        </SentryErrorBoundary>
      );

      expect(getByText('Child 1')).toBeTruthy();
      expect(getByText('Child 2')).toBeTruthy();
    });
  });

  describe('error handling', () => {
    it('shows fallback UI when error occurs', () => {
      const { getByText } = render(
        <SentryErrorBoundary>
          <ThrowingComponent />
        </SentryErrorBoundary>
      );

      expect(getByText('Something went wrong')).toBeTruthy();
      expect(
        getByText("We've been notified and are working to fix this.")
      ).toBeTruthy();
    });

    it('shows Try Again button in fallback', () => {
      const { getByText } = render(
        <SentryErrorBoundary>
          <ThrowingComponent />
        </SentryErrorBoundary>
      );

      expect(getByText('Try Again')).toBeTruthy();
    });

    it('calls onError callback when error occurs', () => {
      const onError = jest.fn();

      render(
        <SentryErrorBoundary onError={onError}>
          <ThrowingComponent />
        </SentryErrorBoundary>
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({ componentStack: expect.any(String) })
      );
    });

    it('reports error to Sentry', () => {
      const { captureException } = require('@sentry/react-native');

      render(
        <SentryErrorBoundary>
          <ThrowingComponent />
        </SentryErrorBoundary>
      );

      expect(captureException).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          extra: expect.objectContaining({
            componentStack: expect.any(String),
          }),
        })
      );
    });
  });

  describe('custom fallback', () => {
    it('renders custom fallback when provided', () => {
      const customFallback = (
        <View>
          <Text>Custom Error View</Text>
        </View>
      );

      const { getByText, queryByText } = render(
        <SentryErrorBoundary fallback={customFallback}>
          <ThrowingComponent />
        </SentryErrorBoundary>
      );

      expect(getByText('Custom Error View')).toBeTruthy();
      expect(queryByText('Something went wrong')).toBeNull();
    });
  });

  describe('recovery', () => {
    it('resets error state when Try Again is pressed', () => {
      let shouldThrow = true;

      const ConditionalThrower = () => {
        if (shouldThrow) {
          throw new Error('Conditional error');
        }
        return <Text>Recovered successfully</Text>;
      };

      const { getByText, rerender } = render(
        <SentryErrorBoundary>
          <ConditionalThrower />
        </SentryErrorBoundary>
      );

      // Error state is shown
      expect(getByText('Something went wrong')).toBeTruthy();

      // Fix the condition and press Try Again
      shouldThrow = false;
      fireEvent.press(getByText('Try Again'));

      // Force re-render after state change
      rerender(
        <SentryErrorBoundary>
          <ConditionalThrower />
        </SentryErrorBoundary>
      );

      // Should show recovered content
      expect(getByText('Recovered successfully')).toBeTruthy();
    });
  });
});
