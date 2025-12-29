/**
 * Theme Picker Integration Tests
 *
 * Tests the integration of ThemePickerSheet with CollapsibleCalendar and CalendarHeatmap.
 * Covers:
 * - Theme button rendering and visibility
 * - Theme picker modal opening/closing
 * - Theme selection persistence through GridThemeContext
 * - AsyncStorage integration
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CollapsibleCalendar } from '../CollapsibleCalendar';
import { CalendarHeatmap } from '../CalendarHeatmap';
import { GridThemeProvider } from '../GridThemeContext';
import { GRID_THEMES, type GridThemeName } from '../types';
import type { Id } from '../../../../convex/_generated/dataModel';

// Mock AsyncStorage
const mockAsyncStorage = {
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
};

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock haptics
const mockTriggerSelection = jest.fn();
const mockTriggerLightImpact = jest.fn();
jest.mock('../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerSelection: mockTriggerSelection,
    triggerLightImpact: mockTriggerLightImpact,
    triggerMediumImpact: jest.fn(),
    triggerHeavyImpact: jest.fn(),
    triggerWarning: jest.fn(),
    triggerSuccess: jest.fn(),
    triggerError: jest.fn(),
  }),
  useHapticFeedback: () => ({
    triggerSelection: mockTriggerSelection,
    triggerLightImpact: mockTriggerLightImpact,
    triggerMediumImpact: jest.fn(),
    triggerHeavyImpact: jest.fn(),
    triggerWarning: jest.fn(),
    triggerSuccess: jest.fn(),
    triggerError: jest.fn(),
  }),
}));

// Mock reduce motion hook
let mockReduceMotion = false;
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: () => mockReduceMotion,
}));

// Mock reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.FadeIn = {
    duration: () => ({
      springify: () => ({}),
    }),
  };
  Reanimated.FadeInDown = {
    delay: () => ({
      springify: () => ({}),
    }),
  };
  Reanimated.FadeOut = {};
  return Reanimated;
});

// Mock calendar collapse preferences
jest.mock('../../../utils/calendarCollapsePreferences', () => ({
  getCalendarExpandedState: jest.fn().mockResolvedValue(true),
  setCalendarExpandedState: jest.fn().mockResolvedValue(undefined),
}));

// Mock insight card preferences
jest.mock('../../../utils/insightCardPreferences', () => ({
  isInsightDismissed: jest.fn().mockResolvedValue(false),
  dismissInsight: jest.fn().mockResolvedValue(undefined),
}));

describe('Theme Picker Integration', () => {
  const mockHabitId = 'habit123' as Id<'habits'>;
  const mockCompletedDates = new Set(['2024-01-15', '2024-01-16', '2024-01-17']);
  // Use noon UTC to avoid timezone boundary issues where local date differs from UTC
  const mockHabitCreatedAt = new Date('2024-01-01T12:00:00Z').getTime();

  beforeEach(() => {
    jest.clearAllMocks();
    mockReduceMotion = false;
    mockAsyncStorage.getItem.mockResolvedValue(null);
  });

  describe('CalendarHeatmap Theme Button', () => {
    it('should render theme button when showThemeButton is true and onThemePress provided', () => {
      const onThemePress = jest.fn();
      const { getByTestId } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={mockCompletedDates}
          habitCreatedAt={mockHabitCreatedAt}
          showThemeButton={true}
          onThemePress={onThemePress}
        />
      );

      expect(getByTestId('theme-picker-button')).toBeTruthy();
    });

    it('should not render theme button when showThemeButton is false', () => {
      const onThemePress = jest.fn();
      const { queryByTestId } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={mockCompletedDates}
          habitCreatedAt={mockHabitCreatedAt}
          showThemeButton={false}
          onThemePress={onThemePress}
        />
      );

      expect(queryByTestId('theme-picker-button')).toBeNull();
    });

    it('should not render theme button when onThemePress is not provided', () => {
      const { queryByTestId } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={mockCompletedDates}
          habitCreatedAt={mockHabitCreatedAt}
          showThemeButton={true}
        />
      );

      expect(queryByTestId('theme-picker-button')).toBeNull();
    });

    it('should call onThemePress and trigger haptic when theme button is pressed', () => {
      const onThemePress = jest.fn();
      const { getByTestId } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={mockCompletedDates}
          habitCreatedAt={mockHabitCreatedAt}
          showThemeButton={true}
          onThemePress={onThemePress}
        />
      );

      const themeButton = getByTestId('theme-picker-button');
      fireEvent.press(themeButton);

      expect(onThemePress).toHaveBeenCalled();
      expect(mockTriggerLightImpact).toHaveBeenCalled();
    });

    it('should have correct accessibility properties on theme button', () => {
      const onThemePress = jest.fn();
      const { getByTestId } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={mockCompletedDates}
          habitCreatedAt={mockHabitCreatedAt}
          showThemeButton={true}
          onThemePress={onThemePress}
        />
      );

      const themeButton = getByTestId('theme-picker-button');
      expect(themeButton.props.accessibilityRole).toBe('button');
      expect(themeButton.props.accessibilityLabel).toBe('Choose calendar theme');
      expect(themeButton.props.accessibilityHint).toContain('theme selection');
    });
  });

  describe('CollapsibleCalendar Theme Integration', () => {
    it('should render with GridThemeProvider', async () => {
      const { getByText } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={mockCompletedDates}
          habitCreatedAt={mockHabitCreatedAt}
          defaultExpanded={true}
        />
      );

      await waitFor(() => {
        expect(getByText('Calendar View')).toBeTruthy();
      });
    });

    it('should show theme button by default when expanded', async () => {
      const { getByTestId } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={mockCompletedDates}
          habitCreatedAt={mockHabitCreatedAt}
          defaultExpanded={true}
        />
      );

      await waitFor(() => {
        expect(getByTestId('theme-picker-button')).toBeTruthy();
      });
    });

    it('should hide theme button when showThemeButton is false', async () => {
      const { queryByTestId, getByText } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={mockCompletedDates}
          habitCreatedAt={mockHabitCreatedAt}
          defaultExpanded={true}
          showThemeButton={false}
        />
      );

      await waitFor(() => {
        expect(getByText('Calendar View')).toBeTruthy();
      });

      expect(queryByTestId('theme-picker-button')).toBeNull();
    });

    it('should open theme picker when theme button is pressed', async () => {
      const { getByTestId, getByText } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={mockCompletedDates}
          habitCreatedAt={mockHabitCreatedAt}
          defaultExpanded={true}
        />
      );

      await waitFor(() => {
        expect(getByTestId('theme-picker-button')).toBeTruthy();
      });

      const themeButton = getByTestId('theme-picker-button');
      fireEvent.press(themeButton);

      await waitFor(() => {
        expect(getByText('Choose Theme')).toBeTruthy();
      });
    });

    it('should close theme picker when close button is pressed', async () => {
      const { getByTestId, getByText, getByLabelText, queryByText } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={mockCompletedDates}
          habitCreatedAt={mockHabitCreatedAt}
          defaultExpanded={true}
        />
      );

      await waitFor(() => {
        expect(getByTestId('theme-picker-button')).toBeTruthy();
      });

      // Open theme picker
      fireEvent.press(getByTestId('theme-picker-button'));

      await waitFor(() => {
        expect(getByText('Choose Theme')).toBeTruthy();
      });

      // Close theme picker
      const closeButton = getByLabelText('Close theme picker');
      fireEvent.press(closeButton);

      await waitFor(() => {
        expect(queryByText('Choose Theme')).toBeNull();
      });
    });

    it('should close theme picker after selecting a theme', async () => {
      const { getByTestId, getByText, getByRole, queryByText } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={mockCompletedDates}
          habitCreatedAt={mockHabitCreatedAt}
          defaultExpanded={true}
        />
      );

      await waitFor(() => {
        expect(getByTestId('theme-picker-button')).toBeTruthy();
      });

      // Open theme picker
      fireEvent.press(getByTestId('theme-picker-button'));

      await waitFor(() => {
        expect(getByText('Choose Theme')).toBeTruthy();
      });

      // Select Tiles theme
      const tilesOption = getByRole('radio', { name: /Tiles theme/i });
      fireEvent.press(tilesOption);

      await waitFor(() => {
        expect(queryByText('Choose Theme')).toBeNull();
      });
    });
  });

  describe('Theme Persistence', () => {
    it('should save theme selection to AsyncStorage', async () => {
      const { getByTestId, getByText, getByRole } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={mockCompletedDates}
          habitCreatedAt={mockHabitCreatedAt}
          defaultExpanded={true}
        />
      );

      await waitFor(() => {
        expect(getByTestId('theme-picker-button')).toBeTruthy();
      });

      // Open theme picker
      fireEvent.press(getByTestId('theme-picker-button'));

      await waitFor(() => {
        expect(getByText('Choose Theme')).toBeTruthy();
      });

      // Select Dots theme
      const dotsOption = getByRole('radio', { name: /Dots theme/i });
      fireEvent.press(dotsOption);

      await waitFor(() => {
        expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
          '@habit_app:grid_theme_selection',
          'dots'
        );
      });
    });

    it('should load saved theme on mount', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('tiles');

      const { getByTestId, getByText, getByRole } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={mockCompletedDates}
          habitCreatedAt={mockHabitCreatedAt}
          defaultExpanded={true}
        />
      );

      await waitFor(() => {
        expect(getByTestId('theme-picker-button')).toBeTruthy();
      });

      // Open theme picker
      fireEvent.press(getByTestId('theme-picker-button'));

      await waitFor(() => {
        expect(getByText('Choose Theme')).toBeTruthy();
      });

      // Tiles should be selected
      const tilesOption = getByRole('radio', { name: /Tiles theme/i });
      expect(tilesOption.props.accessibilityState.selected).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should announce theme selection', async () => {
      const mockAnnounce = jest.fn();
      jest.spyOn(require('react-native').AccessibilityInfo, 'announceForAccessibility')
        .mockImplementation(mockAnnounce);

      const { getByTestId, getByText, getByRole } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={mockCompletedDates}
          habitCreatedAt={mockHabitCreatedAt}
          defaultExpanded={true}
        />
      );

      await waitFor(() => {
        expect(getByTestId('theme-picker-button')).toBeTruthy();
      });

      // Open theme picker
      fireEvent.press(getByTestId('theme-picker-button'));

      await waitFor(() => {
        expect(getByText('Choose Theme')).toBeTruthy();
      });

      // Select Pixels theme
      const pixelsOption = getByRole('radio', { name: /Pixels theme/i });
      fireEvent.press(pixelsOption);

      await waitFor(() => {
        expect(mockAnnounce).toHaveBeenCalledWith('Pixels theme selected');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle theme picker when calendar is collapsed', async () => {
      const { getByTestId, queryByTestId } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={mockCompletedDates}
          habitCreatedAt={mockHabitCreatedAt}
          defaultExpanded={false}
        />
      );

      await waitFor(() => {
        expect(getByTestId('collapsible-calendar-header')).toBeTruthy();
      });

      // Theme button should not be visible when collapsed
      // (it's inside the CalendarHeatmap which is hidden when collapsed)
      expect(queryByTestId('theme-picker-button')).toBeNull();
    });

    it('should handle rapid theme changes', async () => {
      const { getByTestId, getByText, getByRole } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={mockCompletedDates}
          habitCreatedAt={mockHabitCreatedAt}
          defaultExpanded={true}
        />
      );

      await waitFor(() => {
        expect(getByTestId('theme-picker-button')).toBeTruthy();
      });

      // Open theme picker
      fireEvent.press(getByTestId('theme-picker-button'));

      await waitFor(() => {
        expect(getByText('Choose Theme')).toBeTruthy();
      });

      // Rapidly select themes (first selection closes modal)
      const tilesOption = getByRole('radio', { name: /Tiles theme/i });
      fireEvent.press(tilesOption);

      await waitFor(() => {
        expect(mockAsyncStorage.setItem).toHaveBeenLastCalledWith(
          '@habit_app:grid_theme_selection',
          'tiles'
        );
      });
    });
  });
});
