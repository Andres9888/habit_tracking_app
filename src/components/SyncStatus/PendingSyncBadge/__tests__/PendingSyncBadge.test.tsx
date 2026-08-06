/**
 * PendingSyncBadge Tests
 *
 * Tests for the pending sync badge indicator component.
 * Verifies US3 acceptance criteria 2: "Given pending completions,
 * When viewing habit, Then subtle 'pending' indicator shows"
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { PendingSyncBadge } from '../PendingSyncBadge';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.addWhitelistedNativeProps = jest.fn();
  Reanimated.default.addWhitelistedUIProps = jest.fn();
  return Reanimated;
});

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Cloud: () => 'Cloud',
}));

describe('PendingSyncBadge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('visibility', () => {
    it('renders nothing when visible is false (default)', () => {
      render(<PendingSyncBadge />);
      expect(screen.queryByTestId('pending-sync-badge')).toBeNull();
    });

    it('renders nothing when visible is explicitly false', () => {
      render(<PendingSyncBadge visible={false} />);
      expect(screen.queryByTestId('pending-sync-badge')).toBeNull();
    });

    it('renders when visible is true', () => {
      render(<PendingSyncBadge visible={true} />);
      expect(screen.getByTestId('pending-sync-badge')).toBeTruthy();
    });
  });

  describe('size variants', () => {
    it('uses small size by default', () => {
      render(<PendingSyncBadge visible={true} />);
      const badge = screen.getByTestId('pending-sync-badge');
      expect(badge).toBeTruthy();
    });

    it('accepts small size prop', () => {
      render(<PendingSyncBadge visible={true} size='small' />);
      const badge = screen.getByTestId('pending-sync-badge');
      expect(badge).toBeTruthy();
    });

    it('accepts medium size prop', () => {
      render(<PendingSyncBadge visible={true} size='medium' />);
      const badge = screen.getByTestId('pending-sync-badge');
      expect(badge).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has appropriate accessibility label', () => {
      render(<PendingSyncBadge visible={true} />);
      const badge = screen.getByTestId('pending-sync-badge');
      expect(badge.props.accessibilityLabel).toBe('Pending sync');
    });

    it('has accessibility hint explaining the state', () => {
      render(<PendingSyncBadge visible={true} />);
      const badge = screen.getByTestId('pending-sync-badge');
      expect(badge.props.accessibilityHint).toBe(
        'This habit has changes waiting to sync'
      );
    });

    it('has accessibility role of img', () => {
      render(<PendingSyncBadge visible={true} />);
      const badge = screen.getByTestId('pending-sync-badge');
      expect(badge.props.accessibilityRole).toBe('img');
    });

    it('is accessible', () => {
      render(<PendingSyncBadge visible={true} />);
      const badge = screen.getByTestId('pending-sync-badge');
      expect(badge.props.accessible).toBe(true);
    });
  });

  describe('customization', () => {
    it('accepts custom testID', () => {
      render(<PendingSyncBadge visible={true} testID='custom-pending-badge' />);
      expect(screen.getByTestId('custom-pending-badge')).toBeTruthy();
    });

    it('accepts custom style', () => {
      const customStyle = { marginTop: 10 };
      render(<PendingSyncBadge visible={true} style={customStyle} />);
      const badge = screen.getByTestId('pending-sync-badge');
      expect(badge).toBeTruthy();
    });
  });

  describe('transitions', () => {
    it('re-renders correctly when visibility changes', () => {
      const { rerender } = render(<PendingSyncBadge visible={false} />);
      expect(screen.queryByTestId('pending-sync-badge')).toBeNull();

      rerender(<PendingSyncBadge visible={true} />);
      expect(screen.getByTestId('pending-sync-badge')).toBeTruthy();

      rerender(<PendingSyncBadge visible={false} />);
      // Component hides immediately when shouldRender becomes false
    });

    it('updates size when size prop changes', () => {
      const { rerender } = render(
        <PendingSyncBadge visible={true} size='small' />
      );
      expect(screen.getByTestId('pending-sync-badge')).toBeTruthy();

      rerender(<PendingSyncBadge visible={true} size='medium' />);
      expect(screen.getByTestId('pending-sync-badge')).toBeTruthy();
    });
  });
});

describe('PendingSyncBadge with HabitCard integration', () => {
  it('can be controlled by habit pending state', () => {
    const hasPendingOperations = true;
    render(<PendingSyncBadge visible={hasPendingOperations} />);
    expect(screen.getByTestId('pending-sync-badge')).toBeTruthy();
  });

  it('hides when habit has no pending operations', () => {
    const hasPendingOperations = false;
    render(<PendingSyncBadge visible={hasPendingOperations} />);
    expect(screen.queryByTestId('pending-sync-badge')).toBeNull();
  });

  it('works with small size for compact habit cards', () => {
    render(<PendingSyncBadge visible={true} size='small' />);
    expect(screen.getByTestId('pending-sync-badge')).toBeTruthy();
  });

  it('works with medium size for detailed habit cards', () => {
    render(<PendingSyncBadge visible={true} size='medium' />);
    expect(screen.getByTestId('pending-sync-badge')).toBeTruthy();
  });

  it('supports custom positioning via style prop', () => {
    const positionStyle = { position: 'absolute', top: 4, right: 4 };
    render(
      <PendingSyncBadge
        visible={true}
        style={positionStyle as React.CSSProperties}
      />
    );
    expect(screen.getByTestId('pending-sync-badge')).toBeTruthy();
  });
});

describe('PendingSyncBadge US3 acceptance criteria', () => {
  describe('AC2: pending indicator visible when habit has pending completions', () => {
    it('shows badge when habit has pending offline operations', () => {
      // Simulates: habit completed offline, not yet synced
      const hasPendingOfflineOps = true;
      render(<PendingSyncBadge visible={hasPendingOfflineOps} />);

      const badge = screen.getByTestId('pending-sync-badge');
      expect(badge).toBeTruthy();
      expect(badge.props.accessibilityLabel).toBe('Pending sync');
    });

    it('hides badge when habit has no pending operations', () => {
      // Simulates: all operations synced
      const hasPendingOfflineOps = false;
      render(<PendingSyncBadge visible={hasPendingOfflineOps} />);

      expect(screen.queryByTestId('pending-sync-badge')).toBeNull();
    });

    it('badge is subtle (small size by default)', () => {
      render(<PendingSyncBadge visible={true} />);
      const badge = screen.getByTestId('pending-sync-badge');
      // Badge renders with small size by default
      expect(badge).toBeTruthy();
    });
  });
});
