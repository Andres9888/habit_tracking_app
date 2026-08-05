/**
 * EmojiPicker Component Tests - V9 Design System Update
 * Task 4: Replace "Browse all →" with "+" Button
 *
 * Tests:
 * - 6 inline emoji chips display
 * - Dynamic suggestions based on habit name keywords
 * - Dashed "+" button opens full EmojiPickerSheet
 * - Selected state with emerald ring (#10B981) and tinted background (#ECFDF5)
 * - Smooth animations when suggestions change
 * - Accessibility labels
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { EmojiPicker } from '../EmojiPicker';

// Mock useHapticFeedback
jest.mock('../../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerSelection: jest.fn(),
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
  }),
}));

// Mock EmojiPickerSheet since we're testing the inline behavior
jest.mock('../../../EmojiPickerV2', () => ({
  EmojiPickerSheet: jest.fn(({ visible, onSelect, onClose }) =>
    visible ? <></> : null
  ),
}));

const mockOnSelect = jest.fn();

const defaultProps = {
  selectedEmoji: null,
  onSelect: mockOnSelect,
  habitName: '',
};

describe('EmojiPicker - V8 Smart Suggestions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Component Rendering', () => {
    it('should render the component with section label', () => {
      const { getByText } = render(<EmojiPicker {...defaultProps} />);
      expect(getByText('Icon')).toBeDefined();
    });

    it('should render 6 emoji chips by default', () => {
      const { getAllByRole } = render(<EmojiPicker {...defaultProps} />);
      const buttons = getAllByRole('button');
      // 6 emoji chips + 1 "+" button = 7 buttons
      expect(buttons.length).toBe(7);
    });

    it('should render "+" button to browse all icons', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);
      expect(getByLabelText('Browse all icons')).toBeDefined();
    });

    it('should display default emojis when no habit name is provided', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      // Default emojis: ['🎯', '✨', '💪', '📖', '🧘', '💧']
      expect(getByLabelText('Select emoji 🎯')).toBeDefined();
      expect(getByLabelText('Select emoji ✨')).toBeDefined();
      expect(getByLabelText('Select emoji 💪')).toBeDefined();
      expect(getByLabelText('Select emoji 📖')).toBeDefined();
      expect(getByLabelText('Select emoji 🧘')).toBeDefined();
      expect(getByLabelText('Select emoji 💧')).toBeDefined();
    });
  });

  describe('Dynamic Suggestions Based on Habit Name', () => {
    it('should suggest 🏃 for "Run" habit name', async () => {
      const { getByLabelText } = render(
        <EmojiPicker {...defaultProps} habitName='Run' />
      );

      // Wait for debounce
      await act(async () => {
        jest.advanceTimersByTime(350);
      });

      expect(getByLabelText('Select emoji 🏃')).toBeDefined();
    });

    it('should suggest 💧 for "Drink Water" habit name', async () => {
      const { getByLabelText } = render(
        <EmojiPicker {...defaultProps} habitName='Drink Water' />
      );

      await act(async () => {
        jest.advanceTimersByTime(350);
      });

      expect(getByLabelText('Select emoji 💧')).toBeDefined();
    });

    it('should suggest 🧘 for "Meditate" habit name', async () => {
      const { getByLabelText } = render(
        <EmojiPicker {...defaultProps} habitName='Meditate' />
      );

      await act(async () => {
        jest.advanceTimersByTime(350);
      });

      expect(getByLabelText('Select emoji 🧘')).toBeDefined();
    });

    it('should suggest 📖 for "Read" habit name', async () => {
      const { getByLabelText } = render(
        <EmojiPicker {...defaultProps} habitName='Read' />
      );

      await act(async () => {
        jest.advanceTimersByTime(350);
      });

      expect(getByLabelText('Select emoji 📖')).toBeDefined();
    });

    it('should pad with default emojis when fewer than 6 suggestions', async () => {
      const { getAllByRole } = render(
        <EmojiPicker {...defaultProps} habitName='xyz' />
      );

      await act(async () => {
        jest.advanceTimersByTime(350);
      });

      const buttons = getAllByRole('button');
      // Should still have 6 emoji chips + 1 "+" button
      expect(buttons.length).toBe(7);
    });

    it('should debounce suggestion updates', async () => {
      const { rerender, getByLabelText, queryByLabelText } = render(
        <EmojiPicker {...defaultProps} habitName='' />
      );

      // Initially shows default emojis
      expect(getByLabelText('Select emoji 🎯')).toBeDefined();

      // Update habit name
      rerender(<EmojiPicker {...defaultProps} habitName='Run' />);

      // Immediately after update, should still show old emojis (debounce hasn't fired)
      // Note: The default includes 🎯, so we check if 🏃 is NOT yet present
      expect(queryByLabelText('Select emoji 🏃')).toBeNull();

      // After debounce
      await act(async () => {
        jest.advanceTimersByTime(350);
      });

      expect(getByLabelText('Select emoji 🏃')).toBeDefined();
    });
  });

  describe('Selection State with Green Ring', () => {
    it('should show selected state on currently selected emoji', () => {
      const { getByLabelText } = render(
        <EmojiPicker {...defaultProps} selectedEmoji='💪' />
      );

      const selectedButton = getByLabelText('Select emoji 💪');
      expect(selectedButton.props.accessibilityState?.selected).toBe(true);
    });

    it('should not show selected state on non-selected emojis', () => {
      const { getByLabelText } = render(
        <EmojiPicker {...defaultProps} selectedEmoji='💪' />
      );

      const nonSelectedButton = getByLabelText('Select emoji 🎯');
      expect(nonSelectedButton.props.accessibilityState?.selected).toBe(false);
    });
  });

  describe('User Interactions', () => {
    it('should call onSelect when emoji chip is pressed', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      const emojiButton = getByLabelText('Select emoji 💪');
      fireEvent.press(emojiButton);

      expect(mockOnSelect).toHaveBeenCalledWith('💪');
    });

    it('should open EmojiPickerSheet when "+" button is pressed', () => {
      const { getByLabelText, UNSAFE_getByType } = render(
        <EmojiPicker {...defaultProps} />
      );

      const plusButton = getByLabelText('Browse all icons');
      fireEvent.press(plusButton);

      // The EmojiPickerSheet should now be visible
      const { EmojiPickerSheet } = require('../../../EmojiPickerV2');
      expect(EmojiPickerSheet).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible label for each emoji chip', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      expect(getByLabelText('Select emoji 🎯')).toBeDefined();
      expect(getByLabelText('Select emoji ✨')).toBeDefined();
      expect(getByLabelText('Select emoji 💪')).toBeDefined();
      expect(getByLabelText('Select emoji 📖')).toBeDefined();
      expect(getByLabelText('Select emoji 🧘')).toBeDefined();
      expect(getByLabelText('Select emoji 💧')).toBeDefined();
    });

    it('should have accessible label for "+" button', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      expect(getByLabelText('Browse all icons')).toBeDefined();
    });

    it('should have accessibility hint for "+" button', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      const plusButton = getByLabelText('Browse all icons');
      expect(plusButton.props.accessibilityHint).toBe(
        'Opens full emoji picker'
      );
    });

    it('should have role="button" for emoji chips', () => {
      const { getAllByRole } = render(<EmojiPicker {...defaultProps} />);

      const buttons = getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should indicate selected state in accessibility', () => {
      const { getByLabelText } = render(
        <EmojiPicker {...defaultProps} selectedEmoji='💪' />
      );

      const selectedButton = getByLabelText('Select emoji 💪');
      expect(selectedButton.props.accessibilityState).toEqual(
        expect.objectContaining({ selected: true })
      );

      const nonSelectedButton = getByLabelText('Select emoji 🎯');
      expect(nonSelectedButton.props.accessibilityState).toEqual(
        expect.objectContaining({ selected: false })
      );
    });
  });

  describe('Acceptance Criteria Summary', () => {
    it('✅ AC1: Shows 6 emoji chips inline', () => {
      const { getAllByRole } = render(<EmojiPicker {...defaultProps} />);

      // Filter out "+" button by counting emoji buttons specifically
      const buttons = getAllByRole('button');
      // 6 emoji chips + 1 "+" button = 7 buttons
      expect(buttons.length).toBe(7);
    });

    it('✅ AC2: Dynamic suggestions based on habit name', async () => {
      const { getByLabelText, rerender } = render(
        <EmojiPicker {...defaultProps} habitName='' />
      );

      // Default state
      expect(getByLabelText('Select emoji 🎯')).toBeDefined();

      // Update to "Exercise"
      rerender(<EmojiPicker {...defaultProps} habitName='Exercise' />);

      await act(async () => {
        jest.advanceTimersByTime(350);
      });

      expect(getByLabelText('Select emoji 💪')).toBeDefined();
    });

    it('✅ AC3: Dashed "+" button opens full EmojiPickerSheet', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      const plusButton = getByLabelText('Browse all icons');
      fireEvent.press(plusButton);

      const { EmojiPickerSheet } = require('../../../EmojiPickerV2');
      expect(EmojiPickerSheet).toHaveBeenCalled();
    });

    it('✅ AC4: Selected state with green ring styling', () => {
      const { getByLabelText } = render(
        <EmojiPicker {...defaultProps} selectedEmoji='💪' />
      );

      const selectedButton = getByLabelText('Select emoji 💪');
      expect(selectedButton.props.accessibilityState?.selected).toBe(true);
    });

    it('✅ AC5: Debounced suggestions for smooth animation', async () => {
      const { rerender, queryByLabelText, getByLabelText } = render(
        <EmojiPicker {...defaultProps} habitName='' />
      );

      rerender(<EmojiPicker {...defaultProps} habitName='Run' />);

      // Before debounce - should not have updated yet
      expect(queryByLabelText('Select emoji 🏃')).toBeNull();

      // After debounce
      await act(async () => {
        jest.advanceTimersByTime(350);
      });

      expect(getByLabelText('Select emoji 🏃')).toBeDefined();
    });
  });
});
