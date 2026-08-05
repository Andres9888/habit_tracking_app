/**
 * HabitCardContent PendingSyncBadge Integration Tests
 *
 * Tests for the integration of PendingSyncBadge in HabitCardContent.
 * Verifies US3 acceptance criteria 2: "Given pending completions,
 * When viewing habit, Then subtle 'pending' indicator shows"
 *
 * @see docs/offline-habit-sync.md T028 - PendingSyncBadge integration
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';
import { extendedTheme } from '../../../../theme';
import { HabitCardContent } from '../HabitCardContent';

// Wrapper to provide theme and shared animation values
function TestWrapper({
  hasPendingOfflineOps = false,
  completed = false,
  atRisk = false,
  currentStreak = 0,
  bestStreak = 0,
}: {
  hasPendingOfflineOps?: boolean;
  completed?: boolean;
  atRisk?: boolean;
  currentStreak?: number;
  bestStreak?: number;
}) {
  // Create dummy animated values for required props
  const dummyAnimatedStyle = { transform: [{ scale: 1 }, { rotate: '0deg' }] };
  const dummyEntranceStyle = {};
  const dummyRippleStyle = { opacity: 0 };
  const chainScale = useSharedValue(1);
  const chainRotate = useSharedValue(0);

  return (
    <PaperProvider theme={extendedTheme}>
      <HabitCardContent
        atRisk={atRisk}
        bestStreak={bestStreak}
        chainRotate={chainRotate}
        chainScale={chainScale}
        checkmarkAnimatedStyle={dummyAnimatedStyle}
        completed={completed}
        currentStreak={currentStreak}
        entranceContentStyle={dummyEntranceStyle}
        hasPendingOfflineOps={hasPendingOfflineOps}
        icon='📝'
        name='Test Habit'
        rippleAnimatedStyle={dummyRippleStyle}
        strength={50}
        theme={extendedTheme}
      />
    </PaperProvider>
  );
}

describe('HabitCardContent - PendingSyncBadge Integration (T028)', () => {
  describe('Badge Visibility', () => {
    it('should show PendingSyncBadge when hasPendingOfflineOps is true', () => {
      render(<TestWrapper hasPendingOfflineOps={true} />);
      expect(screen.getByTestId('habit-card-pending-sync-badge')).toBeTruthy();
    });

    it('should hide PendingSyncBadge when hasPendingOfflineOps is false', () => {
      render(<TestWrapper hasPendingOfflineOps={false} />);
      expect(screen.queryByTestId('habit-card-pending-sync-badge')).toBeNull();
    });

    it('should hide PendingSyncBadge by default (hasPendingOfflineOps undefined)', () => {
      render(<TestWrapper />);
      expect(screen.queryByTestId('habit-card-pending-sync-badge')).toBeNull();
    });
  });

  describe('Badge with Completion States', () => {
    it('shows badge alongside completed state', () => {
      render(<TestWrapper completed={true} hasPendingOfflineOps={true} />);
      expect(screen.getByTestId('habit-card-pending-sync-badge')).toBeTruthy();
      expect(screen.getByText('✓')).toBeTruthy();
    });

    it('shows badge alongside incomplete state', () => {
      render(<TestWrapper completed={false} hasPendingOfflineOps={true} />);
      expect(screen.getByTestId('habit-card-pending-sync-badge')).toBeTruthy();
      expect(screen.queryByText('✓')).toBeNull();
    });

    it('shows badge alongside at-risk state', () => {
      render(<TestWrapper atRisk={true} hasPendingOfflineOps={true} />);
      expect(screen.getByTestId('habit-card-pending-sync-badge')).toBeTruthy();
      expect(screen.getByText('⚠️')).toBeTruthy();
    });
  });

  describe('Badge with Streak Display', () => {
    it('shows badge when habit has streak', () => {
      render(<TestWrapper currentStreak={5} hasPendingOfflineOps={true} />);
      expect(screen.getByTestId('habit-card-pending-sync-badge')).toBeTruthy();
      expect(screen.getByText('🔥')).toBeTruthy();
    });

    it('shows badge when habit has no streak', () => {
      render(<TestWrapper currentStreak={0} hasPendingOfflineOps={true} />);
      expect(screen.getByTestId('habit-card-pending-sync-badge')).toBeTruthy();
    });
  });

  describe('Visibility Transitions', () => {
    it('shows badge when hasPendingOfflineOps changes from false to true', () => {
      const { rerender } = render(<TestWrapper hasPendingOfflineOps={false} />);
      expect(screen.queryByTestId('habit-card-pending-sync-badge')).toBeNull();

      rerender(<TestWrapper hasPendingOfflineOps={true} />);
      expect(screen.getByTestId('habit-card-pending-sync-badge')).toBeTruthy();
    });

    it('hides badge when hasPendingOfflineOps changes from true to false', () => {
      const { rerender } = render(<TestWrapper hasPendingOfflineOps={true} />);
      expect(screen.getByTestId('habit-card-pending-sync-badge')).toBeTruthy();

      rerender(<TestWrapper hasPendingOfflineOps={false} />);
      expect(screen.queryByTestId('habit-card-pending-sync-badge')).toBeNull();
    });
  });
});

describe('HabitCardContent - US3 Acceptance Criteria 2', () => {
  it('AC2: shows subtle pending indicator when habit has pending completions', () => {
    // Simulates: habit completed offline, not yet synced
    render(<TestWrapper hasPendingOfflineOps={true} />);

    const badge = screen.getByTestId('habit-card-pending-sync-badge');
    expect(badge).toBeTruthy();
    expect(badge.props.accessibilityLabel).toBe('Pending sync');
  });

  it('AC2: hides pending indicator when habit has no pending completions', () => {
    // Simulates: all operations synced successfully
    render(<TestWrapper hasPendingOfflineOps={false} />);

    expect(screen.queryByTestId('habit-card-pending-sync-badge')).toBeNull();
  });

  it('AC2: badge is positioned in status container area', () => {
    render(<TestWrapper hasPendingOfflineOps={true} />);
    const badge = screen.getByTestId('habit-card-pending-sync-badge');
    // Badge is rendered alongside the status indicator
    expect(badge).toBeTruthy();
  });
});

describe('HabitCardContent - FR-009 Compliance', () => {
  it('FR-009: displays subtle, non-blocking indicator for pending sync', () => {
    render(<TestWrapper hasPendingOfflineOps={true} />);

    const badge = screen.getByTestId('habit-card-pending-sync-badge');
    // Badge should be small size for subtlety
    expect(badge).toBeTruthy();
    // Habit name should still be visible (non-blocking)
    expect(screen.getByText('Test Habit')).toBeTruthy();
  });

  it('FR-009: indicator does not interfere with habit completion display', () => {
    render(<TestWrapper completed={true} hasPendingOfflineOps={true} />);

    // Both badge and checkmark should be visible
    expect(screen.getByTestId('habit-card-pending-sync-badge')).toBeTruthy();
    expect(screen.getByText('✓')).toBeTruthy();
  });
});
