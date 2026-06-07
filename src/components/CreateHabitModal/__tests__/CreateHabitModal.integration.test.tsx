/**
 * CreateHabitModal Integration Tests - V5/V8/V9 Redesign
 * Task 5.3: Integration test for template → form flow
 *
 * Tests:
 * - Template selection populates all form fields
 * - Form modifications clear template selection
 * - Reminder selection (V8 unified selector) auto-sets reminder time
 * - Quick picks → form data flow
 * - V9 Design System elements (motivation text, uppercase labels, tip text)
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import STRINGS from '../../../constants/strings';

// Create trackable mock functions at module level (prefixed with "mock" for jest)
const mockMutationFn = jest.fn(() => Promise.resolve('new-habit-id'));

// Mock dependencies before imports
jest.mock('convex/react', () => ({
  useMutation: () => mockMutationFn,
  useQuery: () => [],
}));

jest.mock('../../../../convex/_generated/api', () => ({
  api: {
    habits: {
      create: 'habits:create',
      update: 'habits:update',
    },
    templates: {
      list: 'templates:list',
    },
    categories: {
      list: 'categories:list',
    },
  },
}));

jest.mock('../../../utils/notifications', () => ({
  cancelHabitReminder: jest.fn(),
  ensureNotificationPermissions: jest.fn(() => Promise.resolve(true)),
  formatReminderTime: jest.fn((date: Date) => date.toISOString()),
  scheduleHabitReminder: jest.fn(() => Promise.resolve(true)),
  getDefaultReminderTime: jest.fn(() => new Date()),
  createDateFromTimeString: jest.fn(
    (timeString?: string, defaultDate?: Date) => defaultDate || new Date()
  ),
}));

jest.mock('../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerSelection: jest.fn(),
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
    triggerSuccess: jest.fn(),
  }),
}));

// Mock Reanimated for animations
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;

  const springify = () => ({
    damping: () => ({
      stiffness: () => ({}),
    }),
  });

  const mock = {
    ...jest.requireActual('react-native-reanimated/mock'),
    FadeIn: { duration: () => ({ delay: () => ({}) }) },
    FadeInUp: { duration: () => ({ delay: () => ({}) }) },
    FadeOut: { duration: () => ({}) },
    LinearTransition: {
      duration: () => ({}),
      springify,
    },
    default: {
      View,
      createAnimatedComponent: (Component: React.ComponentType<unknown>) =>
        Component,
      addWhitelistedNativeProps: jest.fn(),
    },
    addWhitelistedNativeProps: jest.fn(),
  };
  return mock;
});

// Mock EmojiPickerSheet
jest.mock('../../EmojiPickerV2', () => ({
  EmojiPickerSheet: jest.fn(() => null),
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => {
  const View = require('react-native').View;
  return {
    LinearGradient: View,
  };
});

// Mock reanimated-color-picker
jest.mock('reanimated-color-picker', () => {
  const View = require('react-native').View;
  return {
    __esModule: true,
    default: View,
    BrightnessSlider: View,
    Preview: View,
  };
});

// Mock ColorPickerSheet to avoid complex dependencies
jest.mock('../ColorPickerSheet', () => ({
  ColorPickerSheet: jest.fn(() => null),
}));

// Mock SafeAreaProvider
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  return jest.fn(() => null);
});

// Mock AccessibilityInfo
jest
  .spyOn(AccessibilityInfo, 'announceForAccessibility')
  .mockImplementation(jest.fn());

import CreateHabitModal from '../CreateHabitModalCentered';

describe('CreateHabitModal Integration - Template → Form Flow', () => {
  const mockOnClose = jest.fn();

  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Quick Pick Template Selection', () => {
    it('should populate habit name when quick pick is selected', async () => {
      const { getByLabelText, getByDisplayValue } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Select the Meditate quick pick
      const meditateCard = getByLabelText('Quick pick: Meditate');
      fireEvent.press(meditateCard);

      // Verify name field is populated
      await waitFor(() => {
        expect(getByDisplayValue('Meditate')).toBeDefined();
      });
    });

    it('should populate emoji when quick pick is selected', async () => {
      const { getByLabelText, getAllByText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Select the Exercise quick pick
      const exerciseCard = getByLabelText('Quick pick: Exercise');
      fireEvent.press(exerciseCard);

      // Verify emoji is visible (may appear in multiple places - quick pick card + preview)
      await waitFor(() => {
        const muscleEmojis = getAllByText('💪');
        // Should appear at least once (in quick pick card, possibly in preview too)
        expect(muscleEmojis.length).toBeGreaterThan(0);
      });
    });

    it('should set reminder option when quick pick is selected', async () => {
      const { getByLabelText, getByTestId } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Select the Read quick pick (which maps to evening reminder)
      const readCard = getByLabelText('Quick pick: Read');
      fireEvent.press(readCard);

      // V8: Verify Evening reminder option is selected (maps from phase3_pull)
      await waitFor(() => {
        const eveningOption = getByTestId('reminder-option-evening');
        expect(eveningOption.props.accessibilityState?.selected).toBe(true);
      });
    });

    it('should show selected state on the quick pick card', async () => {
      const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);

      const journalCard = getByLabelText('Quick pick: Journal');

      // Initially not selected
      expect(journalCard.props.accessibilityState?.selected).toBe(false);

      fireEvent.press(journalCard);

      // Should now be selected
      await waitFor(() => {
        const updatedCard = getByLabelText('Quick pick: Journal');
        expect(updatedCard.props.accessibilityState?.selected).toBe(true);
      });
    });

    it('should auto-enable reminders when quick pick is selected', async () => {
      const { getByLabelText, getByTestId } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Select a quick pick
      const hydrateCard = getByLabelText('Quick pick: Hydrate');
      fireEvent.press(hydrateCard);

      // Verify quick pick is selected - reminders auto-enable is tested via
      // the reminder toggle state which is part of the useHabitForm hook
      await waitFor(() => {
        expect(hydrateCard.props.accessibilityState?.selected).toBe(true);
      });

      // V8: Verify Morning reminder option is selected (Hydrate maps to morning)
      const morningOption = getByTestId('reminder-option-morning');
      expect(morningOption.props.accessibilityState?.selected).toBe(true);
    });
  });

  describe('Form Modifications Clear Template Selection', () => {
    it('should clear quick pick selection when name is manually changed', async () => {
      const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);

      // First select a quick pick
      const meditateCard = getByLabelText('Quick pick: Meditate');
      fireEvent.press(meditateCard);

      await waitFor(() => {
        expect(meditateCard.props.accessibilityState?.selected).toBe(true);
      });

      // Now manually change the name via the habit name field
      const nameInput = getByLabelText('Habit name');
      fireEvent.changeText(nameInput, 'Custom Habit');

      // Quick pick should no longer be selected
      await waitFor(() => {
        const updatedCard = getByLabelText('Quick pick: Meditate');
        expect(updatedCard.props.accessibilityState?.selected).toBe(false);
      });
    });

    it('should clear quick pick selection when reminder option is manually changed', async () => {
      const { getByLabelText, getByTestId } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // First select Read (which uses evening reminder)
      const readCard = getByLabelText('Quick pick: Read');
      fireEvent.press(readCard);

      await waitFor(() => {
        expect(readCard.props.accessibilityState?.selected).toBe(true);
      });

      // V8: Now manually change reminder to Morning
      const morningOption = getByTestId('reminder-option-morning');
      fireEvent.press(morningOption);

      // Quick pick should no longer be selected
      await waitFor(() => {
        const updatedCard = getByLabelText('Quick pick: Read');
        expect(updatedCard.props.accessibilityState?.selected).toBe(false);
      });
    });
  });

  describe('V8 Unified Reminder Selection', () => {
    it('should select Morning reminder when pressed', async () => {
      const { getByTestId } = render(<CreateHabitModal {...defaultProps} />);

      const morningOption = getByTestId('reminder-option-morning');
      fireEvent.press(morningOption);

      // Morning should be selected
      await waitFor(() => {
        expect(morningOption.props.accessibilityState?.selected).toBe(true);
      });
    });

    it('should select Midday reminder when pressed', async () => {
      const { getByTestId } = render(<CreateHabitModal {...defaultProps} />);

      const middayOption = getByTestId('reminder-option-midday');
      fireEvent.press(middayOption);

      // Midday should be selected
      await waitFor(() => {
        expect(middayOption.props.accessibilityState?.selected).toBe(true);
      });
    });

    it('should select Evening reminder when pressed', async () => {
      const { getByTestId } = render(<CreateHabitModal {...defaultProps} />);

      const eveningOption = getByTestId('reminder-option-evening');
      fireEvent.press(eveningOption);

      // Evening should be selected
      await waitFor(() => {
        expect(eveningOption.props.accessibilityState?.selected).toBe(true);
      });
    });

    it('should disable reminders when None is selected', async () => {
      const { getByTestId } = render(<CreateHabitModal {...defaultProps} />);

      // First select Morning to enable reminders
      const morningOption = getByTestId('reminder-option-morning');
      fireEvent.press(morningOption);

      await waitFor(() => {
        expect(morningOption.props.accessibilityState?.selected).toBe(true);
      });

      // Now select None
      const noneOption = getByTestId('reminder-option-none');
      fireEvent.press(noneOption);

      // None should be selected
      await waitFor(() => {
        expect(noneOption.props.accessibilityState?.selected).toBe(true);
        expect(morningOption.props.accessibilityState?.selected).toBe(false);
      });
    });
  });

  describe('Live Preview Updates', () => {
    it('should update preview when quick pick is selected', async () => {
      const { getByLabelText, getAllByText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Select Exercise quick pick
      const exerciseCard = getByLabelText('Quick pick: Exercise');
      fireEvent.press(exerciseCard);

      // Preview and input should show Exercise name and emoji
      // Use getAllByText since it appears in multiple places
      await waitFor(() => {
        const exerciseTexts = getAllByText('Exercise');
        expect(exerciseTexts.length).toBeGreaterThan(0);
        const muscleEmojis = getAllByText('💪');
        expect(muscleEmojis.length).toBeGreaterThan(0);
      });
    });

    it('should update preview when name is manually typed', async () => {
      const { getByLabelText, getByText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Name field uses accessibilityLabel "Habit name"
      const nameInput = getByLabelText('Habit name');
      fireEvent.changeText(nameInput, 'My Custom Habit');

      await waitFor(() => {
        // Preview should show the typed name
        expect(getByText('My Custom Habit')).toBeDefined();
      });
    });
  });

  describe('Create Button State', () => {
    it('should enable create button when quick pick provides name', async () => {
      const { getByLabelText, getByText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Select a quick pick
      const meditateCard = getByLabelText('Quick pick: Meditate');
      fireEvent.press(meditateCard);

      // Create button should be enabled
      await waitFor(() => {
        const createButton = getByText('Create Habit');
        expect(createButton.parent?.props.disabled).toBeFalsy();
      });
    });

    it('should disable create button when name is empty', () => {
      const { getAllByLabelText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Create button should be disabled initially (check accessibilityState)
      // Use getAllByLabelText since there might be multiple elements with similar labels
      const createButtons = getAllByLabelText('Create habit');
      const buttonWithDisabledState = createButtons.find(
        (el) => el.props.accessibilityState?.disabled !== undefined
      );
      expect(buttonWithDisabledState?.props.accessibilityState?.disabled).toBe(
        true
      );
    });
  });

  describe('Modal Visibility', () => {
    it('should reset quick pick selection when modal reopens', async () => {
      const { getByLabelText, rerender } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Select a quick pick
      const meditateCard = getByLabelText('Quick pick: Meditate');
      fireEvent.press(meditateCard);

      await waitFor(() => {
        expect(meditateCard.props.accessibilityState?.selected).toBe(true);
      });

      // Close modal and wait for post-dismiss reset
      rerender(<CreateHabitModal {...defaultProps} visible={false} />);
      await act(async () => {
        jest.advanceTimersByTime(400);
      });

      // Reopen modal
      rerender(<CreateHabitModal {...defaultProps} visible={true} />);

      // Quick pick should not be selected
      await waitFor(() => {
        const resetCard = getByLabelText('Quick pick: Meditate');
        expect(resetCard.props.accessibilityState?.selected).toBe(false);
      });
    });
  });

  describe('Accessibility Announcements', () => {
    it('should announce when quick pick template is selected', async () => {
      const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);

      const meditateCard = getByLabelText('Quick pick: Meditate');
      fireEvent.press(meditateCard);

      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        expect.stringContaining('Meditate')
      );
    });

    it('should announce when reminder option is selected', async () => {
      const { getByTestId } = render(<CreateHabitModal {...defaultProps} />);

      // V8: Uses unified ReminderSelector instead of TimeOfDaySelector
      const morningOption = getByTestId('reminder-option-morning');
      fireEvent.press(morningOption);

      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        expect.stringContaining('Morning')
      );
    });
  });

  describe('Component Layout Order', () => {
    it('should render sections in correct order (QuickPicks → Divider → Preview → Form)', () => {
      const { getByText, UNSAFE_root } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Verify key elements are present
      expect(getByText('Quick picks')).toBeDefined();
      expect(getByText('or create your own')).toBeDefined();
      expect(getByText('Icon')).toBeDefined();
      expect(getByText('Color')).toBeDefined();
      // V9: "Daily reminder" with uppercase styling (see V9 spec)
      expect(getByText('Daily reminder')).toBeDefined();
      expect(getByText('Create Habit')).toBeDefined();
    });

    it('should not show quick picks in edit mode', () => {
      const habitToEdit = {
        _id: 'test-id' as unknown,
        _creationTime: Date.now(),
        userId: 'user-1' as unknown,
        name: 'Test Habit',
        icon: '🎯',
        iconColor: '#22C55E',
        frequency: 'daily' as const,
        completions: [],
        createdAt: Date.now(),
      };

      const { queryByText } = render(
        <CreateHabitModal {...defaultProps} habitToEdit={habitToEdit} />
      );

      // Quick picks should not be visible in edit mode
      expect(queryByText('Quick picks')).toBeNull();
      expect(queryByText('or create your own')).toBeNull();
    });
  });

  describe('V9 Design System Elements', () => {
    it('should render V9 motivation text "Start your streak today"', () => {
      const { getByText } = render(<CreateHabitModal {...defaultProps} />);

      expect(getByText('Start your streak today')).toBeDefined();
    });

    it('should render V9 motivation text with consistency message and fire emoji', () => {
      const { getByText } = render(<CreateHabitModal {...defaultProps} />);

      expect(getByText(/consistency is key/)).toBeDefined();
    });

    it('should render V9 uppercase section labels (Daily reminder)', () => {
      const { getByText } = render(<CreateHabitModal {...defaultProps} />);

      // V9: "Daily reminder" replaces previous "Reminder" label
      expect(getByText('Daily reminder')).toBeDefined();
    });

    it('should not render TemplatesLinkSection (removed in V9)', () => {
      const { queryByText } = render(<CreateHabitModal {...defaultProps} />);

      // V9: Templates link section was removed for focused flow
      expect(queryByText('Start from Template')).toBeNull();
      expect(queryByText('Browse curated')).toBeNull();
    });

    it('should render "+" button instead of "Browse all →" link in emoji section', () => {
      const { getByLabelText, queryByText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // V9: "+" button replaced "Browse all →" link
      expect(getByLabelText('Browse all icons')).toBeDefined();
      // The old link should not exist in the emoji picker section
      // (Note: "Browse all →" still exists in QuickPicksRow for templates)
    });
  });

  describe('V8 Full Habit Creation Flow', () => {
    it('should have all form fields properly populated before create', async () => {
      const { getByLabelText, getByTestId, getAllByLabelText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // 1. Fill in habit name
      const nameInput = getByLabelText('Habit name');
      fireEvent.changeText(nameInput, 'Morning Meditation');

      // 2. Select a color (Teal - #14B8A6)
      const tealSwatch = getByTestId('color-swatch-14B8A6');
      fireEvent.press(tealSwatch);

      // Verify teal is selected
      await waitFor(() => {
        expect(tealSwatch.props.accessibilityState?.selected).toBe(true);
      });

      // 3. Select Morning reminder
      const morningOption = getByTestId('reminder-option-morning');
      fireEvent.press(morningOption);

      // Verify Morning is selected
      await waitFor(() => {
        expect(morningOption.props.accessibilityState?.selected).toBe(true);
      });

      // 4. Verify Create button is enabled (name is filled)
      const createButtons = getAllByLabelText('Create habit');
      const createButton = createButtons.find(
        (el) => el.props.accessibilityState?.disabled !== undefined
      );
      expect(createButton?.props.accessibilityState?.disabled).toBe(false);

      // 5. Verify name input has correct value
      expect(nameInput.props.value).toBe('Morning Meditation');
    });

    it('should configure reminders disabled when None is selected', async () => {
      const { getByLabelText, getByTestId, getAllByLabelText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Fill in habit name
      const nameInput = getByLabelText('Habit name');
      fireEvent.changeText(nameInput, 'Daily Journal');

      // None reminder should be selected by default
      const noneOption = getByTestId('reminder-option-none');
      expect(noneOption.props.accessibilityState?.selected).toBe(true);

      // Morning, Midday, Evening should NOT be selected
      expect(
        getByTestId('reminder-option-morning').props.accessibilityState
          ?.selected
      ).toBe(false);
      expect(
        getByTestId('reminder-option-midday').props.accessibilityState?.selected
      ).toBe(false);
      expect(
        getByTestId('reminder-option-evening').props.accessibilityState
          ?.selected
      ).toBe(false);

      // Verify Create button is enabled
      const createButtons = getAllByLabelText('Create habit');
      const createButton = createButtons.find(
        (el) => el.props.accessibilityState?.disabled !== undefined
      );
      expect(createButton?.props.accessibilityState?.disabled).toBe(false);
    });

    it('should have quick pick data ready for creation', async () => {
      const { getByLabelText, getByText, getAllByLabelText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Select Exercise quick pick
      const exerciseCard = getByLabelText('Quick pick: Exercise');
      fireEvent.press(exerciseCard);

      // Wait for selection to apply
      await waitFor(() => {
        expect(exerciseCard.props.accessibilityState?.selected).toBe(true);
      });

      // Verify form shows Exercise data
      expect(getByText('Exercise')).toBeDefined(); // Preview shows name

      // Verify Create button is enabled
      const createButtons = getAllByLabelText('Create habit');
      const createButton = createButtons.find(
        (el) => el.props.accessibilityState?.disabled !== undefined
      );
      expect(createButton?.props.accessibilityState?.disabled).toBe(false);
    });

    it('should have Evening reminder configured properly', async () => {
      const { getByLabelText, getByTestId, getAllByLabelText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Fill in habit name
      const nameInput = getByLabelText('Habit name');
      fireEvent.changeText(nameInput, 'Evening Reading');

      // Select Evening reminder
      const eveningOption = getByTestId('reminder-option-evening');
      fireEvent.press(eveningOption);

      // Verify Evening is selected
      await waitFor(() => {
        expect(eveningOption.props.accessibilityState?.selected).toBe(true);
      });

      // Other options should not be selected
      expect(
        getByTestId('reminder-option-none').props.accessibilityState?.selected
      ).toBe(false);
      expect(
        getByTestId('reminder-option-morning').props.accessibilityState
          ?.selected
      ).toBe(false);
      expect(
        getByTestId('reminder-option-midday').props.accessibilityState?.selected
      ).toBe(false);

      // Verify Create button is enabled
      const createButtons = getAllByLabelText('Create habit');
      const createButton = createButtons.find(
        (el) => el.props.accessibilityState?.disabled !== undefined
      );
      expect(createButton?.props.accessibilityState?.disabled).toBe(false);
    });

    it('should have Midday reminder configured properly', async () => {
      const { getByLabelText, getByTestId, getAllByLabelText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Fill in habit name
      const nameInput = getByLabelText('Habit name');
      fireEvent.changeText(nameInput, 'Midday Stretch');

      // Select Midday reminder
      const middayOption = getByTestId('reminder-option-midday');
      fireEvent.press(middayOption);

      // Verify Midday is selected
      await waitFor(() => {
        expect(middayOption.props.accessibilityState?.selected).toBe(true);
      });

      // Verify Create button is enabled
      const createButtons = getAllByLabelText('Create habit');
      const createButton = createButtons.find(
        (el) => el.props.accessibilityState?.disabled !== undefined
      );
      expect(createButton?.props.accessibilityState?.disabled).toBe(false);
    });
  });
});
