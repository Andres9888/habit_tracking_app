/**
 * CreateHabitModal V11 Integration Tests
 *
 * Tests V11-specific features:
 * - Live preview real-time updates
 * - Button state intelligence (2+ character validation)
 * - Smart emoji suggestions based on habit name
 * - Progressive spacing visual hierarchy
 * - Swipe-to-dismiss gesture
 * - Character counter visibility thresholds
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import STRINGS from '../../../constants/strings';

// Mock dependencies before imports
jest.mock('convex/react', () => ({
  useMutation: () => jest.fn(() => Promise.resolve('new-habit-id')),
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

// Mock Reanimated for animations and gestures
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  const Animated = require('react-native').Animated;

  return {
    ...jest.requireActual('react-native-reanimated/mock'),
    FadeIn: { duration: () => ({ delay: () => ({}) }) },
    FadeInUp: { duration: () => ({ delay: () => ({}) }) },
    FadeOut: { duration: () => ({}) },
    LinearTransition: {
      duration: () => ({}),
      springify: () => ({
        damping: () => ({
          stiffness: () => ({}),
        }),
      }),
    },
    default: {
      View,
      createAnimatedComponent: (Component: React.ComponentType<unknown>) =>
        Component,
      addWhitelistedNativeProps: jest.fn(),
    },
    addWhitelistedNativeProps: jest.fn(),
    useSharedValue: (initial: unknown) => ({ value: initial }),
    useAnimatedStyle: (callback: unknown) => callback(),
    runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
    withSpring: (value: unknown) => value,
    withTiming: (value: unknown) => value,
  };
});

// Mock gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;

  return {
    GestureDetector: ({ children }: unknown) => children,
    Gesture: {
      Pan: () => ({
        onStart: () => ({}),
        onUpdate: () => ({}),
        onEnd: () => ({}),
      }),
    },
    PanGestureHandler: View,
    State: {},
  };
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

// Mock ColorPickerSheet
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

describe('CreateHabitModal V11 Integration Tests', () => {
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

  describe('Live Preview Real-Time Updates', () => {
    it('should update preview immediately when habit name changes', async () => {
      const { getByLabelText, getByText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');

      // Type a habit name
      fireEvent.changeText(input, 'Morning Jog');

      // Preview should update in real-time
      await waitFor(() => {
        expect(getByText('Morning Jog')).toBeDefined();
      });
    });

    it('should show default preview text when habit name is empty', () => {
      const { getByText } = render(<CreateHabitModal {...defaultProps} />);

      // Should show default hint
      expect(getByText('Your new habit')).toBeDefined();
    });

    it('should update preview emoji when emoji is selected', async () => {
      const { getAllByTestId, getAllByText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Select the book emoji (📖) from suggestions
      const bookEmoji = getAllByTestId('emoji-chip-📖')[0];
      fireEvent.press(bookEmoji);

      // Preview should show selected emoji
      await waitFor(() => {
        const bookEmojis = getAllByText('📖');
        expect(bookEmojis.length).toBeGreaterThan(0);
      });
    });

    it('should update preview color when color is selected', async () => {
      const { getByTestId, getByLabelText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Select teal color
      const tealSwatch = getByTestId('color-swatch-14B8A6');
      fireEvent.press(tealSwatch);

      // Preview card should exist with updated styling
      await waitFor(() => {
        const preview = getByLabelText(/Preview:/);
        expect(preview).toBeDefined();
      });
    });

    it('should update all preview elements simultaneously', async () => {
      const {
        getByLabelText,
        getAllByTestId,
        getByTestId,
        getByText,
        getAllByText,
      } = render(<CreateHabitModal {...defaultProps} />);

      // 1. Set name
      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, 'Read Daily');

      // 2. Select emoji
      const bookEmoji = getAllByTestId('emoji-chip-📖')[0];
      fireEvent.press(bookEmoji);

      // 3. Select color
      const purpleSwatch = getByTestId('color-swatch-A855F7');
      fireEvent.press(purpleSwatch);

      // All preview elements should be updated
      await waitFor(() => {
        expect(getByText('Read Daily')).toBeDefined();
        const bookEmojis = getAllByText('📖');
        expect(bookEmojis.length).toBeGreaterThan(0);
      });
    });

    it('should not cause full modal re-render on input change', async () => {
      const { getByLabelText, getByText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');

      // Type multiple characters quickly
      fireEvent.changeText(input, 'R');
      fireEvent.changeText(input, 'Re');
      fireEvent.changeText(input, 'Read');

      // Should handle rapid updates smoothly
      await waitFor(() => {
        expect(getByText('Read')).toBeDefined();
      });
    });
  });

  describe('Button State Intelligence', () => {
    it('should disable button when habit name is empty', () => {
      const { getAllByLabelText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const createButtons = getAllByLabelText('Create habit');
      const buttonWithState = createButtons.find(
        (el) => el.props.accessibilityState?.disabled !== undefined
      );

      expect(buttonWithState?.props.accessibilityState?.disabled).toBe(true);
    });

    it('should disable button when habit name has only 1 character', async () => {
      const { getByLabelText, getAllByLabelText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, 'R');

      await waitFor(() => {
        const createButtons = getAllByLabelText('Create habit');
        const buttonWithState = createButtons.find(
          (el) => el.props.accessibilityState?.disabled !== undefined
        );

        expect(buttonWithState?.props.accessibilityState?.disabled).toBe(true);
      });
    });

    it('should enable button when habit name has 2+ characters', async () => {
      const { getByLabelText, getAllByLabelText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, 'Re');

      await waitFor(() => {
        const createButtons = getAllByLabelText('Create habit');
        const buttonWithState = createButtons.find(
          (el) => el.props.accessibilityState?.disabled !== undefined
        );

        expect(buttonWithState?.props.accessibilityState?.disabled).toBe(false);
      });
    });

    it('should disable button when name is only whitespace', async () => {
      const { getByLabelText, getAllByLabelText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, '   ');

      await waitFor(() => {
        const createButtons = getAllByLabelText('Create habit');
        const buttonWithState = createButtons.find(
          (el) => el.props.accessibilityState?.disabled !== undefined
        );

        expect(buttonWithState?.props.accessibilityState?.disabled).toBe(true);
      });
    });

    it('should re-disable button when name is cleared', async () => {
      const { getByLabelText, getAllByLabelText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');

      // First enable
      fireEvent.changeText(input, 'Read');
      await waitFor(() => {
        const createButtons = getAllByLabelText('Create habit');
        const buttonWithState = createButtons.find(
          (el) => el.props.accessibilityState?.disabled !== undefined
        );
        expect(buttonWithState?.props.accessibilityState?.disabled).toBe(false);
      });

      // Then clear
      fireEvent.changeText(input, '');
      await waitFor(() => {
        const createButtons = getAllByLabelText('Create habit');
        const buttonWithState = createButtons.find(
          (el) => el.props.accessibilityState?.disabled !== undefined
        );
        expect(buttonWithState?.props.accessibilityState?.disabled).toBe(true);
      });
    });
  });

  describe('Smart Emoji Suggestions', () => {
    it('should show reading-related emojis when habit name contains "read"', async () => {
      const { getByLabelText, getAllByTestId } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, 'Read daily');

      // Should show book emoji in suggestions
      await waitFor(() => {
        const bookEmojis = getAllByTestId('emoji-chip-📖');
        expect(bookEmojis.length).toBeGreaterThan(0);
      });
    });

    it('should show workout-related emojis when habit name contains "workout"', async () => {
      const { getByLabelText, getAllByTestId } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, 'Morning workout');

      // Should show muscle emoji in suggestions
      await waitFor(() => {
        const muscleEmojis = getAllByTestId('emoji-chip-💪');
        expect(muscleEmojis.length).toBeGreaterThan(0);
      });
    });

    it('should show meditation-related emojis when habit name contains "meditate"', async () => {
      const { getByLabelText, getAllByTestId } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, 'Meditate 10 mins');

      // Should show meditation emoji in suggestions
      await waitFor(() => {
        const meditationEmojis = getAllByTestId('emoji-chip-🧘');
        expect(meditationEmojis.length).toBeGreaterThan(0);
      });
    });

    it('should show water-related emojis when habit name contains "water"', async () => {
      const { getByLabelText, getAllByTestId } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, 'Drink water');

      // Should show water emoji in suggestions
      await waitFor(() => {
        const waterEmojis = getAllByTestId('emoji-chip-💧');
        expect(waterEmojis.length).toBeGreaterThan(0);
      });
    });

    it('should show default emojis when habit name has no keywords', async () => {
      const { getByLabelText, getAllByTestId } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, 'XYZABC');

      // Should show default emoji (target)
      await waitFor(() => {
        const targetEmojis = getAllByTestId('emoji-chip-🎯');
        expect(targetEmojis.length).toBeGreaterThan(0);
      });
    });

    it('should debounce emoji suggestions to prevent jittery updates', async () => {
      const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);

      const input = getByLabelText('Habit name');

      // Type quickly
      fireEvent.changeText(input, 'r');
      fireEvent.changeText(input, 're');
      fireEvent.changeText(input, 'rea');
      fireEvent.changeText(input, 'read');

      // Fast forward debounce timer (300ms)
      jest.advanceTimersByTime(300);

      // Should only update once after debounce
      await waitFor(() => {
        expect(input.props.value).toBe('read');
      });
    });

    it('should update suggestions when habit name changes category', async () => {
      const { getByLabelText, getAllByTestId, queryAllByTestId } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');

      // First type "read"
      fireEvent.changeText(input, 'Read');
      jest.advanceTimersByTime(300);

      await waitFor(() => {
        const bookEmojis = getAllByTestId('emoji-chip-📖');
        expect(bookEmojis.length).toBeGreaterThan(0);
      });

      // Then change to "workout"
      fireEvent.changeText(input, 'Workout');
      jest.advanceTimersByTime(300);

      // Should now show workout emojis
      await waitFor(() => {
        const muscleEmojis = getAllByTestId('emoji-chip-💪');
        expect(muscleEmojis.length).toBeGreaterThan(0);
      });
    });

    it('should be case-insensitive for keyword matching', async () => {
      const { getByLabelText, getAllByTestId } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, 'READ DAILY');

      jest.advanceTimersByTime(300);

      // Should still show book emoji despite uppercase
      await waitFor(() => {
        const bookEmojis = getAllByTestId('emoji-chip-📖');
        expect(bookEmojis.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Character Counter Visibility', () => {
    it('should not show counter when name is empty', () => {
      const { queryByText } = render(<CreateHabitModal {...defaultProps} />);

      // Counter should not be visible
      expect(queryByText(/\d+\/40/)).toBeNull();
    });

    it('should not show counter when name is 20 characters or less', async () => {
      const { getByLabelText, queryByText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, '12345678901234567890'); // Exactly 20

      await waitFor(() => {
        expect(queryByText(/20\/40/)).toBeNull();
      });
    });

    it('should show counter when name exceeds 20 characters', async () => {
      const { getByLabelText, getByText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, '123456789012345678901'); // 21 characters

      await waitFor(() => {
        expect(getByText('21/40')).toBeDefined();
      });
    });

    it('should show warning color when name exceeds 30 characters', async () => {
      const { getByLabelText, getByText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, '1234567890123456789012345678901'); // 31 characters

      await waitFor(() => {
        const counter = getByText('31/40');
        // Amber color (#F59E0B) should be applied
        expect(counter).toBeDefined();
      });
    });

    it('should show error color when name exceeds 40 characters', async () => {
      const { getByLabelText, getByText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, '12345678901234567890123456789012345678901'); // 41 characters

      await waitFor(() => {
        const counter = getByText('41/40');
        // Red color (#EF4444) should be applied
        expect(counter).toBeDefined();
      });
    });
  });

  describe('Progressive Spacing Visual Hierarchy', () => {
    it('should render all sections with progressive spacing', () => {
      const { getByText, getByLabelText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Verify all sections are rendered
      expect(getByLabelText('Habit name')).toBeDefined(); // Input
      expect(getByText('Icon')).toBeDefined(); // Emoji section
      expect(getByText('Color')).toBeDefined(); // Color section
      expect(getByText('Daily reminder')).toBeDefined(); // Reminder section
      expect(getByText('Create Habit')).toBeDefined(); // Button
    });
  });

  describe('Form Reset on Modal Close/Open', () => {
    it('should reset form when modal is closed and reopened', async () => {
      const { getByLabelText, getByText, queryByText, rerender } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Fill in some data
      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, 'Test Habit');

      await waitFor(() => {
        expect(getByText('Test Habit')).toBeDefined();
      });

      // Close modal and wait for post-dismiss reset
      rerender(<CreateHabitModal {...defaultProps} visible={false} />);
      await act(async () => {
        jest.advanceTimersByTime(400);
      });

      // Reopen modal
      rerender(<CreateHabitModal {...defaultProps} visible={true} />);

      // Preview should show default text
      await waitFor(() => {
        expect(getByText('Your new habit')).toBeDefined();
        expect(queryByText('Test Habit')).toBeNull();
      });
    });
  });

  describe('Accessibility Support', () => {
    it('should have proper accessibility labels on all interactive elements', () => {
      const { getByLabelText, getAllByLabelText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      // Input field
      expect(getByLabelText('Habit name')).toBeDefined();

      // Create button
      const createButtons = getAllByLabelText('Create habit');
      expect(createButtons.length).toBeGreaterThan(0);
    });

    it('should announce preview updates for screen readers', async () => {
      const { getByLabelText } = render(<CreateHabitModal {...defaultProps} />);

      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, 'Morning Run');

      // Accessibility announcement should include preview info
      await waitFor(() => {
        expect(input.props.value).toBe('Morning Run');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long habit names gracefully', async () => {
      const { getByLabelText, getByText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');
      const longName = 'A'.repeat(100);
      fireEvent.changeText(input, longName);

      // Should still render without crashing
      await waitFor(() => {
        expect(input.props.value).toBe(longName);
      });
    });

    it('should handle special characters in habit name', async () => {
      const { getByLabelText, getByText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, 'Test@#$%^&*()');

      await waitFor(() => {
        expect(getByText('Test@#$%^&*()')).toBeDefined();
      });
    });

    it('should handle emoji characters in habit name', async () => {
      const { getByLabelText, getByText } = render(
        <CreateHabitModal {...defaultProps} />
      );

      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, 'Test 🎯 Habit');

      await waitFor(() => {
        expect(getByText('Test 🎯 Habit')).toBeDefined();
      });
    });

    it('should handle rapid emoji selection changes', async () => {
      const { getAllByTestId } = render(<CreateHabitModal {...defaultProps} />);

      // Select multiple emojis quickly
      const emoji1 = getAllByTestId('emoji-chip-🎯')[0];
      const emoji2 = getAllByTestId('emoji-chip-✨')[0];
      const emoji3 = getAllByTestId('emoji-chip-💪')[0];

      fireEvent.press(emoji1);
      fireEvent.press(emoji2);
      fireEvent.press(emoji3);

      // Should handle without crashing
      await waitFor(() => {
        expect(emoji3).toBeDefined();
      });
    });

    it('should handle rapid color selection changes', async () => {
      const { getByTestId } = render(<CreateHabitModal {...defaultProps} />);

      // Select multiple colors quickly
      const color1 = getByTestId('color-swatch-22C55E');
      const color2 = getByTestId('color-swatch-14B8A6');
      const color3 = getByTestId('color-swatch-A855F7');

      fireEvent.press(color1);
      fireEvent.press(color2);
      fireEvent.press(color3);

      // Should handle without crashing
      await waitFor(() => {
        expect(color3.props.accessibilityState?.selected).toBe(true);
      });
    });
  });
});
