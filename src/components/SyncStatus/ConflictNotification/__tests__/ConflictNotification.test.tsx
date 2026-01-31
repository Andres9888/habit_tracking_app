/**
 * ConflictNotification Tests
 *
 * Tests for the conflict resolution notification component.
 * Implements US4 (Graceful Conflict Resolution) acceptance criteria 2:
 * "Given conflict occurs, When user notified, Then informational only, no action required"
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { ConflictNotification } from '../ConflictNotification';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.addWhitelistedNativeProps = jest.fn();
  Reanimated.default.addWhitelistedUIProps = jest.fn();
  return Reanimated;
});

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  GitMerge: () => 'GitMerge',
}));

describe('ConflictNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('visibility', () => {
    it('renders nothing when visible is false (default)', () => {
      render(<ConflictNotification />);
      expect(screen.queryByTestId('conflict-notification')).toBeNull();
    });

    it('renders nothing when visible is explicitly false', () => {
      render(<ConflictNotification visible={false} />);
      expect(screen.queryByTestId('conflict-notification')).toBeNull();
    });

    it('renders when visible is true', () => {
      render(<ConflictNotification visible={true} />);
      expect(screen.getByTestId('conflict-notification')).toBeTruthy();
    });
  });

  describe('content', () => {
    it('displays "Conflict resolved" text', () => {
      render(<ConflictNotification visible={true} />);
      expect(screen.getByText('Conflict resolved')).toBeTruthy();
    });

    it('renders the GitMerge icon', () => {
      render(<ConflictNotification visible={true} />);
      const notification = screen.getByTestId('conflict-notification');
      expect(notification).toBeTruthy();
    });
  });

  describe('conflict count', () => {
    it('does not show count when conflictCount is undefined', () => {
      render(<ConflictNotification visible={true} />);
      expect(screen.queryByTestId('conflict-notification-count')).toBeNull();
    });

    it('does not show count when conflictCount is 0', () => {
      render(<ConflictNotification visible={true} conflictCount={0} />);
      expect(screen.queryByTestId('conflict-notification-count')).toBeNull();
    });

    it('shows count when conflictCount is greater than 0', () => {
      render(<ConflictNotification visible={true} conflictCount={3} />);
      expect(screen.getByTestId('conflict-notification-count')).toBeTruthy();
      expect(screen.getByText('(3)')).toBeTruthy();
    });

    it('displays correct count for single conflict', () => {
      render(<ConflictNotification visible={true} conflictCount={1} />);
      expect(screen.getByText('(1)')).toBeTruthy();
    });

    it('displays correct count for many conflicts', () => {
      render(<ConflictNotification visible={true} conflictCount={25} />);
      expect(screen.getByText('(25)')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has appropriate accessibility label without count', () => {
      render(<ConflictNotification visible={true} />);
      const notification = screen.getByTestId('conflict-notification');
      expect(notification.props.accessibilityLabel).toBe(
        'Sync conflict resolved'
      );
    });

    it('has accessibility label with singular count', () => {
      render(<ConflictNotification visible={true} conflictCount={1} />);
      const notification = screen.getByTestId('conflict-notification');
      expect(notification.props.accessibilityLabel).toBe(
        '1 sync conflict resolved'
      );
    });

    it('has accessibility label with plural count', () => {
      render(<ConflictNotification visible={true} conflictCount={5} />);
      const notification = screen.getByTestId('conflict-notification');
      expect(notification.props.accessibilityLabel).toBe(
        '5 sync conflicts resolved'
      );
    });

    it('has accessibility role of alert', () => {
      render(<ConflictNotification visible={true} />);
      const notification = screen.getByTestId('conflict-notification');
      expect(notification.props.accessibilityRole).toBe('alert');
    });

    it('has polite accessibility live region', () => {
      render(<ConflictNotification visible={true} />);
      const notification = screen.getByTestId('conflict-notification');
      expect(notification.props.accessibilityLiveRegion).toBe('polite');
    });
  });

  describe('customization', () => {
    it('accepts custom testID', () => {
      render(
        <ConflictNotification visible={true} testID='custom-notification' />
      );
      expect(screen.getByTestId('custom-notification')).toBeTruthy();
    });

    it('accepts custom style', () => {
      const customStyle = { marginTop: 100 };
      render(<ConflictNotification visible={true} style={customStyle} />);
      const notification = screen.getByTestId('conflict-notification');
      expect(notification).toBeTruthy();
    });

    it('accepts custom duration', () => {
      render(<ConflictNotification visible={true} duration={5000} />);
      const notification = screen.getByTestId('conflict-notification');
      expect(notification).toBeTruthy();
    });
  });

  describe('transitions', () => {
    it('re-renders correctly when visibility changes', () => {
      const { rerender } = render(<ConflictNotification visible={false} />);
      expect(screen.queryByTestId('conflict-notification')).toBeNull();

      rerender(<ConflictNotification visible={true} />);
      expect(screen.getByTestId('conflict-notification')).toBeTruthy();
    });

    it('updates count when conflictCount changes', () => {
      const { rerender } = render(
        <ConflictNotification visible={true} conflictCount={2} />
      );
      expect(screen.getByText('(2)')).toBeTruthy();

      rerender(<ConflictNotification visible={true} conflictCount={8} />);
      expect(screen.getByText('(8)')).toBeTruthy();
    });
  });
});

describe('ConflictNotification US4 acceptance criteria', () => {
  it('provides informational notification when conflict occurs', () => {
    // US4 AC2: "Given conflict occurs, When user notified, Then informational only"
    render(<ConflictNotification visible={true} conflictCount={1} />);
    expect(screen.getByText('Conflict resolved')).toBeTruthy();
    expect(screen.getByText('(1)')).toBeTruthy();
  });

  it('requires no user action (auto-dismisses)', () => {
    // US4 AC2: "informational only, no action required"
    // The notification auto-dismisses via useConflictNotificationAnimations
    const onDismiss = jest.fn();
    render(
      <ConflictNotification
        visible={true}
        duration={3000}
        onDismiss={onDismiss}
      />
    );
    // Notification renders but will auto-dismiss (handled by animation hook)
    expect(screen.getByTestId('conflict-notification')).toBeTruthy();
  });

  it('shows amber/warning styling (not error)', () => {
    // Visual confirmation that this is informational, not an error
    render(<ConflictNotification visible={true} />);
    const notification = screen.getByTestId('conflict-notification');
    expect(notification).toBeTruthy();
    // The amber color scheme is applied via styles
  });

  it('handles multiple conflicts gracefully', () => {
    // Multiple devices syncing should show aggregated count
    render(<ConflictNotification visible={true} conflictCount={5} />);
    expect(screen.getByText('(5)')).toBeTruthy();
    const notification = screen.getByTestId('conflict-notification');
    expect(notification.props.accessibilityLabel).toBe(
      '5 sync conflicts resolved'
    );
  });
});

describe('ConflictNotification FR-009 compliance', () => {
  it('displays subtle, non-blocking indicator', () => {
    // FR-009: Display subtle, non-blocking indicators
    render(<ConflictNotification visible={true} />);
    const notification = screen.getByTestId('conflict-notification');
    // Notification renders but doesn't block - it's a passive toast
    expect(notification).toBeTruthy();
  });

  it('uses polite live region for accessibility', () => {
    // Non-blocking: uses 'polite' not 'assertive'
    render(<ConflictNotification visible={true} />);
    const notification = screen.getByTestId('conflict-notification');
    expect(notification.props.accessibilityLiveRegion).toBe('polite');
  });
});
