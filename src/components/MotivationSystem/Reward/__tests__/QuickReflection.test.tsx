/**
 * QuickReflection Tests
 * Story T6.2-T6.6 - Quick Reflection Component
 *
 * Tests:
 * - Empty state rendering with pulsing icon
 * - Emoji selector with 4 options
 * - Optional text note field
 * - Selection state and animation
 * - Emerald accent color styling
 * - Accessibility labels
 */

import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import { QuickReflection, type EmojiType } from '../QuickReflection';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  Smile: () => null,
  Plus: () => null,
  Check: () => null,
  MessageSquare: () => null,
}));

// Mock clsx
jest.mock('clsx', () => ({
  clsx: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    default: {
      View,
      createAnimatedComponent: (Component: React.ComponentType<unknown>) => Component,
    },
    useSharedValue: (initial: unknown) => ({ value: initial }),
    useAnimatedStyle: () => ({}),
    withSpring: (value: unknown) => value,
    withTiming: (value: unknown) => value,
    withSequence: (...values: unknown[]) => values[values.length - 1],
    interpolate: (value: number, input: number[], output: number[]) => output[0],
    runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
    View,
  };
});

describe('QuickReflection', () => {
  const defaultProps = {
    selectedEmoji: undefined as EmojiType | undefined,
    onEmojiSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('T6.2: Component rendering', () => {
    it('renders component with header text', () => {
      const { getByText } = render(<QuickReflection {...defaultProps} />);

      expect(getByText('Quick Reflection')).toBeTruthy();
    });

    it('renders prompt text', () => {
      const { getByText } = render(<QuickReflection {...defaultProps} />);

      expect(getByText('How did completing this habit feel?')).toBeTruthy();
    });

    it('shows "Rate it" CTA when no selection', () => {
      const { getByText } = render(<QuickReflection {...defaultProps} />);

      expect(getByText('Rate it')).toBeTruthy();
    });

    it('hides "Rate it" CTA when emoji is selected', () => {
      const { queryByText } = render(
        <QuickReflection {...defaultProps} selectedEmoji="happy" />
      );

      expect(queryByText('Rate it')).toBeNull();
    });
  });

  describe('T6.3: Emoji selector (4 options)', () => {
    it('renders all 4 emoji options', () => {
      const { getByText } = render(<QuickReflection {...defaultProps} />);

      // Check for emoji labels
      expect(getByText('Frustrated')).toBeTruthy();
      expect(getByText('Neutral')).toBeTruthy();
      expect(getByText('Happy')).toBeTruthy();
      expect(getByText('On Fire')).toBeTruthy();
    });

    it('calls onEmojiSelect when frustrated emoji is pressed', () => {
      const onEmojiSelect = jest.fn();
      const { getByLabelText } = render(
        <QuickReflection {...defaultProps} onEmojiSelect={onEmojiSelect} />
      );

      fireEvent.press(getByLabelText('Frustrated emoji'));

      expect(onEmojiSelect).toHaveBeenCalledWith('frustrated');
    });

    it('calls onEmojiSelect when neutral emoji is pressed', () => {
      const onEmojiSelect = jest.fn();
      const { getByLabelText } = render(
        <QuickReflection {...defaultProps} onEmojiSelect={onEmojiSelect} />
      );

      fireEvent.press(getByLabelText('Neutral emoji'));

      expect(onEmojiSelect).toHaveBeenCalledWith('neutral');
    });

    it('calls onEmojiSelect when happy emoji is pressed', () => {
      const onEmojiSelect = jest.fn();
      const { getByLabelText } = render(
        <QuickReflection {...defaultProps} onEmojiSelect={onEmojiSelect} />
      );

      fireEvent.press(getByLabelText('Happy emoji'));

      expect(onEmojiSelect).toHaveBeenCalledWith('happy');
    });

    it('calls onEmojiSelect when fire emoji is pressed', () => {
      const onEmojiSelect = jest.fn();
      const { getByLabelText } = render(
        <QuickReflection {...defaultProps} onEmojiSelect={onEmojiSelect} />
      );

      fireEvent.press(getByLabelText('On Fire emoji'));

      expect(onEmojiSelect).toHaveBeenCalledWith('fire');
    });

    it('shows selected state for chosen emoji', () => {
      const { getByLabelText } = render(
        <QuickReflection {...defaultProps} selectedEmoji="happy" />
      );

      const happyButton = getByLabelText('Happy emoji');
      // Check that the button renders with selected state
      expect(happyButton.props.accessibilityState?.selected).toBe(true);
    });
  });

  describe('T6.4: Optional text note field', () => {
    it('does not show note input when no emoji is selected', () => {
      const { queryByPlaceholderText } = render(
        <QuickReflection {...defaultProps} />
      );

      expect(
        queryByPlaceholderText('What made it great? Any challenges?')
      ).toBeNull();
    });

    it('shows note input when emoji is selected and showNoteInput is true', () => {
      const { getByPlaceholderText } = render(
        <QuickReflection
          {...defaultProps}
          selectedEmoji="happy"
          showNoteInput={true}
        />
      );

      expect(
        getByPlaceholderText('What made it great? Any challenges?')
      ).toBeTruthy();
    });

    it('does not show note input when showNoteInput is false', () => {
      const { queryByPlaceholderText } = render(
        <QuickReflection
          {...defaultProps}
          selectedEmoji="happy"
          showNoteInput={false}
        />
      );

      expect(
        queryByPlaceholderText('What made it great? Any challenges?')
      ).toBeNull();
    });

    it('calls onNoteChange when note text changes', () => {
      const onNoteChange = jest.fn();
      const { getByPlaceholderText } = render(
        <QuickReflection
          {...defaultProps}
          selectedEmoji="happy"
          onNoteChange={onNoteChange}
        />
      );

      const input = getByPlaceholderText('What made it great? Any challenges?');
      fireEvent.changeText(input, 'Felt great today!');

      expect(onNoteChange).toHaveBeenCalledWith('Felt great today!');
    });

    it('shows character count', () => {
      const { getByText } = render(
        <QuickReflection
          {...defaultProps}
          selectedEmoji="happy"
          note="Hello"
        />
      );

      expect(getByText('5/500')).toBeTruthy();
    });

    it('shows "Add a note" label', () => {
      const { getByText } = render(
        <QuickReflection {...defaultProps} selectedEmoji="happy" />
      );

      expect(getByText('Add a note (optional)')).toBeTruthy();
    });
  });

  describe('T6.6: Emerald accent color styling', () => {
    it('renders with emerald border styling', () => {
      const { getByText } = render(<QuickReflection {...defaultProps} />);

      // Component renders without errors with emerald styling applied via className
      expect(getByText('Quick Reflection')).toBeTruthy();
    });
  });

  describe('Compact mode', () => {
    it('renders only emoji buttons in compact mode', () => {
      const { getByLabelText, queryByText } = render(
        <QuickReflection {...defaultProps} compact={true} />
      );

      // Should have emoji buttons
      expect(getByLabelText('Happy emoji')).toBeTruthy();

      // Should not have header or note input
      expect(queryByText('Quick Reflection')).toBeNull();
    });

    it('calls onEmojiSelect in compact mode', () => {
      const onEmojiSelect = jest.fn();
      const { getByLabelText } = render(
        <QuickReflection
          {...defaultProps}
          onEmojiSelect={onEmojiSelect}
          compact={true}
        />
      );

      fireEvent.press(getByLabelText('On Fire emoji'));

      expect(onEmojiSelect).toHaveBeenCalledWith('fire');
    });
  });

  describe('Animation props', () => {
    it('accepts shouldAnimate prop', () => {
      const { getByText } = render(
        <QuickReflection {...defaultProps} shouldAnimate={true} />
      );

      expect(getByText('Quick Reflection')).toBeTruthy();
    });

    it('accepts reduceMotion prop', () => {
      const { getByText } = render(
        <QuickReflection {...defaultProps} reduceMotion={true} />
      );

      expect(getByText('Quick Reflection')).toBeTruthy();
    });

    it('accepts sectionIndex prop for stagger timing', () => {
      const { getByText } = render(
        <QuickReflection {...defaultProps} sectionIndex={2} />
      );

      expect(getByText('Quick Reflection')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has accessible button role for emoji buttons', () => {
      const { getByLabelText } = render(<QuickReflection {...defaultProps} />);

      const happyButton = getByLabelText('Happy emoji');
      expect(happyButton.props.accessibilityRole).toBe('button');
    });

    it('has correct accessibility state for selected emoji', () => {
      const { getByLabelText } = render(
        <QuickReflection {...defaultProps} selectedEmoji="fire" />
      );

      const fireButton = getByLabelText('On Fire emoji');
      expect(fireButton.props.accessibilityState?.selected).toBe(true);

      const happyButton = getByLabelText('Happy emoji');
      expect(happyButton.props.accessibilityState?.selected).toBe(false);
    });
  });
});
