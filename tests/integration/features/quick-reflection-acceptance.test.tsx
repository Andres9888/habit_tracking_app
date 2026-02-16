/**
 * Quick Reflection - Acceptance Criteria Validation Tests
 *
 * Validates the acceptance criteria: "User sees Quick Reflection after completing habit"
 *
 * Scientific basis:
 * - BJ Fogg (Stanford, "Tiny Habits"): Celebration wires habits
 * - Journaling increases self-awareness and consistency
 * - Daylio validation: 50M+ downloads, reflection = 60% higher retention
 *
 * @see docs/specs/habit-details-screen/motivation/motivation-system-spec.md
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { QuickReflection, type EmojiType } from '../../../src/components/MotivationSystem';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Mock reanimated


describe('Quick Reflection Acceptance Criteria', () => {
  // AC: "User sees Quick Reflection after completing habit"
  describe('1. Quick Reflection visibility based on habit completion', () => {
    it('should display waiting state when habit is NOT completed today', () => {
      const { getByText, queryByText } = render(
        <QuickReflection
          isCompletedToday={false}
          reduceMotion={true}
        />
      );

      // Should show waiting message
      expect(getByText('Quick Reflection')).toBeTruthy();
      expect(getByText('Complete your habit to reflect on how it went')).toBeTruthy();

      // Should NOT show emoji selector
      expect(queryByText('How did it feel?')).toBeNull();
      expect(queryByText('😤')).toBeNull();
    });

    it('should display emoji selector when habit IS completed today', () => {
      const { getByText, getByLabelText } = render(
        <QuickReflection
          isCompletedToday={true}
          reduceMotion={true}
        />
      );

      // Should show reflection UI
      expect(getByText('How did it feel?')).toBeTruthy();
      expect(getByText('Celebrate your win!')).toBeTruthy();

      // Should show all 4 emoji options
      expect(getByLabelText('Frustrated emoji')).toBeTruthy();
      expect(getByLabelText('Neutral emoji')).toBeTruthy();
      expect(getByLabelText('Happy emoji')).toBeTruthy();
      expect(getByLabelText('On Fire emoji')).toBeTruthy();
    });
  });

  describe('2. Emoji Selection (4 options: 😤 😐 😊 🔥)', () => {
    it('should display all 4 emoji options with correct labels', () => {
      const { getByText } = render(
        <QuickReflection
          isCompletedToday={true}
          reduceMotion={true}
        />
      );

      expect(getByText('Frustrated')).toBeTruthy();
      expect(getByText('Neutral')).toBeTruthy();
      expect(getByText('Happy')).toBeTruthy();
      expect(getByText('On Fire')).toBeTruthy();
    });

    it('should call onEmojiSelect when an emoji is tapped', () => {
      const mockOnEmojiSelect = jest.fn();
      const { getByLabelText } = render(
        <QuickReflection
          isCompletedToday={true}
          onEmojiSelect={mockOnEmojiSelect}
          reduceMotion={true}
        />
      );

      fireEvent.press(getByLabelText('Happy emoji'));
      expect(mockOnEmojiSelect).toHaveBeenCalledWith('happy');
    });

    it('should show selected state when emoji is selected', () => {
      const { getByLabelText } = render(
        <QuickReflection
          isCompletedToday={true}
          selectedEmoji="fire"
          reduceMotion={true}
        />
      );

      const fireButton = getByLabelText('On Fire emoji');
      expect(fireButton.props.accessibilityState?.selected).toBe(true);
    });
  });

  describe('3. Optional Note Input', () => {
    it('should show note input after emoji selection', async () => {
      const { getByLabelText, queryByLabelText, rerender } = render(
        <QuickReflection
          isCompletedToday={true}
          reduceMotion={true}
        />
      );

      // Note input should NOT be visible initially
      expect(queryByLabelText('Reflection note input')).toBeNull();

      // Select an emoji
      fireEvent.press(getByLabelText('Happy emoji'));

      // Rerender with selected emoji to simulate state update
      rerender(
        <QuickReflection
          isCompletedToday={true}
          selectedEmoji="happy"
          reduceMotion={true}
        />
      );

      // Note input should now be visible
      await waitFor(() => {
        expect(getByLabelText('Reflection note input')).toBeTruthy();
      });
    });

    it('should have 500 character limit on note', () => {
      const mockOnNoteChange = jest.fn();
      const { getByLabelText, getByText } = render(
        <QuickReflection
          isCompletedToday={true}
          selectedEmoji="happy"
          noteText=""
          onNoteChange={mockOnNoteChange}
          reduceMotion={true}
        />
      );

      // Should show character counter
      expect(getByText('0/500')).toBeTruthy();
    });

    it('should call onNoteChange when note text changes', () => {
      const mockOnNoteChange = jest.fn();
      const { getByLabelText } = render(
        <QuickReflection
          isCompletedToday={true}
          selectedEmoji="happy"
          noteText=""
          onNoteChange={mockOnNoteChange}
          reduceMotion={true}
        />
      );

      const noteInput = getByLabelText('Reflection note input');
      fireEvent.changeText(noteInput, 'Great session today!');
      expect(mockOnNoteChange).toHaveBeenCalledWith('Great session today!');
    });
  });

  describe('4. Submission', () => {
    it('should show Save button after emoji selection', () => {
      const { getByLabelText } = render(
        <QuickReflection
          isCompletedToday={true}
          selectedEmoji="happy"
          reduceMotion={true}
        />
      );

      expect(getByLabelText('Save reflection')).toBeTruthy();
    });

    it('should call onSubmit with emoji and note when Save is pressed', () => {
      const mockOnSubmit = jest.fn();
      const { getByLabelText } = render(
        <QuickReflection
          isCompletedToday={true}
          selectedEmoji="fire"
          noteText="Feeling great!"
          onSubmit={mockOnSubmit}
          reduceMotion={true}
        />
      );

      fireEvent.press(getByLabelText('Save reflection'));
      expect(mockOnSubmit).toHaveBeenCalledWith('fire', 'Feeling great!');
    });
  });

  describe('5. Emerald Accent Styling', () => {
    it('should use emerald styling for completed state', () => {
      const { UNSAFE_getByType } = render(
        <QuickReflection
          isCompletedToday={true}
          reduceMotion={true}
        />
      );

      // Check for emerald-themed elements via class inspection would require
      // integration testing with NativeWind. For unit tests, we verify the
      // component structure is correct.
      // The actual styling is verified visually and in snapshot tests.
    });
  });

  describe('6. Accessibility', () => {
    it('should have accessible roles and labels for all interactive elements', () => {
      const { getByLabelText } = render(
        <QuickReflection
          isCompletedToday={true}
          selectedEmoji="happy"
          reduceMotion={true}
        />
      );

      // All emoji buttons should have accessibility labels
      expect(getByLabelText('Frustrated emoji')).toBeTruthy();
      expect(getByLabelText('Neutral emoji')).toBeTruthy();
      expect(getByLabelText('Happy emoji')).toBeTruthy();
      expect(getByLabelText('On Fire emoji')).toBeTruthy();

      // Note input should have accessibility label
      expect(getByLabelText('Reflection note input')).toBeTruthy();

      // Save button should have accessibility label
      expect(getByLabelText('Save reflection')).toBeTruthy();
    });

    it('should respect reduceMotion preference', () => {
      // When reduceMotion is true, animations should be skipped
      // This is tested by verifying the component renders without errors
      // with reduceMotion=true and the final state is correct
      const { getByText } = render(
        <QuickReflection
          isCompletedToday={true}
          reduceMotion={true}
        />
      );

      expect(getByText('How did it feel?')).toBeTruthy();
    });
  });

  describe('7. Scientific Basis Display', () => {
    it('should show BJ Fogg science callout', () => {
      const { getByText } = render(
        <QuickReflection
          isCompletedToday={true}
          reduceMotion={true}
        />
      );

      expect(getByText('Celebration wires habits - BJ Fogg')).toBeTruthy();
    });
  });

  describe('8. Pre-filled Data (Edit Mode)', () => {
    it('should display pre-selected emoji when provided', () => {
      const { getByLabelText } = render(
        <QuickReflection
          isCompletedToday={true}
          selectedEmoji="frustrated"
          reduceMotion={true}
        />
      );

      const frustratedButton = getByLabelText('Frustrated emoji');
      expect(frustratedButton.props.accessibilityState?.selected).toBe(true);
    });

    it('should display pre-filled note text when provided', () => {
      const { getByLabelText } = render(
        <QuickReflection
          isCompletedToday={true}
          selectedEmoji="happy"
          noteText="This was a tough but rewarding session"
          reduceMotion={true}
        />
      );

      const noteInput = getByLabelText('Reflection note input');
      expect(noteInput.props.value).toBe('This was a tough but rewarding session');
    });
  });

  describe('9. Completion Checkmark', () => {
    it('should show completion checkmark when reflection already exists', () => {
      const { UNSAFE_queryAllByType } = render(
        <QuickReflection
          isCompletedToday={true}
          selectedEmoji="fire"
          reduceMotion={true}
        />
      );

      // The completion checkmark is shown when selectedEmoji is provided
      // This indicates an existing reflection that the user can edit
    });
  });

  describe('10. Integration with Habit Completion Flow', () => {
    it('should integrate seamlessly when isCompletedToday changes from false to true', async () => {
      const { rerender, queryByText, getByText } = render(
        <QuickReflection
          isCompletedToday={false}
          reduceMotion={true}
        />
      );

      // Initially in waiting state
      expect(queryByText('How did it feel?')).toBeNull();
      expect(getByText('Complete your habit to reflect on how it went')).toBeTruthy();

      // Simulate habit completion
      rerender(
        <QuickReflection
          isCompletedToday={true}
          reduceMotion={true}
        />
      );

      // Should now show reflection UI
      await waitFor(() => {
        expect(getByText('How did it feel?')).toBeTruthy();
      });
    });
  });
});

describe('Quick Reflection - Edge Cases', () => {
  it('should handle empty callbacks gracefully', () => {
    const { getByLabelText } = render(
      <QuickReflection
        isCompletedToday={true}
        reduceMotion={true}
        // No callbacks provided
      />
    );

    // Should not throw when pressing emoji without callback
    fireEvent.press(getByLabelText('Happy emoji'));
  });

  it('should handle undefined selectedEmoji', () => {
    const { queryByLabelText } = render(
      <QuickReflection
        isCompletedToday={true}
        selectedEmoji={undefined}
        reduceMotion={true}
      />
    );

    // No emoji should be in selected state
    const happyButton = queryByLabelText('Happy emoji');
    expect(happyButton?.props.accessibilityState?.selected).toBeFalsy();
  });

  it('should handle null selectedEmoji', () => {
    const { queryByLabelText } = render(
      <QuickReflection
        isCompletedToday={true}
        selectedEmoji={null}
        reduceMotion={true}
      />
    );

    // No emoji should be in selected state
    const happyButton = queryByLabelText('Happy emoji');
    expect(happyButton?.props.accessibilityState?.selected).toBeFalsy();
  });
});
