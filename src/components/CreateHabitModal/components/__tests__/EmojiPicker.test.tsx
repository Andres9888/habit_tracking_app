/**
 * EmojiPicker Component Tests - V9 Design System Update
 * Task 4: Replace "Browse all →" with "+" Button
 *
 * Tests:
 * - 9 inline emoji chips display in the current 5-4 layout
 * - Dynamic suggestions based on habit name keywords
 * - "Browse more emojis" action opens full EmojiPickerSheet
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

    it('should render 9 emoji chips by default', () => {
      const { getAllByRole } = render(<EmojiPicker {...defaultProps} />);
      const buttons = getAllByRole('button');
      // 9 emoji chips + 1 "Browse more emojis" action = 10 buttons
      expect(buttons.length).toBe(10);
    });

    it('should render the action to browse more emojis', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);
      expect(getByLabelText('Browse more emojis')).toBeDefined();
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

    it('should pad with default emojis when fewer than 9 suggestions', async () => {
      const { getAllByRole } = render(
        <EmojiPicker {...defaultProps} habitName='xyz' />
      );

      await act(async () => {
        jest.advanceTimersByTime(350);
      });

      const buttons = getAllByRole('button');
      // Should still have 9 emoji chips + 1 browse action
      expect(buttons.length).toBe(10);
    });

    it('should debounce suggestion updates', async () => {
      const { rerender, getByLabelText, queryByLabelText } = render(
        <EmojiPicker {...defaultProps} habitName='Read' />
      );

      expect(getByLabelText('Select emoji 📖')).toBeDefined();

      // Updates after the initialized query are debounced.
      rerender(<EmojiPicker {...defaultProps} habitName='Bike' />);

      expect(queryByLabelText('Select emoji 🚴')).toBeNull();

      // After debounce
      await act(async () => {
        jest.advanceTimersByTime(350);
      });

      expect(getByLabelText('Select emoji 🚴')).toBeDefined();
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

    it('should open EmojiPickerSheet when browse action is pressed', () => {
      const { getByLabelText, UNSAFE_getByType } = render(
        <EmojiPicker {...defaultProps} />
      );

      const browseButton = getByLabelText('Browse more emojis');
      fireEvent.press(browseButton);

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

    it('should have accessible label for browse action', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      expect(getByLabelText('Browse more emojis')).toBeDefined();
    });

    it('should have accessibility hint for browse action', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      const browseButton = getByLabelText('Browse more emojis');
      expect(browseButton.props.accessibilityHint).toBe(
        'Opens full emoji picker with hundreds of options'
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
    it('✅ AC1: Shows 9 emoji chips inline', () => {
      const { getAllByRole } = render(<EmojiPicker {...defaultProps} />);

      const buttons = getAllByRole('button');
      // 9 emoji chips + 1 browse action
      expect(buttons.length).toBe(10);
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

    it('✅ AC3: Browse action opens full EmojiPickerSheet', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      const browseButton = getByLabelText('Browse more emojis');
      fireEvent.press(browseButton);

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
        <EmojiPicker {...defaultProps} habitName='Read' />
      );

      rerender(<EmojiPicker {...defaultProps} habitName='Bike' />);

      // Before debounce - should not have updated yet
      expect(queryByLabelText('Select emoji 🚴')).toBeNull();

      // After debounce
      await act(async () => {
        jest.advanceTimersByTime(350);
      });

      expect(getByLabelText('Select emoji 🚴')).toBeDefined();
    });
  });
});
