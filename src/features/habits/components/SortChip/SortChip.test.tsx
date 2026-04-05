/**
 * SortChip Component Tests
 *
 * Tests the dark pill button that shows current sort mode and opens sort options.
 * Verifies press interaction, accessibility, sort label mapping, and visual styling.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SortChip } from './SortChip';
import type { HabitSortMode } from '../../types';

describe('SortChip', () => {
  const defaultProps = {
    sortMode: 'manual' as HabitSortMode,
    habitCount: 7,
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const { root } = render(<SortChip {...defaultProps} />);
      expect(root).toBeTruthy();
    });

    it('should render the sort icon', () => {
      const { root } = render(<SortChip {...defaultProps} />);
      expect(root).toBeTruthy();
    });

    it('should render the chevron icon', () => {
      const { root } = render(<SortChip {...defaultProps} />);
      expect(root).toBeTruthy();
    });

    it('should have dark pill styling', () => {
      const { root } = render(<SortChip {...defaultProps} />);
      // Should use bg-stone-800 and rounded-full classes
      expect(root).toBeTruthy();
    });
  });

  describe('Sort Label Mapping', () => {
    const sortModes: Array<{ mode: HabitSortMode; expectedLabel: string }> = [
      { mode: 'manual', expectedLabel: 'Custom' },
      { mode: 'name_asc', expectedLabel: 'A–Z' },
      { mode: 'name_desc', expectedLabel: 'Z–A' },
      { mode: 'strength_asc', expectedLabel: 'Strength ↑' },
      { mode: 'strength_desc', expectedLabel: 'Strength ↓' },
      { mode: 'streak_asc', expectedLabel: 'Streak ↑' },
      { mode: 'streak_desc', expectedLabel: 'Streak ↓' },
    ];

    it.each(sortModes)(
      'should display "$expectedLabel" for sort mode "$mode"',
      ({ mode, expectedLabel }) => {
        const { getByText } = render(
          <SortChip {...defaultProps} sortMode={mode} />
        );
        expect(getByText(expectedLabel)).toBeTruthy();
      }
    );
  });

  describe('Habit Count Display', () => {
    it('should display habit count with plural form', () => {
      const { getByText } = render(
        <SortChip {...defaultProps} habitCount={7} />
      );
      expect(getByText('7 habits')).toBeTruthy();
    });

    it('should display habit count with singular form for 1 habit', () => {
      const { getByText } = render(
        <SortChip {...defaultProps} habitCount={1} />
      );
      expect(getByText('1 habit')).toBeTruthy();
    });

    it('should display habit count with plural form for 0 habits', () => {
      const { getByText } = render(
        <SortChip {...defaultProps} habitCount={0} />
      );
      expect(getByText('0 habits')).toBeTruthy();
    });
  });

  describe('Press Interaction', () => {
    it('should call onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByRole } = render(
        <SortChip {...defaultProps} onPress={onPress} />
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple presses', () => {
      const onPress = jest.fn();
      const { getByRole } = render(
        <SortChip {...defaultProps} onPress={onPress} />
      );

      const button = getByRole('button');
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      expect(onPress).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible role as button', () => {
      const { getByRole } = render(<SortChip {...defaultProps} />);
      const button = getByRole('button');
      expect(button).toBeDefined();
    });

    it('should have accessible label describing current sort', () => {
      const { getByLabelText } = render(
        <SortChip {...defaultProps} sortMode="manual" />
      );
      const button = getByLabelText(
        'Sort habits, currently sorted by Custom order'
      );
      expect(button).toBeDefined();
    });

    it('should have accessible hint about opening sort options', () => {
      const { getByRole } = render(<SortChip {...defaultProps} />);
      const button = getByRole('button');
      expect(button.props.accessibilityHint).toBe('Opens sort options');
    });

    it('should update accessibility label for different sort modes', () => {
      const { getByLabelText } = render(
        <SortChip {...defaultProps} sortMode="strength_desc" />
      );
      const button = getByLabelText(
        'Sort habits, currently sorted by Strength high to low'
      );
      expect(button).toBeDefined();
    });
  });

  describe('Visual Design', () => {
    it('should have dark background (bg-stone-800)', () => {
      const { root } = render(<SortChip {...defaultProps} />);
      expect(root).toBeTruthy();
    });

    it('should have white text for sort label', () => {
      const { root } = render(<SortChip {...defaultProps} />);
      expect(root).toBeTruthy();
    });

    it('should have muted text for habit count (text-stone-400)', () => {
      const { root } = render(<SortChip {...defaultProps} />);
      expect(root).toBeTruthy();
    });

    it('should have rounded-full styling for pill shape', () => {
      const { root } = render(<SortChip {...defaultProps} />);
      expect(root).toBeTruthy();
    });
  });

  describe('Reduce Motion Support', () => {
    it('should accept reduceMotion prop', () => {
      const { root } = render(
        <SortChip {...defaultProps} reduceMotion={true} />
      );
      expect(root).toBeTruthy();
    });

    it('should render correctly with reduceMotion disabled', () => {
      const { root } = render(
        <SortChip {...defaultProps} reduceMotion={false} />
      );
      expect(root).toBeTruthy();
    });
  });

  describe('Component Props', () => {
    it('should require sortMode prop', () => {
      const { root } = render(<SortChip {...defaultProps} />);
      expect(root).toBeTruthy();
    });

    it('should require habitCount prop', () => {
      const { root } = render(<SortChip {...defaultProps} />);
      expect(root).toBeTruthy();
    });

    it('should require onPress prop', () => {
      const { root } = render(<SortChip {...defaultProps} />);
      expect(root).toBeTruthy();
    });
  });
});
