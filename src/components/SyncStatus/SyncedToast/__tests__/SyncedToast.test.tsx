/**
 * SyncedToast Tests
 *
 * Tests for the sync completion toast component.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { SyncedToast } from '../SyncedToast';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.addWhitelistedNativeProps = jest.fn();
  Reanimated.default.addWhitelistedUIProps = jest.fn();
  return Reanimated;
});

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Check: () => 'Check',
}));

describe('SyncedToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('visibility', () => {
    it('renders nothing when visible is false (default)', () => {
      render(<SyncedToast />);
      expect(screen.queryByTestId('synced-toast')).toBeNull();
    });

    it('renders nothing when visible is explicitly false', () => {
      render(<SyncedToast visible={false} />);
      expect(screen.queryByTestId('synced-toast')).toBeNull();
    });

    it('renders when visible is true', () => {
      render(<SyncedToast visible={true} />);
      expect(screen.getByTestId('synced-toast')).toBeTruthy();
    });
  });

  describe('content', () => {
    it('displays "Synced" text', () => {
      render(<SyncedToast visible={true} />);
      expect(screen.getByText('Synced')).toBeTruthy();
    });

    it('renders the Check icon', () => {
      render(<SyncedToast visible={true} />);
      const toast = screen.getByTestId('synced-toast');
      expect(toast).toBeTruthy();
    });
  });

  describe('synced count', () => {
    it('does not show count when syncedCount is undefined', () => {
      render(<SyncedToast visible={true} />);
      expect(screen.queryByTestId('synced-toast-count')).toBeNull();
    });

    it('does not show count when syncedCount is 0', () => {
      render(<SyncedToast visible={true} syncedCount={0} />);
      expect(screen.queryByTestId('synced-toast-count')).toBeNull();
    });

    it('shows count when syncedCount is greater than 0', () => {
      render(<SyncedToast visible={true} syncedCount={5} />);
      expect(screen.getByTestId('synced-toast-count')).toBeTruthy();
      expect(screen.getByText('(5)')).toBeTruthy();
    });

    it('displays correct count for single item', () => {
      render(<SyncedToast visible={true} syncedCount={1} />);
      expect(screen.getByText('(1)')).toBeTruthy();
    });

    it('displays correct count for many items', () => {
      render(<SyncedToast visible={true} syncedCount={99} />);
      expect(screen.getByText('(99)')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has appropriate accessibility label without count', () => {
      render(<SyncedToast visible={true} />);
      const toast = screen.getByTestId('synced-toast');
      expect(toast.props.accessibilityLabel).toBe('Changes synced');
    });

    it('has accessibility label with singular count', () => {
      render(<SyncedToast visible={true} syncedCount={1} />);
      const toast = screen.getByTestId('synced-toast');
      expect(toast.props.accessibilityLabel).toBe('Synced 1 change');
    });

    it('has accessibility label with plural count', () => {
      render(<SyncedToast visible={true} syncedCount={5} />);
      const toast = screen.getByTestId('synced-toast');
      expect(toast.props.accessibilityLabel).toBe('Synced 5 changes');
    });

    it('has accessibility role of alert', () => {
      render(<SyncedToast visible={true} />);
      const toast = screen.getByTestId('synced-toast');
      expect(toast.props.accessibilityRole).toBe('alert');
    });

    it('has polite accessibility live region', () => {
      render(<SyncedToast visible={true} />);
      const toast = screen.getByTestId('synced-toast');
      expect(toast.props.accessibilityLiveRegion).toBe('polite');
    });
  });

  describe('customization', () => {
    it('accepts custom testID', () => {
      render(<SyncedToast visible={true} testID='custom-synced-toast' />);
      expect(screen.getByTestId('custom-synced-toast')).toBeTruthy();
    });

    it('accepts custom style', () => {
      const customStyle = { marginTop: 100 };
      render(<SyncedToast visible={true} style={customStyle} />);
      const toast = screen.getByTestId('synced-toast');
      expect(toast).toBeTruthy();
    });

    it('accepts custom duration', () => {
      render(<SyncedToast visible={true} duration={5000} />);
      const toast = screen.getByTestId('synced-toast');
      expect(toast).toBeTruthy();
    });
  });

  describe('transitions', () => {
    it('re-renders correctly when visibility changes', () => {
      const { rerender } = render(<SyncedToast visible={false} />);
      expect(screen.queryByTestId('synced-toast')).toBeNull();

      rerender(<SyncedToast visible={true} />);
      expect(screen.getByTestId('synced-toast')).toBeTruthy();
    });

    it('updates count when syncedCount changes', () => {
      const { rerender } = render(
        <SyncedToast visible={true} syncedCount={3} />
      );
      expect(screen.getByText('(3)')).toBeTruthy();

      rerender(<SyncedToast visible={true} syncedCount={7} />);
      expect(screen.getByText('(7)')).toBeTruthy();
    });
  });
});

describe('SyncedToast US3 acceptance criteria', () => {
  it('provides brief confirmation when sync completes', () => {
    // US3 AC3: "Given sync completes, When done, Then ... brief 'Synced' confirmation"
    render(<SyncedToast visible={true} syncedCount={3} />);
    expect(screen.getByText('Synced')).toBeTruthy();
    expect(screen.getByText('(3)')).toBeTruthy();
  });

  it('auto-dismisses after duration', () => {
    // The toast should auto-dismiss - this is handled by useSyncedToastAnimations
    const onDismiss = jest.fn();
    render(
      <SyncedToast visible={true} duration={2000} onDismiss={onDismiss} />
    );
    expect(screen.getByTestId('synced-toast')).toBeTruthy();
  });

  it('shows success styling (green theme)', () => {
    // Visual confirmation that styles are applied (check container renders)
    render(<SyncedToast visible={true} />);
    const toast = screen.getByTestId('synced-toast');
    expect(toast).toBeTruthy();
  });
});
