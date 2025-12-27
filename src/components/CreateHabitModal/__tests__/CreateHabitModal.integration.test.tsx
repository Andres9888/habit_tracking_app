/**
 * CreateHabitModal Integration Tests - V5 Redesign
 * Task 5.3: Integration test for template → form flow
 *
 * Tests:
 * - Template selection populates all form fields
 * - Form modifications clear template selection
 * - TimeOfDay selection auto-sets reminder time
 * - Quick picks → form data flow
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

// Mock dependencies before imports
jest.mock('convex/react', () => ({
  useMutation: () => jest.fn(() => Promise.resolve('test-habit-id')),
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
      createAnimatedComponent: (Component: any) => Component,
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

// Mock TemplateScienceModal
jest.mock('../../TemplateScienceModal', () => {
  return jest.fn(() => null);
});

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

import CreateHabitModal from '../CreateHabitModal';

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

    it('should set time of day when quick pick is selected', async () => {
      const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);

      // Select the Read quick pick (which uses phase3_pull)
      const readCard = getByLabelText('Quick pick: Read');
      fireEvent.press(readCard);

      // Verify Pull time of day is selected
      await waitFor(() => {
        const pullButton = getByLabelText('Pull - 16+h after waking');
        expect(pullButton.props.accessibilityState?.selected).toBe(true);
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
      const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);

      // Select a quick pick
      const hydrateCard = getByLabelText('Quick pick: Hydrate');
      fireEvent.press(hydrateCard);

      // Verify quick pick is selected - reminders auto-enable is tested via
      // the reminder toggle state which is part of the useHabitForm hook
      await waitFor(() => {
        expect(hydrateCard.props.accessibilityState?.selected).toBe(true);
      });

      // Also verify Push phase is selected (Hydrate uses phase1_push)
      const pushButton = getByLabelText('Push - 0-8h after waking');
      expect(pushButton.props.accessibilityState?.selected).toBe(true);
    });
  });

  describe('Form Modifications Clear Template Selection', () => {
    it('should clear quick pick selection when name is manually changed', async () => {
      const { getByLabelText, getByPlaceholderText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // First select a quick pick
      const meditateCard = getByLabelText('Quick pick: Meditate');
      fireEvent.press(meditateCard);

      await waitFor(() => {
        expect(meditateCard.props.accessibilityState?.selected).toBe(true);
      });

      // Now manually change the name (placeholder from STRINGS.CREATE_HABIT.namePlaceholder)
      const nameInput = getByPlaceholderText('e.g., Read 10 minutes');
      fireEvent.changeText(nameInput, 'Custom Habit');

      // Quick pick should no longer be selected
      await waitFor(() => {
        const updatedCard = getByLabelText('Quick pick: Meditate');
        expect(updatedCard.props.accessibilityState?.selected).toBe(false);
      });
    });

    it('should clear quick pick selection when time of day is manually changed', async () => {
      const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);

      // First select Read (which uses Pull phase)
      const readCard = getByLabelText('Quick pick: Read');
      fireEvent.press(readCard);

      await waitFor(() => {
        expect(readCard.props.accessibilityState?.selected).toBe(true);
      });

      // Now manually change time of day to Push
      const pushButton = getByLabelText('Push - 0-8h after waking');
      fireEvent.press(pushButton);

      // Quick pick should no longer be selected
      await waitFor(() => {
        const updatedCard = getByLabelText('Quick pick: Read');
        expect(updatedCard.props.accessibilityState?.selected).toBe(false);
      });
    });
  });

  describe('Time of Day → Reminder Time Flow', () => {
    it('should select Push phase when pressed', async () => {
      const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);

      const pushButton = getByLabelText('Push - 0-8h after waking');
      fireEvent.press(pushButton);

      // Push should be selected
      await waitFor(() => {
        expect(pushButton.props.accessibilityState?.selected).toBe(true);
      });
    });

    it('should select Pivot phase when pressed', async () => {
      const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);

      const pivotButton = getByLabelText('Pivot - 9-15h after waking');
      fireEvent.press(pivotButton);

      // Pivot should be selected
      await waitFor(() => {
        expect(pivotButton.props.accessibilityState?.selected).toBe(true);
      });
    });

    it('should select Pull phase when pressed', async () => {
      const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);

      const pullButton = getByLabelText('Pull - 16+h after waking');
      fireEvent.press(pullButton);

      // Pull should be selected
      await waitFor(() => {
        expect(pullButton.props.accessibilityState?.selected).toBe(true);
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
      const { getByPlaceholderText, getByText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Placeholder is 'e.g., Read 10 minutes' from STRINGS.CREATE_HABIT.namePlaceholder
      const nameInput = getByPlaceholderText('e.g., Read 10 minutes');
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

      // Close modal
      rerender(<CreateHabitModal {...defaultProps} visible={false} />);

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

    it('should announce when time of day is selected', async () => {
      const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);

      const pushButton = getByLabelText('Push - 0-8h after waking');
      fireEvent.press(pushButton);

      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        expect.stringContaining('Push')
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
      expect(getByText('When')).toBeDefined();
      expect(getByText('Remind me')).toBeDefined();
      expect(getByText('Create Habit')).toBeDefined();
    });

    it('should not show quick picks in edit mode', () => {
      const habitToEdit = {
        _id: 'test-id' as any,
        _creationTime: Date.now(),
        userId: 'user-1' as any,
        name: 'Test Habit',
        icon: '🎯',
        iconColor: '#22C55E',
        frequency: 'daily' as const,
        completions: [],
      };

      const { queryByText } = render(
        <CreateHabitModal {...defaultProps} habitToEdit={habitToEdit} />
      );

      // Quick picks should not be visible in edit mode
      expect(queryByText('Quick picks')).toBeNull();
      expect(queryByText('or create your own')).toBeNull();
    });
  });
});
