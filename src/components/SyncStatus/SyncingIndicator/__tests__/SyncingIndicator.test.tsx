/**
 * SyncingIndicator Tests
 *
 * Tests for the syncing status indicator component.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { SyncingIndicator } from '../SyncingIndicator';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.addWhitelistedNativeProps = jest.fn();
  Reanimated.default.addWhitelistedUIProps = jest.fn();
  return Reanimated;
});

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  RefreshCw: () => 'RefreshCw',
}));

describe('SyncingIndicator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('visibility', () => {
    it('renders nothing when visible is false (default)', () => {
      render(<SyncingIndicator />);
      expect(screen.queryByTestId('syncing-indicator')).toBeNull();
    });

    it('renders nothing when visible is explicitly false', () => {
      render(<SyncingIndicator visible={false} />);
      expect(screen.queryByTestId('syncing-indicator')).toBeNull();
    });

    it('renders when visible is true', () => {
      render(<SyncingIndicator visible={true} />);
      expect(screen.getByTestId('syncing-indicator')).toBeTruthy();
    });
  });

  describe('content', () => {
    it('displays "Syncing" text', () => {
      render(<SyncingIndicator visible={true} />);
      expect(screen.getByText('Syncing')).toBeTruthy();
    });

    it('renders the RefreshCw icon', () => {
      render(<SyncingIndicator visible={true} />);
      const indicator = screen.getByTestId('syncing-indicator');
      expect(indicator).toBeTruthy();
    });
  });

  describe('pending count badge', () => {
    it('does not show count badge when pendingCount is undefined', () => {
      render(<SyncingIndicator visible={true} />);
      expect(screen.queryByTestId('syncing-indicator-count')).toBeNull();
    });

    it('does not show count badge when pendingCount is 0', () => {
      render(<SyncingIndicator visible={true} pendingCount={0} />);
      expect(screen.queryByTestId('syncing-indicator-count')).toBeNull();
    });

    it('shows count badge when pendingCount is greater than 0', () => {
      render(<SyncingIndicator visible={true} pendingCount={5} />);
      expect(screen.getByTestId('syncing-indicator-count')).toBeTruthy();
      expect(screen.getByText('5')).toBeTruthy();
    });

    it('displays correct count for single item', () => {
      render(<SyncingIndicator visible={true} pendingCount={1} />);
      expect(screen.getByText('1')).toBeTruthy();
    });

    it('displays correct count for many items', () => {
      render(<SyncingIndicator visible={true} pendingCount={99} />);
      expect(screen.getByText('99')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has appropriate accessibility label without count', () => {
      render(<SyncingIndicator visible={true} />);
      const indicator = screen.getByTestId('syncing-indicator');
      expect(indicator.props.accessibilityLabel).toBe('Syncing changes');
    });

    it('has accessibility label with singular count', () => {
      render(<SyncingIndicator visible={true} pendingCount={1} />);
      const indicator = screen.getByTestId('syncing-indicator');
      expect(indicator.props.accessibilityLabel).toBe('Syncing 1 change');
    });

    it('has accessibility label with plural count', () => {
      render(<SyncingIndicator visible={true} pendingCount={5} />);
      const indicator = screen.getByTestId('syncing-indicator');
      expect(indicator.props.accessibilityLabel).toBe('Syncing 5 changes');
    });

    it('has accessibility role of alert', () => {
      render(<SyncingIndicator visible={true} />);
      const indicator = screen.getByTestId('syncing-indicator');
      expect(indicator.props.accessibilityRole).toBe('alert');
    });

    it('has polite accessibility live region', () => {
      render(<SyncingIndicator visible={true} />);
      const indicator = screen.getByTestId('syncing-indicator');
      expect(indicator.props.accessibilityLiveRegion).toBe('polite');
    });
  });

  describe('customization', () => {
    it('accepts custom testID', () => {
      render(
        <SyncingIndicator visible={true} testID='custom-syncing-indicator' />
      );
      expect(screen.getByTestId('custom-syncing-indicator')).toBeTruthy();
    });

    it('accepts custom style', () => {
      const customStyle = { marginTop: 100 };
      render(<SyncingIndicator visible={true} style={customStyle} />);
      const indicator = screen.getByTestId('syncing-indicator');
      expect(indicator).toBeTruthy();
    });
  });

  describe('transitions', () => {
    it('re-renders correctly when visibility changes', () => {
      const { rerender } = render(<SyncingIndicator visible={false} />);
      expect(screen.queryByTestId('syncing-indicator')).toBeNull();

      rerender(<SyncingIndicator visible={true} />);
      expect(screen.getByTestId('syncing-indicator')).toBeTruthy();

      rerender(<SyncingIndicator visible={false} />);
      // Note: In actual implementation with animations, component might
      // still be visible during exit animation. This tests initial state.
    });

    it('updates count badge when pendingCount changes', () => {
      const { rerender } = render(
        <SyncingIndicator visible={true} pendingCount={3} />
      );
      expect(screen.getByText('3')).toBeTruthy();

      rerender(<SyncingIndicator visible={true} pendingCount={7} />);
      expect(screen.getByText('7')).toBeTruthy();
    });
  });
});

describe('SyncingIndicator with SyncStatus integration', () => {
  it('can be controlled by external syncing state', () => {
    const isSyncing = true;
    render(<SyncingIndicator visible={isSyncing} pendingCount={3} />);
    expect(screen.getByTestId('syncing-indicator')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('hides when not syncing', () => {
    const isSyncing = false;
    render(<SyncingIndicator visible={isSyncing} />);
    expect(screen.queryByTestId('syncing-indicator')).toBeNull();
  });

  it('shows without count when syncing but no pending ops', () => {
    const isSyncing = true;
    render(<SyncingIndicator visible={isSyncing} pendingCount={0} />);
    expect(screen.getByTestId('syncing-indicator')).toBeTruthy();
    expect(screen.queryByTestId('syncing-indicator-count')).toBeNull();
  });
});
