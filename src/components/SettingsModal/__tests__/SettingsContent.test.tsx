/**
 * Tests for SettingsContent component
 *
 * Covers main settings UI including:
 * - Visual preferences (progress bar, completion icon, day shape)
 * - Habit management (archived habits)
 * - All toggle and navigation interactions
 * - Accessibility
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { SettingsContent } from '../SettingsContent';

// Mock icons
jest.mock('lucide-react-native', () => ({
  Activity: 'Activity',
  BookOpen: 'BookOpen',
  Check: 'Check',
  Circle: 'Circle',
  ChevronRight: 'ChevronRight',
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock Clerk authentication
jest.mock('@clerk/clerk-expo', () => ({
  useClerk: jest.fn(() => ({
    signOut: jest.fn(),
  })),
  useUser: jest.fn(() => ({
    user: {
      primaryEmailAddress: {
        emailAddress: 'test@example.com',
      },
    },
  })),
}));

// Mock AccountSection to avoid deep dependency issues
jest.mock('../AccountSection', () => ({
  AccountSection: () => null,
}));

describe('SettingsContent', () => {
  const defaultColors = {
    background: '#ffffff',
    versionText: '#666666',
  };

  const defaultProps = {
    colors: defaultColors,
    isHighContrastActive: false,
    showWeekCompletionBar: false,
    habitCompletionIcon: 'chain' as const,
    dayShape: 'square' as const,
    onChangeShowWeekCompletionBar: jest.fn(),
    onChangeHabitCompletionIcon: jest.fn(),
    onChangeDayShape: jest.fn(),
    onOpenArchivedHabits: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<SettingsContent {...defaultProps} />);

      expect(getByText('Visual Preferences')).toBeTruthy();
      expect(getByText('Habit Management')).toBeTruthy();
    });

    it('should display all visual preference options', () => {
      const { getByText } = render(<SettingsContent {...defaultProps} />);

      expect(getByText('Daily progress bar')).toBeTruthy();
      expect(getByText('Use checkbox completion icon')).toBeTruthy();
      expect(getByText('Use circles for habit days')).toBeTruthy();
    });

    it('should display habit management section', () => {
      const { getByText } = render(<SettingsContent {...defaultProps} />);

      expect(getByText('Archived Habits')).toBeTruthy();
    });

    it('should display version number in footer', () => {
      const { getByText } = render(<SettingsContent {...defaultProps} />);

      expect(getByText('Chain Day v1.0.0')).toBeTruthy();
    });
  });

  describe('daily progress bar toggle', () => {
    it('should show toggle in off state when showWeekCompletionBar is false', () => {
      const { getByLabelText } = render(<SettingsContent {...defaultProps} />);

      const toggle = getByLabelText('Daily progress bar');
      expect(toggle.props.value).toBe(false);
    });

    it('should show toggle in on state when showWeekCompletionBar is true', () => {
      const { getByLabelText } = render(
        <SettingsContent {...defaultProps} showWeekCompletionBar={true} />
      );

      const toggle = getByLabelText('Daily progress bar');
      expect(toggle.props.value).toBe(true);
    });

    it('should call onChangeShowWeekCompletionBar when toggled on', () => {
      const handleChange = jest.fn();
      const { getByLabelText } = render(
        <SettingsContent
          {...defaultProps}
          onChangeShowWeekCompletionBar={handleChange}
        />
      );

      const toggle = getByLabelText('Daily progress bar');
      fireEvent(toggle, 'valueChange', true);

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should call onChangeShowWeekCompletionBar when toggled off', () => {
      const handleChange = jest.fn();
      const { getByLabelText } = render(
        <SettingsContent
          {...defaultProps}
          showWeekCompletionBar={true}
          onChangeShowWeekCompletionBar={handleChange}
        />
      );

      const toggle = getByLabelText('Daily progress bar');
      fireEvent(toggle, 'valueChange', false);

      expect(handleChange).toHaveBeenCalledWith(false);
    });
  });

  describe('completion icon toggle', () => {
    it('should show toggle off when icon is "chain"', () => {
      const { getByLabelText } = render(
        <SettingsContent {...defaultProps} habitCompletionIcon='chain' />
      );

      const toggle = getByLabelText('Use checkbox completion icon');
      expect(toggle.props.value).toBe(false);
    });

    it('should show toggle on when icon is "checkbox"', () => {
      const { getByLabelText } = render(
        <SettingsContent {...defaultProps} habitCompletionIcon='checkbox' />
      );

      const toggle = getByLabelText('Use checkbox completion icon');
      expect(toggle.props.value).toBe(true);
    });

    it('should call onChangeHabitCompletionIcon with "checkbox" when toggled on', () => {
      const handleChange = jest.fn();
      const { getByLabelText } = render(
        <SettingsContent
          {...defaultProps}
          habitCompletionIcon='chain'
          onChangeHabitCompletionIcon={handleChange}
        />
      );

      const toggle = getByLabelText('Use checkbox completion icon');
      fireEvent(toggle, 'valueChange', true);

      expect(handleChange).toHaveBeenCalledWith('checkbox');
    });

    it('should call onChangeHabitCompletionIcon with "chain" when toggled off', () => {
      const handleChange = jest.fn();
      const { getByLabelText } = render(
        <SettingsContent
          {...defaultProps}
          habitCompletionIcon='checkbox'
          onChangeHabitCompletionIcon={handleChange}
        />
      );

      const toggle = getByLabelText('Use checkbox completion icon');
      fireEvent(toggle, 'valueChange', false);

      expect(handleChange).toHaveBeenCalledWith('chain');
    });
  });

  describe('day shape toggle', () => {
    it('should show toggle off when shape is "square"', () => {
      const { getByLabelText } = render(
        <SettingsContent {...defaultProps} dayShape='square' />
      );

      const toggle = getByLabelText('Use circles for habit days');
      expect(toggle.props.value).toBe(false);
    });

    it('should show toggle on when shape is "circle"', () => {
      const { getByLabelText } = render(
        <SettingsContent {...defaultProps} dayShape='circle' />
      );

      const toggle = getByLabelText('Use circles for habit days');
      expect(toggle.props.value).toBe(true);
    });

    it('should call onChangeDayShape with "circle" when toggled on', () => {
      const handleChange = jest.fn();
      const { getByLabelText } = render(
        <SettingsContent
          {...defaultProps}
          dayShape='square'
          onChangeDayShape={handleChange}
        />
      );

      const toggle = getByLabelText('Use circles for habit days');
      fireEvent(toggle, 'valueChange', true);

      expect(handleChange).toHaveBeenCalledWith('circle');
    });

    it('should call onChangeDayShape with "square" when toggled off', () => {
      const handleChange = jest.fn();
      const { getByLabelText } = render(
        <SettingsContent
          {...defaultProps}
          dayShape='circle'
          onChangeDayShape={handleChange}
        />
      );

      const toggle = getByLabelText('Use circles for habit days');
      fireEvent(toggle, 'valueChange', false);

      expect(handleChange).toHaveBeenCalledWith('square');
    });
  });

  describe('archived habits navigation', () => {
    it('should call onOpenArchivedHabits when row is pressed', () => {
      const handlePress = jest.fn();
      const { getByText } = render(
        <SettingsContent {...defaultProps} onOpenArchivedHabits={handlePress} />
      );

      const archivedHabitsRow = getByText('Archived Habits');
      fireEvent.press(archivedHabitsRow.parent!.parent!);

      expect(handlePress).toHaveBeenCalled();
    });
  });

  describe('high contrast mode', () => {
    it('should render with high contrast flag active', () => {
      const { getByText } = render(
        <SettingsContent {...defaultProps} isHighContrastActive={true} />
      );

      // Should render sections with high contrast mode enabled
      expect(getByText('Visual Preferences')).toBeTruthy();
      expect(getByText('Habit Management')).toBeTruthy();
    });

    it('should render correctly with high contrast disabled', () => {
      const { getByText } = render(
        <SettingsContent {...defaultProps} isHighContrastActive={false} />
      );

      // Should render normally
      expect(getByText('Visual Preferences')).toBeTruthy();
      expect(getByText('Habit Management')).toBeTruthy();
    });
  });

  describe('multiple setting changes', () => {
    it('should handle multiple rapid toggle changes', () => {
      const handleProgressBar = jest.fn();
      const handleIcon = jest.fn();
      const handleShape = jest.fn();

      const { getByLabelText } = render(
        <SettingsContent
          {...defaultProps}
          onChangeShowWeekCompletionBar={handleProgressBar}
          onChangeHabitCompletionIcon={handleIcon}
          onChangeDayShape={handleShape}
        />
      );

      // Toggle all three settings
      fireEvent(getByLabelText('Daily progress bar'), 'valueChange', true);
      fireEvent(
        getByLabelText('Use checkbox completion icon'),
        'valueChange',
        true
      );
      fireEvent(
        getByLabelText('Use circles for habit days'),
        'valueChange',
        true
      );

      expect(handleProgressBar).toHaveBeenCalledWith(true);
      expect(handleIcon).toHaveBeenCalledWith('checkbox');
      expect(handleShape).toHaveBeenCalledWith('circle');
    });
  });

  describe('color theming', () => {
    it('should apply custom background color', () => {
      const customColors = {
        ...defaultColors,
        background: '#000000',
      };

      const { UNSAFE_getByType } = render(
        <SettingsContent {...defaultProps} colors={customColors} />
      );

      const scrollView = UNSAFE_getByType('RCTScrollView');
      expect(scrollView.props.style).toMatchObject({
        backgroundColor: '#000000',
      });
    });

    it('should apply custom version text color', () => {
      const customColors = {
        ...defaultColors,
        versionText: '#ff0000',
      };

      const { getByText } = render(
        <SettingsContent {...defaultProps} colors={customColors} />
      );

      const versionText = getByText('Chain Day v1.0.0');
      expect(versionText.props.style).toMatchObject({ color: '#ff0000' });
    });
  });

  describe('accessibility', () => {
    it('should have accessible labels for all toggles', () => {
      const { getByLabelText } = render(<SettingsContent {...defaultProps} />);

      expect(getByLabelText('Daily progress bar')).toBeTruthy();
      expect(getByLabelText('Use checkbox completion icon')).toBeTruthy();
      expect(getByLabelText('Use circles for habit days')).toBeTruthy();
    });

    it('should have accessible interactive elements', () => {
      const { getByLabelText } = render(<SettingsContent {...defaultProps} />);

      // Should have accessible toggles
      expect(getByLabelText('Daily progress bar')).toBeTruthy();
      expect(getByLabelText('Use checkbox completion icon')).toBeTruthy();
      expect(getByLabelText('Use circles for habit days')).toBeTruthy();
    });
  });

  describe('integration scenarios', () => {
    it('should reflect all enabled settings correctly', () => {
      const { getByLabelText } = render(
        <SettingsContent
          {...defaultProps}
          showWeekCompletionBar={true}
          habitCompletionIcon='checkbox'
          dayShape='circle'
        />
      );

      expect(getByLabelText('Daily progress bar').props.value).toBe(true);
      expect(getByLabelText('Use checkbox completion icon').props.value).toBe(
        true
      );
      expect(getByLabelText('Use circles for habit days').props.value).toBe(
        true
      );
    });

    it('should reflect all disabled settings correctly', () => {
      const { getByLabelText } = render(
        <SettingsContent
          {...defaultProps}
          showWeekCompletionBar={false}
          habitCompletionIcon='chain'
          dayShape='square'
        />
      );

      expect(getByLabelText('Daily progress bar').props.value).toBe(false);
      expect(getByLabelText('Use checkbox completion icon').props.value).toBe(
        false
      );
      expect(getByLabelText('Use circles for habit days').props.value).toBe(
        false
      );
    });
  });
});
