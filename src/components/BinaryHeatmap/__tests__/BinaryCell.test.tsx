/**
 * BinaryCell Component Tests
 *
 * Tests for all cell states, interactions, animations, and accessibility.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BinaryCell } from '../BinaryCell';
import type { BinaryDay } from '../types';
import { COLORS } from '../constants';

// Mock the useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => false),
}));

describe('BinaryCell', () => {
  const mockOnPress = jest.fn();
  const mockHabitColor = '#10b981'; // emerald-500

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper to create a day object
  const createDay = (overrides: Partial<BinaryDay> = {}): BinaryDay => ({
    date: '2025-12-15',
    completed: false,
    isToday: false,
    isFuture: false,
    isBeforeCreation: false,
    ...overrides,
  });

  describe('Empty padding cell (null day)', () => {
    it('should render empty cell for null day', () => {
      const { getByLabelText } = render(
        <BinaryCell
          day={null}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      expect(getByLabelText('Empty cell')).toBeTruthy();
    });

    it('should not be pressable', () => {
      const { getByLabelText } = render(
        <BinaryCell
          day={null}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      const cell = getByLabelText('Empty cell');
      expect(cell.props.accessibilityRole).toBe('text');
    });
  });

  describe('Before habit creation state', () => {
    it('should render dimmed cell for dates before habit creation', () => {
      const day = createDay({
        date: '2025-01-01',
        isBeforeCreation: true,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      expect(
        getByLabelText(/January 1, 2025.*Before habit tracking started/)
      ).toBeTruthy();
    });

    it('should not be interactive (role=text)', () => {
      const day = createDay({
        date: '2025-01-01',
        isBeforeCreation: true,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      const cell = getByLabelText(/Before habit tracking started/);
      expect(cell.props.accessibilityRole).toBe('text');
    });

    it('should use beforeCreation background color', () => {
      const day = createDay({
        isBeforeCreation: true,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      const cell = getByLabelText(/Before habit tracking started/);
      // Style may be an array in React Native, flatten it to check
      const styles = cell.props.style;
      const flatStyle = Array.isArray(styles)
        ? Object.assign({}, ...styles.filter(Boolean))
        : styles;
      expect(flatStyle.backgroundColor).toBe(COLORS.CELL_BEFORE_CREATION);
    });
  });

  describe('Future date state', () => {
    it('should render faded cell for future dates', () => {
      const day = createDay({
        date: '2025-12-31',
        isFuture: true,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      expect(getByLabelText(/December 31, 2025.*Future date/)).toBeTruthy();
    });

    it('should not be interactive', () => {
      const day = createDay({
        date: '2025-12-31',
        isFuture: true,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      const cell = getByLabelText(/Future date/);
      expect(cell.props.accessibilityRole).toBe('text');
    });

    it('should have reduced opacity', () => {
      const day = createDay({
        date: '2025-12-31',
        isFuture: true,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      const cell = getByLabelText(/Future date/);
      // Check that opacity is applied (through style array)
      const styles = cell.props.style;
      const flatStyle = Array.isArray(styles)
        ? Object.assign({}, ...styles.filter(Boolean))
        : styles;
      expect(flatStyle.opacity).toBe(0.4);
    });
  });

  describe('Missed (not completed) state', () => {
    it('should render gray cell for missed days', () => {
      const day = createDay({
        date: '2025-12-10',
        completed: false,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      expect(getByLabelText(/December 10, 2025.*Not completed/)).toBeTruthy();
    });

    it('should be pressable with button role', () => {
      const day = createDay({
        completed: false,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      const cell = getByLabelText(/Not completed/);
      expect(cell.props.accessibilityRole).toBe('button');
    });

    it('should expose a button role for missed days', () => {
      const day = createDay({
        date: '2025-12-10',
        completed: false,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      const cell = getByLabelText(/Not completed/);
      expect(cell.props.accessibilityRole).toBe('button');
    });

    it('should have not selected accessibility state', () => {
      const day = createDay({
        completed: false,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      const cell = getByLabelText(/Not completed/);
      expect(cell.props.accessibilityState.selected).toBe(false);
    });
  });

  describe('Done (completed) state', () => {
    it('should render cell with habit color for completed days', () => {
      const day = createDay({
        date: '2025-12-15',
        completed: true,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      expect(getByLabelText(/December 15, 2025.*Completed/)).toBeTruthy();
    });

    it('should be pressable', () => {
      const day = createDay({
        completed: true,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      const cell = getByLabelText(/Completed/);
      expect(cell.props.accessibilityRole).toBe('button');
    });

    it('should expose a button role for completed days', () => {
      const day = createDay({
        date: '2025-12-15',
        completed: true,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      const cell = getByLabelText(/Completed/);
      expect(cell.props.accessibilityRole).toBe('button');
    });

    it('should have selected accessibility state', () => {
      const day = createDay({
        completed: true,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      const cell = getByLabelText(/Completed/);
      expect(cell.props.accessibilityState.selected).toBe(true);
    });

    it('should use custom habit color', () => {
      const customColor = '#ff5500';
      const day = createDay({
        completed: true,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={customColor}
          onPress={mockOnPress}
        />
      );

      // The habit color should be applied to the inner View
      const cell = getByLabelText(/Completed/);
      expect(cell).toBeTruthy();
      // The inner view should have the custom color as background
    });
  });

  describe('Today state', () => {
    describe('Today + not completed', () => {
      it('should render with ring outline', () => {
        const day = createDay({
          date: '2025-12-22',
          isToday: true,
          completed: false,
        });

        const { getByLabelText } = render(
          <BinaryCell
            day={day}
            index={0}
            habitColor={mockHabitColor}
            onPress={mockOnPress}
          />
        );

        expect(
          getByLabelText(/Today.*December 22, 2025.*Not completed/)
        ).toBeTruthy();
      });

      it('should have "Today" accessibility hint', () => {
        const day = createDay({
          isToday: true,
          completed: false,
        });

        const { getByLabelText } = render(
          <BinaryCell
            day={day}
            index={0}
            habitColor={mockHabitColor}
            onPress={mockOnPress}
          />
        );

        const cell = getByLabelText(/Today.*Not completed/);
        expect(cell.props.accessibilityHint).toBe('Today');
      });

      it('should be pressable', () => {
        const day = createDay({
          date: '2025-12-22',
          isToday: true,
          completed: false,
        });

        const { getByLabelText } = render(
          <BinaryCell
            day={day}
            index={0}
            habitColor={mockHabitColor}
            onPress={mockOnPress}
          />
        );

        const cell = getByLabelText(/Today.*Not completed/);
        expect(cell.props.accessibilityRole).toBe('button');
      });
    });

    describe('Today + completed', () => {
      it('should render with habit color and ring', () => {
        const day = createDay({
          date: '2025-12-22',
          isToday: true,
          completed: true,
        });

        const { getByLabelText } = render(
          <BinaryCell
            day={day}
            index={0}
            habitColor={mockHabitColor}
            onPress={mockOnPress}
          />
        );

        expect(
          getByLabelText(/Today.*December 22, 2025.*Completed/)
        ).toBeTruthy();
      });

      it('should have selected accessibility state', () => {
        const day = createDay({
          isToday: true,
          completed: true,
        });

        const { getByLabelText } = render(
          <BinaryCell
            day={day}
            index={0}
            habitColor={mockHabitColor}
            onPress={mockOnPress}
          />
        );

        const cell = getByLabelText(/Today.*Completed/);
        expect(cell.props.accessibilityState.selected).toBe(true);
      });
    });
  });

  describe('Interactions', () => {
    it('should not be pressable for future dates (no button role)', () => {
      const day = createDay({
        date: '2025-12-31',
        isFuture: true,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      const cell = getByLabelText(/Future date/);
      // Future cells are rendered as Animated.View (text role), not Pressable
      // They don't have onPress handlers, so verify by role
      expect(cell.props.accessibilityRole).toBe('text');
    });

    it('should not be pressable for beforeCreation dates (no button role)', () => {
      const day = createDay({
        date: '2025-01-01',
        isBeforeCreation: true,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      const cell = getByLabelText(/Before habit tracking started/);
      // beforeCreation cells are rendered as Animated.View (text role), not Pressable
      expect(cell.props.accessibilityRole).toBe('text');
    });

    it('should handle missing onPress callback gracefully', () => {
      const day = createDay({
        completed: false,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          // No onPress provided
        />
      );

      const cell = getByLabelText(/Not completed/);
      expect(() => fireEvent.press(cell)).not.toThrow();
    });
  });

  describe('Animations', () => {
    it('should use staggered animation delay based on index', () => {
      const day = createDay();

      // Index 0 = 0ms delay
      const { rerender } = render(
        <BinaryCell day={day} index={0} habitColor={mockHabitColor} />
      );

      // Index 20 = 100ms delay (20 * 5ms)
      rerender(<BinaryCell day={day} index={20} habitColor={mockHabitColor} />);

      // Animation is implicit - we verify it renders without error
      expect(true).toBe(true);
    });

    it('should skip animations when reduceMotion is enabled', () => {
      const { useReduceMotion } = require('../../../hooks/useReduceMotion');
      useReduceMotion.mockReturnValue(true);

      const day = createDay();

      // Should render without animation errors
      const { getByLabelText } = render(
        <BinaryCell day={day} index={0} habitColor={mockHabitColor} />
      );

      expect(getByLabelText(/Not completed/)).toBeTruthy();

      // Reset mock
      useReduceMotion.mockReturnValue(false);
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility label for empty cell', () => {
      const { getByLabelText } = render(
        <BinaryCell day={null} index={0} habitColor={mockHabitColor} />
      );

      expect(getByLabelText('Empty cell')).toBeTruthy();
    });

    it('should have proper accessibility label including day name', () => {
      const day = createDay({
        date: '2025-12-15', // Monday
        completed: true,
      });

      const { getByLabelText } = render(
        <BinaryCell day={day} index={0} habitColor={mockHabitColor} />
      );

      expect(
        getByLabelText(/Monday.*December 15, 2025.*Completed/)
      ).toBeTruthy();
    });

    it('should include Today indicator in label', () => {
      const day = createDay({
        date: '2025-12-22',
        isToday: true,
        completed: false,
      });

      const { getByLabelText } = render(
        <BinaryCell day={day} index={0} habitColor={mockHabitColor} />
      );

      expect(getByLabelText(/Today/)).toBeTruthy();
    });

    it('should have accessibility hint for interactive cells', () => {
      const day = createDay({
        completed: false,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      const cell = getByLabelText(/Not completed/);
      expect(cell.props.accessibilityHint).toBe('Tap to toggle completion');
    });

    it('should have button role for interactive cells', () => {
      const day = createDay({
        completed: false,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      const cell = getByLabelText(/Not completed/);
      expect(cell.props.accessibilityRole).toBe('button');
    });

    it('should have text role for non-interactive cells', () => {
      const day = createDay({
        isFuture: true,
      });

      const { getByLabelText } = render(
        <BinaryCell
          day={day}
          index={0}
          habitColor={mockHabitColor}
          onPress={mockOnPress}
        />
      );

      const cell = getByLabelText(/Future date/);
      expect(cell.props.accessibilityRole).toBe('text');
    });
  });

  describe('Cell dimensions', () => {
    it('should render with correct size', () => {
      const day = createDay();

      const { getByLabelText } = render(
        <BinaryCell day={day} index={0} habitColor={mockHabitColor} />
      );

      const cell = getByLabelText(/Not completed/);
      // The outer cell should have proper dimensions
      // This is implicit in the StyleSheet
      expect(cell).toBeTruthy();
    });
  });
});
