/**
 * SuggestionChips Component Tests
 *
 * Tests for the time-aware suggestion chips:
 * - Renders correct number of chips
 * - Shows time context label
 * - Uses time-based suggestions
 * - Selection state works correctly
 * - Accessibility attributes are correct
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import {
  CHIP_SUGGESTIONS_BY_TIME,
  getChipSuggestionsForTime,
  getChipSuggestionsLabel,
} from '../chipSuggestions';
import { SuggestionChips } from '../SuggestionChips';
import { TimePeriod } from '../types';

// Mock the haptic feedback hook to avoid issues with expo-haptics in tests
jest.mock('../../../../../hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    triggerSelection: jest.fn(),
    triggerSuccess: jest.fn(),
    triggerLight: jest.fn(),
    triggerMedium: jest.fn(),
    triggerHeavy: jest.fn(),
  }),
}));

describe('SuggestionChips', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Chip Rendering', () => {
    const timePeriods: TimePeriod[] = [
      'morning',
      'afternoon',
      'evening',
      'night',
    ];

    timePeriods.forEach((period) => {
      describe(`${period} time period`, () => {
        it('should render 5 chips', () => {
          const suggestions = getChipSuggestionsForTime(period);
          const { getByText } = render(
            <SuggestionChips
              selectedIndex={null}
              onSelect={mockOnSelect}
              timePeriod={period}
            />
          );

          suggestions.forEach((chip) => {
            expect(getByText(chip.label)).toBeTruthy();
          });
        });

        it('should show time context label', () => {
          const expectedLabel = getChipSuggestionsLabel(period);
          const { getByText } = render(
            <SuggestionChips
              selectedIndex={null}
              onSelect={mockOnSelect}
              timePeriod={period}
            />
          );

          expect(getByText(expectedLabel)).toBeTruthy();
        });

        it('should render chip emojis', () => {
          const suggestions = getChipSuggestionsForTime(period);
          const { getByText } = render(
            <SuggestionChips
              selectedIndex={null}
              onSelect={mockOnSelect}
              timePeriod={period}
            />
          );

          suggestions.forEach((chip) => {
            expect(getByText(chip.emoji)).toBeTruthy();
          });
        });
      });
    });
  });

  describe('Time Label Visibility', () => {
    it('should show time label by default', () => {
      const { getByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={mockOnSelect}
          timePeriod='morning'
        />
      );

      expect(getByText('Suggested for morning')).toBeTruthy();
    });

    it('should hide time label when showTimeLabel is false', () => {
      const { queryByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={mockOnSelect}
          timePeriod='morning'
          showTimeLabel={false}
        />
      );

      expect(queryByText('Suggested for morning')).toBeNull();
    });
  });

  describe('Selection', () => {
    it('should call onSelect with chip index and data when pressed', () => {
      const { getByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={mockOnSelect}
          timePeriod='morning'
        />
      );

      const firstChip = CHIP_SUGGESTIONS_BY_TIME.morning[0];
      fireEvent.press(getByText(firstChip.label));

      expect(mockOnSelect).toHaveBeenCalledWith(0, firstChip);
    });

    it('should pass correct index for second row chips', () => {
      const { getByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={mockOnSelect}
          timePeriod='morning'
        />
      );

      // Fourth chip (index 3) is in the second row
      const fourthChip = CHIP_SUGGESTIONS_BY_TIME.morning[3];
      fireEvent.press(getByText(fourthChip.label));

      expect(mockOnSelect).toHaveBeenCalledWith(3, fourthChip);
    });

    it('should pass correct index for fifth chip', () => {
      const { getByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={mockOnSelect}
          timePeriod='morning'
        />
      );

      // Fifth chip (index 4) is the last chip in second row
      const fifthChip = CHIP_SUGGESTIONS_BY_TIME.morning[4];
      fireEvent.press(getByText(fifthChip.label));

      expect(mockOnSelect).toHaveBeenCalledWith(4, fifthChip);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible container', () => {
      const { getByLabelText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={mockOnSelect}
          timePeriod='morning'
        />
      );

      expect(
        getByLabelText('Suggested for morning. 5 habit suggestions.')
      ).toBeTruthy();
    });

    it('should have correct button role on chips', () => {
      const { getAllByRole } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={mockOnSelect}
          timePeriod='morning'
        />
      );

      // Should find all 5 chip buttons
      expect(getAllByRole('button')).toHaveLength(5);
    });

    it('should mark selected chip with selected state', () => {
      const { getByLabelText } = render(
        <SuggestionChips
          selectedIndex={0}
          onSelect={mockOnSelect}
          timePeriod='morning'
        />
      );

      const firstChip = CHIP_SUGGESTIONS_BY_TIME.morning[0];
      const chip = getByLabelText(
        `Select ${firstChip.fullName}, morning suggestion`
      );
      expect(chip.props.accessibilityState.selected).toBe(true);
    });

    it('should include time period in chip accessibility label', () => {
      const { getByLabelText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={mockOnSelect}
          timePeriod='evening'
        />
      );

      const firstChip = CHIP_SUGGESTIONS_BY_TIME.evening[0];
      expect(
        getByLabelText(`Select ${firstChip.fullName}, evening suggestion`)
      ).toBeTruthy();
    });

    it('should include accessibility hint with habit name', () => {
      const { getByLabelText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={mockOnSelect}
          timePeriod='morning'
        />
      );

      const firstChip = CHIP_SUGGESTIONS_BY_TIME.morning[0];
      const chip = getByLabelText(
        `Select ${firstChip.fullName}, morning suggestion`
      );
      expect(chip.props.accessibilityHint).toBe(
        `Adds ${firstChip.fullName} as your new habit`
      );
    });
  });

  describe('Time Period Auto-Detection', () => {
    it('should auto-detect time period when timePeriod prop is not provided', () => {
      const { queryByText } = render(
        <SuggestionChips selectedIndex={null} onSelect={mockOnSelect} />
      );

      // Should find one of the four time period labels
      const hasTimeLabel =
        queryByText('Suggested for morning') !== null ||
        queryByText('Suggested for afternoon') !== null ||
        queryByText('Suggested for evening') !== null ||
        queryByText('Suggested for night') !== null;

      expect(hasTimeLabel).toBe(true);
    });
  });

  describe('Chip Content', () => {
    it('should display correct morning suggestions', () => {
      const { getByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={mockOnSelect}
          timePeriod='morning'
        />
      );

      expect(getByText('Water')).toBeTruthy();
      expect(getByText('Meditate')).toBeTruthy();
      expect(getByText('Journal')).toBeTruthy();
      expect(getByText('Exercise')).toBeTruthy();
      expect(getByText('Breakfast')).toBeTruthy();
    });

    it('should display correct afternoon suggestions', () => {
      const { getByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={mockOnSelect}
          timePeriod='afternoon'
        />
      );

      expect(getByText('Walk')).toBeTruthy();
      expect(getByText('Hydrate')).toBeTruthy();
      expect(getByText('Stretch')).toBeTruthy();
      expect(getByText('Snack')).toBeTruthy();
      expect(getByText('Break')).toBeTruthy();
    });

    it('should display correct evening suggestions', () => {
      const { getByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={mockOnSelect}
          timePeriod='evening'
        />
      );

      expect(getByText('Read')).toBeTruthy();
      expect(getByText('Wind down')).toBeTruthy();
      expect(getByText('Reflect')).toBeTruthy();
      expect(getByText('No screens')).toBeTruthy();
      expect(getByText('Tea')).toBeTruthy();
    });

    it('should display correct night suggestions', () => {
      const { getByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={mockOnSelect}
          timePeriod='night'
        />
      );

      expect(getByText('Sleep prep')).toBeTruthy();
      expect(getByText('Phone away')).toBeTruthy();
      expect(getByText('Breathe')).toBeTruthy();
      expect(getByText('Read')).toBeTruthy();
      expect(getByText('Gratitude')).toBeTruthy();
    });
  });

  describe('Layout', () => {
    it('should render chips in 3-2 formation (5 chips total)', () => {
      // The component uses a 3-2 pyramid layout:
      // Row 1: 3 chips (indexes 0, 1, 2)
      // Row 2: 2 chips (indexes 3, 4)
      const suggestions = getChipSuggestionsForTime('morning');

      const { getByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={mockOnSelect}
          timePeriod='morning'
        />
      );

      // Verify all 5 chips are rendered
      expect(suggestions).toHaveLength(5);
      suggestions.forEach((chip) => {
        expect(getByText(chip.label)).toBeTruthy();
      });
    });
  });
});
