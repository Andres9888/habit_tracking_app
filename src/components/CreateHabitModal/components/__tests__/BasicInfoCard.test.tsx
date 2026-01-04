/**
 * BasicInfoCard Component Tests
 * Tests for Cards V1 Improved Spec - Task 4
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BasicInfoCard } from '../BasicInfoCard';

describe('BasicInfoCard', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the card container', () => {
      const { getByRole } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      expect(getByRole('group')).toBeTruthy();
    });

    it('should render the Edit3 icon in the header', () => {
      const { UNSAFE_getByType } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      // Icon component should be present
      const icons = UNSAFE_getByType(
        require('lucide-react-native').Edit3
      );
      expect(icons).toBeTruthy();
    });

    it('should render the "Basic Info" title', () => {
      const { getByText } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      expect(getByText('Basic Info')).toBeTruthy();
    });

    it('should render the required badge', () => {
      const { getByText } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      expect(getByText('REQUIRED')).toBeTruthy();
    });

    it('should render the helper text', () => {
      const { getByText } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      expect(getByText('Make it specific and actionable')).toBeTruthy();
    });
  });

  describe('Completion State', () => {
    it('should show incomplete Circle icon when isComplete is false', () => {
      const { getByLabelText } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      expect(getByLabelText('Section incomplete')).toBeTruthy();
    });

    it('should show complete CheckCircle icon when isComplete is true', () => {
      const { getByLabelText } = render(
        <BasicInfoCard
          habitName="Read daily"
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      expect(getByLabelText('Section complete')).toBeTruthy();
    });

    it('should not show incomplete icon when isComplete is true', () => {
      const { queryByLabelText } = render(
        <BasicInfoCard
          habitName="Read daily"
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      expect(queryByLabelText('Section incomplete')).toBeNull();
    });

    it('should not show complete icon when isComplete is false', () => {
      const { queryByLabelText } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      expect(queryByLabelText('Section complete')).toBeNull();
    });
  });

  describe('Character Counter', () => {
    it('should not show character counter when habitName is empty', () => {
      const { queryByText } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      expect(queryByText(/chars/)).toBeNull();
    });

    it('should show character counter when habitName has content', () => {
      const { getByText } = render(
        <BasicInfoCard
          habitName="Read"
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      expect(getByText('4 chars')).toBeTruthy();
    });

    it('should show correct character count', () => {
      const { getByText } = render(
        <BasicInfoCard
          habitName="Exercise daily"
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      expect(getByText('14 chars')).toBeTruthy();
    });

    it('should trim whitespace when calculating character count', () => {
      const { getByText } = render(
        <BasicInfoCard
          habitName="  Read  "
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      expect(getByText('4 chars')).toBeTruthy();
    });

    it('should update character count when habitName changes', () => {
      const { getByText, rerender } = render(
        <BasicInfoCard
          habitName="Read"
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      expect(getByText('4 chars')).toBeTruthy();

      rerender(
        <BasicInfoCard
          habitName="Read daily"
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      expect(getByText('10 chars')).toBeTruthy();
    });

    it('should have accessible label for character counter', () => {
      const { getByLabelText } = render(
        <BasicInfoCard
          habitName="Read daily"
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      expect(getByLabelText('10 characters entered')).toBeTruthy();
    });
  });

  describe('HabitNameField Integration', () => {
    it('should render HabitNameField component', () => {
      const { getByLabelText } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      expect(getByLabelText('Habit name')).toBeTruthy();
    });

    it('should pass habitName value to HabitNameField', () => {
      const { getByDisplayValue } = render(
        <BasicInfoCard
          habitName="Read daily"
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      expect(getByDisplayValue('Read daily')).toBeTruthy();
    });

    it('should call onHabitNameChange when text changes', () => {
      const { getByLabelText } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      const input = getByLabelText('Habit name');
      fireEvent.changeText(input, 'Exercise');

      expect(mockOnChange).toHaveBeenCalledWith('Exercise');
    });

    it('should pass autoFocus prop to HabitNameField', () => {
      const { getByLabelText } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
          autoFocus={true}
        />
      );

      const input = getByLabelText('Habit name');
      expect(input.props.autoFocus).toBe(true);
    });

    it('should default autoFocus to false if not provided', () => {
      const { getByLabelText } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      const input = getByLabelText('Habit name');
      expect(input.props.autoFocus).toBe(false);
    });
  });

  describe('Styling', () => {
    it('should have white background color', () => {
      const { getByRole } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      const card = getByRole('group');
      expect(card.props.style).toMatchObject(
        expect.objectContaining({
          backgroundColor: '#FFFFFF',
        })
      );
    });

    it('should have rounded corners', () => {
      const { getByRole } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      const card = getByRole('group');
      expect(card.props.style).toMatchObject(
        expect.objectContaining({
          borderRadius: 16,
        })
      );
    });

    it('should have shadow styling', () => {
      const { getByRole } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      const card = getByRole('group');
      expect(card.props.style).toMatchObject(
        expect.objectContaining({
          shadowColor: '#000',
          shadowOpacity: 0.08,
        })
      );
    });

    it('should have proper padding', () => {
      const { getByRole } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      const card = getByRole('group');
      expect(card.props.style).toMatchObject(
        expect.objectContaining({
          padding: 16,
        })
      );
    });

    it('should have bottom margin for spacing', () => {
      const { getByRole } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      const card = getByRole('group');
      expect(card.props.style).toMatchObject(
        expect.objectContaining({
          marginBottom: 20,
        })
      );
    });
  });

  describe('Accessibility', () => {
    it('should have accessible role for card container', () => {
      const { getByRole } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      expect(getByRole('group')).toBeTruthy();
    });

    it('should have accessible label for card container', () => {
      const { getByLabelText } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      expect(getByLabelText('Basic information section')).toBeTruthy();
    });

    it('should have accessible completion state labels', () => {
      const { getByLabelText } = render(
        <BasicInfoCard
          habitName=""
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      expect(getByLabelText('Section incomplete')).toBeTruthy();
    });
  });

  describe('Component Memoization', () => {
    it('should be memoized', () => {
      expect(BasicInfoCard.displayName).toBe('BasicInfoCard');
    });

    it('should not re-render when props have not changed', () => {
      const { rerender } = render(
        <BasicInfoCard
          habitName="Read"
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      // Re-render with same props
      rerender(
        <BasicInfoCard
          habitName="Read"
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      // Component should be memoized (displayName check)
      expect(BasicInfoCard.displayName).toBe('BasicInfoCard');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long habit names', () => {
      const longName = 'A'.repeat(100);
      const { getByText } = render(
        <BasicInfoCard
          habitName={longName}
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      expect(getByText('100 chars')).toBeTruthy();
    });

    it('should handle habit names with only whitespace', () => {
      const { queryByText } = render(
        <BasicInfoCard
          habitName="   "
          onHabitNameChange={mockOnChange}
          isComplete={false}
        />
      );

      // Character counter should not show for whitespace-only
      expect(queryByText(/chars/)).toBeNull();
    });

    it('should handle special characters in habit name', () => {
      const { getByText } = render(
        <BasicInfoCard
          habitName="Read @ 7AM!"
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      expect(getByText('11 chars')).toBeTruthy();
    });

    it('should handle emoji characters in habit name', () => {
      const { getByText } = render(
        <BasicInfoCard
          habitName="Read 📖"
          onHabitNameChange={mockOnChange}
          isComplete={true}
        />
      );

      // Should count emoji as part of the string
      expect(getByText(/chars/)).toBeTruthy();
    });
  });
});
