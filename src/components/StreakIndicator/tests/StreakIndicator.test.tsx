/**
 * StreakIndicator Component Tests (Story 1.4)
 * Tests for streak visualization with milestone badges
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { StreakIndicator } from '../StreakIndicator';

describe('StreakIndicator', () => {
  describe('Compact View', () => {
    it('should render fire emoji and streak number for active streak', () => {
      const { getByText, getByA11yLabel } = render(
        <StreakIndicator compact bestStreak={10} currentStreak={5} />
      );

      expect(getByText('🔥')).toBeTruthy();
      expect(getByText('5')).toBeTruthy();
      expect(getByA11yLabel('5-day streak, best 10 days')).toBeTruthy();
    });

    it('should show "Start your streak!" message for zero streak', () => {
      const { getByText } = render(
        <StreakIndicator compact bestStreak={0} currentStreak={0} />
      );

      expect(getByText('Start your streak!')).toBeTruthy();
      expect(getByText('🔥')).toBeTruthy();
    });

    it('should display star badge for 7-day milestone', () => {
      const { getByText } = render(
        <StreakIndicator compact bestStreak={7} currentStreak={7} />
      );

      expect(getByText('⭐')).toBeTruthy();
      expect(getByText('7')).toBeTruthy();
    });

    it('should display trophy badge for 30-day milestone', () => {
      const { getByText } = render(
        <StreakIndicator compact bestStreak={30} currentStreak={30} />
      );

      expect(getByText('🏆')).toBeTruthy();
      expect(getByText('30')).toBeTruthy();
    });

    it('should display diamond badge for 100-day milestone', () => {
      const { getByText } = render(
        <StreakIndicator compact bestStreak={100} currentStreak={100} />
      );

      expect(getByText('💎')).toBeTruthy();
      expect(getByText('100')).toBeTruthy();
    });

    it('should show highest milestone badge only', () => {
      const { getByText, queryByText } = render(
        <StreakIndicator compact bestStreak={50} currentStreak={35} />
      );

      // Should show trophy (30-day) but not star (7-day)
      expect(getByText('🏆')).toBeTruthy();
      expect(queryByText('⭐')).toBeNull();
      expect(getByText('35')).toBeTruthy();
    });

    it('should show no badge below 7 days', () => {
      const { getByText, queryByText } = render(
        <StreakIndicator compact bestStreak={6} currentStreak={6} />
      );

      expect(getByText('🔥')).toBeTruthy();
      expect(getByText('6')).toBeTruthy();
      expect(queryByText('⭐')).toBeNull();
      expect(queryByText('🏆')).toBeNull();
      expect(queryByText('💎')).toBeNull();
    });
  });

  describe('Full View', () => {
    it('should render current streak label and number', () => {
      const { getByText } = render(
        <StreakIndicator bestStreak={20} compact={false} currentStreak={15} />
      );

      expect(getByText('15')).toBeTruthy();
      expect(getByText('Current Streak')).toBeTruthy();
    });

    it('should display best streak in compact format', () => {
      const { getByText } = render(
        <StreakIndicator bestStreak={45} compact={false} currentStreak={10} />
      );

      expect(getByText('Best: 45 days')).toBeTruthy();
    });

    it('should show singular "day" for best streak of 1', () => {
      const { getByText } = render(
        <StreakIndicator bestStreak={1} compact={false} currentStreak={1} />
      );

      expect(getByText('Best: 1 day')).toBeTruthy();
    });

    it('should hide best streak if zero', () => {
      const { queryByText } = render(
        <StreakIndicator bestStreak={0} compact={false} currentStreak={0} />
      );

      expect(queryByText(/Best:/)).toBeNull();
    });

    it('should display milestone badges legend', () => {
      const { getByText } = render(
        <StreakIndicator bestStreak={20} compact={false} currentStreak={15} />
      );

      // Should show all milestone badges in legend
      expect(getByText('⭐')).toBeTruthy();
      expect(getByText('🏆')).toBeTruthy();
      expect(getByText('💎')).toBeTruthy();
      expect(getByText('7')).toBeTruthy();
      expect(getByText('30')).toBeTruthy();
      expect(getByText('100')).toBeTruthy();
    });

    it('should highlight achieved milestones in legend', () => {
      const { getAllByText } = render(
        <StreakIndicator bestStreak={50} compact={false} currentStreak={35} />
      );

      // All three milestone badges should be present in legend
      // (visual highlighting is tested through styles, here we just confirm presence)
      expect(getAllByText('⭐').length).toBeGreaterThan(0);
      expect(getAllByText('🏆').length).toBeGreaterThan(0);
      expect(getAllByText('💎').length).toBeGreaterThan(0);
    });

    it('should hide milestone legend when streak is zero', () => {
      const { queryByText } = render(
        <StreakIndicator bestStreak={0} compact={false} currentStreak={0} />
      );

      // Milestone badges should not appear
      expect(queryByText('⭐')).toBeNull();
      expect(queryByText('🏆')).toBeNull();
      expect(queryByText('💎')).toBeNull();
    });
  });

  describe('Milestone Animation', () => {
    it('should call onMilestone callback when milestone is reached', () => {
      const onMilestone = jest.fn();

      render(
        <StreakIndicator
          compact
          bestStreak={7}
          currentStreak={7}
          onMilestone={onMilestone}
        />
      );

      expect(onMilestone).toHaveBeenCalledWith(7);
    });

    it('should call onMilestone for 30-day milestone', () => {
      const onMilestone = jest.fn();

      render(
        <StreakIndicator
          compact
          bestStreak={30}
          currentStreak={30}
          onMilestone={onMilestone}
        />
      );

      expect(onMilestone).toHaveBeenCalledWith(30);
    });

    it('should call onMilestone for 100-day milestone', () => {
      const onMilestone = jest.fn();

      render(
        <StreakIndicator
          compact
          bestStreak={100}
          currentStreak={100}
          onMilestone={onMilestone}
        />
      );

      expect(onMilestone).toHaveBeenCalledWith(100);
    });

    it('should not call onMilestone below first milestone', () => {
      const onMilestone = jest.fn();

      render(
        <StreakIndicator
          compact
          bestStreak={6}
          currentStreak={6}
          onMilestone={onMilestone}
        />
      );

      expect(onMilestone).not.toHaveBeenCalled();
    });

    it('should call onMilestone with highest milestone only', () => {
      const onMilestone = jest.fn();

      render(
        <StreakIndicator
          compact
          bestStreak={50}
          currentStreak={35}
          onMilestone={onMilestone}
        />
      );

      // Should be called with 30 (highest achieved), not 7
      expect(onMilestone).toHaveBeenCalledWith(30);
      expect(onMilestone).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility label for compact view', () => {
      const { getByA11yLabel } = render(
        <StreakIndicator compact bestStreak={45} currentStreak={12} />
      );

      expect(getByA11yLabel('12-day streak, best 45 days')).toBeTruthy();
    });

    it('should include milestone in accessibility label', () => {
      const { getByA11yLabel } = render(
        <StreakIndicator compact bestStreak={30} currentStreak={30} />
      );

      expect(
        getByA11yLabel('30-day streak, best 30 days, 30-Day Streak achieved')
      ).toBeTruthy();
    });

    it('should support custom accessibility label', () => {
      const { getByA11yLabel } = render(
        <StreakIndicator
          compact
          accessibilityLabel='Custom label for meditation'
          bestStreak={10}
          currentStreak={5}
        />
      );

      expect(getByA11yLabel('Custom label for meditation')).toBeTruthy();
    });

    it('should have text accessibility role in compact view', () => {
      const { getByA11yRole } = render(
        <StreakIndicator compact bestStreak={10} currentStreak={5} />
      );

      expect(getByA11yRole('text')).toBeTruthy();
    });

    it('should have text accessibility role in full view', () => {
      const { getByA11yRole } = render(
        <StreakIndicator bestStreak={10} compact={false} currentStreak={5} />
      );

      expect(getByA11yRole('text')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero streak gracefully', () => {
      const { getByText } = render(
        <StreakIndicator compact bestStreak={0} currentStreak={0} />
      );

      expect(getByText('Start your streak!')).toBeTruthy();
    });

    it('should handle very large streaks (999+)', () => {
      const { getByText } = render(
        <StreakIndicator compact bestStreak={999} currentStreak={999} />
      );

      expect(getByText('999')).toBeTruthy();
      expect(getByText('💎')).toBeTruthy();
    });

    it('should handle current streak less than best streak', () => {
      const { getByText } = render(
        <StreakIndicator bestStreak={50} compact={false} currentStreak={10} />
      );

      expect(getByText('10')).toBeTruthy();
      expect(getByText('Best: 50 days')).toBeTruthy();
    });

    it('should show star badge when current exceeds 7 but not best', () => {
      const { getByText } = render(
        <StreakIndicator compact bestStreak={2} currentStreak={10} />
      );

      expect(getByText('⭐')).toBeTruthy();
      expect(getByText('10')).toBeTruthy();
    });

    it('should handle milestone exactly at boundary', () => {
      const { getByText } = render(
        <StreakIndicator compact bestStreak={7} currentStreak={7} />
      );

      expect(getByText('⭐')).toBeTruthy();
      expect(getByText('7')).toBeTruthy();
    });

    it('should handle streak just below milestone', () => {
      const { getByText, queryByText } = render(
        <StreakIndicator compact bestStreak={29} currentStreak={29} />
      );

      expect(getByText('⭐')).toBeTruthy();
      expect(queryByText('🏆')).toBeNull(); // Not yet at 30
    });

    it('should handle streak between milestones', () => {
      const { getByText, queryByText } = render(
        <StreakIndicator compact bestStreak={50} currentStreak={50} />
      );

      expect(getByText('🏆')).toBeTruthy(); // Has 30
      expect(queryByText('💎')).toBeNull(); // Not yet at 100
      expect(getByText('50')).toBeTruthy();
    });
  });

  describe('Visual States', () => {
    it('should render without errors in compact mode', () => {
      const { container } = render(
        <StreakIndicator compact bestStreak={10} currentStreak={5} />
      );

      expect(container).toBeTruthy();
    });

    it('should render without errors in full mode', () => {
      const { container } = render(
        <StreakIndicator bestStreak={10} compact={false} currentStreak={5} />
      );

      expect(container).toBeTruthy();
    });

    it('should handle rapid prop updates', () => {
      const { rerender, getByText } = render(
        <StreakIndicator compact bestStreak={10} currentStreak={5} />
      );

      expect(getByText('5')).toBeTruthy();

      rerender(<StreakIndicator compact bestStreak={15} currentStreak={10} />);

      expect(getByText('10')).toBeTruthy();

      rerender(<StreakIndicator compact bestStreak={20} currentStreak={15} />);

      expect(getByText('15')).toBeTruthy();
    });
  });
});
