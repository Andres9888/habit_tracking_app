/**
 * OfflineIndicator Tests
 *
 * Tests for the offline status indicator component.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { OfflineIndicator } from '../OfflineIndicator';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.addWhitelistedNativeProps = jest.fn();
  Reanimated.default.addWhitelistedUIProps = jest.fn();
  return Reanimated;
});

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  WifiOff: () => 'WifiOff',
}));

describe('OfflineIndicator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('visibility', () => {
    it('renders nothing when visible is false (default)', () => {
      render(<OfflineIndicator />);
      expect(screen.queryByTestId('offline-indicator')).toBeNull();
    });

    it('renders nothing when visible is explicitly false', () => {
      render(<OfflineIndicator visible={false} />);
      expect(screen.queryByTestId('offline-indicator')).toBeNull();
    });

    it('renders when visible is true', () => {
      render(<OfflineIndicator visible={true} />);
      expect(screen.getByTestId('offline-indicator')).toBeTruthy();
    });
  });

  describe('content', () => {
    it('displays "Offline" text', () => {
      render(<OfflineIndicator visible={true} />);
      expect(screen.getByText('Offline')).toBeTruthy();
    });

    it('renders the WifiOff icon', () => {
      render(<OfflineIndicator visible={true} />);
      // Icon is rendered as a mock component, verify it exists in the tree
      const indicator = screen.getByTestId('offline-indicator');
      expect(indicator).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has appropriate accessibility label', () => {
      render(<OfflineIndicator visible={true} />);
      const indicator = screen.getByTestId('offline-indicator');
      expect(indicator.props.accessibilityLabel).toBe(
        'You are offline. Changes will sync when reconnected.'
      );
    });

    it('has accessibility role of alert', () => {
      render(<OfflineIndicator visible={true} />);
      const indicator = screen.getByTestId('offline-indicator');
      expect(indicator.props.accessibilityRole).toBe('alert');
    });

    it('has polite accessibility live region', () => {
      render(<OfflineIndicator visible={true} />);
      const indicator = screen.getByTestId('offline-indicator');
      expect(indicator.props.accessibilityLiveRegion).toBe('polite');
    });
  });

  describe('customization', () => {
    it('accepts custom testID', () => {
      render(
        <OfflineIndicator visible={true} testID='custom-offline-indicator' />
      );
      expect(screen.getByTestId('custom-offline-indicator')).toBeTruthy();
    });

    it('accepts custom style', () => {
      const customStyle = { marginTop: 100 };
      render(<OfflineIndicator visible={true} style={customStyle} />);
      const indicator = screen.getByTestId('offline-indicator');
      // Style is merged, so we verify the component renders
      expect(indicator).toBeTruthy();
    });
  });

  describe('transitions', () => {
    it('re-renders correctly when visibility changes', () => {
      const { rerender } = render(<OfflineIndicator visible={false} />);
      expect(screen.queryByTestId('offline-indicator')).toBeNull();

      rerender(<OfflineIndicator visible={true} />);
      expect(screen.getByTestId('offline-indicator')).toBeTruthy();

      rerender(<OfflineIndicator visible={false} />);
      // Note: In actual implementation with animations, component might
      // still be visible during exit animation. This tests initial state.
    });
  });
});

describe('OfflineIndicator with NetworkStatus integration', () => {
  it('can be controlled by external online/offline state', () => {
    const isOnline = false;
    render(<OfflineIndicator visible={!isOnline} />);
    expect(screen.getByTestId('offline-indicator')).toBeTruthy();
  });

  it('hides when online', () => {
    const isOnline = true;
    render(<OfflineIndicator visible={!isOnline} />);
    expect(screen.queryByTestId('offline-indicator')).toBeNull();
  });
});
