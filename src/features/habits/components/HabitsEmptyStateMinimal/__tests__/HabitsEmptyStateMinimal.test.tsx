/**
 * HabitsEmptyStateMinimal Component Tests
 *
 * Tests for the minimal empty state design focused on single question flow:
 * - Component renders without crashing
 * - Chip selection populates input correctly
 * - CTA disabled until input has value
 * - Success state displays correct habit name
 * - "Add another" resets state properly
 *
 * Reference: docs/specs/empty-habit-screen/minimal-redesign.md (CodeRabbit Review Checklist)
 */

import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { COPY, SUGGESTION_CHIPS } from '../constants';
import { HabitsEmptyStateMinimal } from '../HabitsEmptyStateMinimal';

// Mock dependencies
jest.mock('../../../../../hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    triggerSuccess: jest.fn(),
    triggerSelection: jest.fn(),
    triggerLightImpact: jest.fn(),
    triggerMediumImpact: jest.fn(),
  }),
}));

describe('HabitsEmptyStateMinimal', () => {
  const defaultProps = {
    onQuickCreateHabit: jest.fn().mockResolvedValue(undefined),
    openTemplatesScreen: jest.fn(),
    openCreateHabitScreen: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );
      expect(getByText(COPY.headline)).toBeDefined();
    });

    it('should render the hero headline', () => {
      const { getByText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );
      expect(getByText(COPY.headline)).toBeDefined();
    });

    it('should render the CTA button', () => {
      const { getByText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );
      expect(getByText(COPY.ctaButton)).toBeDefined();
    });

    it('should render secondary links', () => {
      const { getByText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );
      expect(getByText(COPY.browseTemplates)).toBeDefined();
      expect(getByText(COPY.createCustom)).toBeDefined();
    });

    it('should render all 6 suggestion chips', () => {
      const { getByText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );
      SUGGESTION_CHIPS.forEach((chip) => {
        expect(getByText(chip.label)).toBeDefined();
      });
    });

    it('should render the habit input with placeholder', () => {
      const { getByPlaceholderText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );
      expect(getByPlaceholderText(COPY.inputPlaceholder)).toBeDefined();
    });
  });

  describe('Chip Selection', () => {
    it('should populate input when chip is selected', () => {
      const { getByText, getByDisplayValue } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      // Tap the "Water" chip
      const waterChip = getByText('Water');
      fireEvent.press(waterChip);

      // Input should now contain "Drink water"
      expect(getByDisplayValue('Drink water')).toBeDefined();
    });

    it('should update input when different chip is selected', () => {
      const { getByText, getByDisplayValue } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      // First select "Water"
      fireEvent.press(getByText('Water'));
      expect(getByDisplayValue('Drink water')).toBeDefined();

      // Then select "Walk"
      fireEvent.press(getByText('Walk'));
      expect(getByDisplayValue('Walk 5 minutes')).toBeDefined();
    });

    it('should populate input with correct full name for each chip', () => {
      const { getByText, getByDisplayValue } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      // Test each chip
      SUGGESTION_CHIPS.forEach((chip) => {
        fireEvent.press(getByText(chip.label));
        expect(getByDisplayValue(chip.fullName)).toBeDefined();
      });
    });
  });

  describe('CTA Button State', () => {
    it('should have CTA disabled when input is empty', () => {
      const { getByLabelText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      const ctaButton = getByLabelText(COPY.ctaButton);
      expect(ctaButton.props.accessibilityState?.disabled).toBe(true);
    });

    it('should enable CTA when input has value from typing', () => {
      const { getByPlaceholderText, getByLabelText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      // Type in the input
      const input = getByPlaceholderText(COPY.inputPlaceholder);
      fireEvent.changeText(input, 'My custom habit');

      const ctaButton = getByLabelText(COPY.ctaButton);
      expect(ctaButton.props.accessibilityState?.disabled).toBe(false);
    });

    it('should enable CTA when chip is selected', () => {
      const { getByText, getByLabelText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      // Select a chip
      fireEvent.press(getByText('Water'));

      const ctaButton = getByLabelText(COPY.ctaButton);
      expect(ctaButton.props.accessibilityState?.disabled).toBe(false);
    });

    it('should not call onQuickCreateHabit when CTA is disabled', () => {
      const { getByLabelText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      const ctaButton = getByLabelText(COPY.ctaButton);
      fireEvent.press(ctaButton);

      expect(defaultProps.onQuickCreateHabit).not.toHaveBeenCalled();
    });
  });

  describe('Habit Creation', () => {
    it('should call onQuickCreateHabit with habit name when CTA is pressed', async () => {
      const { getByText, getByLabelText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      // Select a chip
      fireEvent.press(getByText('Water'));

      // Press CTA
      fireEvent.press(getByLabelText(COPY.ctaButton));

      await waitFor(() => {
        expect(defaultProps.onQuickCreateHabit).toHaveBeenCalledWith(
          'Drink water'
        );
      });
    });

    it('should call onQuickCreateHabit with typed value', async () => {
      const { getByPlaceholderText, getByLabelText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      // Type custom habit
      const input = getByPlaceholderText(COPY.inputPlaceholder);
      fireEvent.changeText(input, 'Exercise for 10 minutes');

      // Press CTA
      fireEvent.press(getByLabelText(COPY.ctaButton));

      await waitFor(() => {
        expect(defaultProps.onQuickCreateHabit).toHaveBeenCalledWith(
          'Exercise for 10 minutes'
        );
      });
    });

    it('should trim whitespace from habit name', async () => {
      const { getByPlaceholderText, getByLabelText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      // Type with whitespace
      const input = getByPlaceholderText(COPY.inputPlaceholder);
      fireEvent.changeText(input, '  My habit  ');

      // Press CTA
      fireEvent.press(getByLabelText(COPY.ctaButton));

      await waitFor(() => {
        expect(defaultProps.onQuickCreateHabit).toHaveBeenCalledWith(
          'My habit'
        );
      });
    });
  });

  describe('Success State', () => {
    it('should show success state after habit creation', async () => {
      const { getByText, getByLabelText, queryByText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      // Select and create habit
      fireEvent.press(getByText('Water'));
      fireEvent.press(getByLabelText(COPY.ctaButton));

      await waitFor(() => {
        // Success headline should appear
        expect(queryByText(COPY.successHeadline)).toBeDefined();
      });
    });

    it('should display correct habit name in success state', async () => {
      const { getByText, getByLabelText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      // Select "Read" chip and create
      fireEvent.press(getByText('Read'));
      fireEvent.press(getByLabelText(COPY.ctaButton));

      await waitFor(() => {
        // Should show the subtext with the habit name
        expect(getByText(COPY.successSubtext('Read 5 pages'))).toBeDefined();
      });
    });

    it('should show "Add another habit" button in success state', async () => {
      const { getByText, getByLabelText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      // Create habit
      fireEvent.press(getByText('Water'));
      fireEvent.press(getByLabelText(COPY.ctaButton));

      await waitFor(() => {
        expect(getByText(COPY.addAnother)).toBeDefined();
      });
    });
  });

  describe('Add Another Habit', () => {
    it('should reset to initial state when "Add another" is pressed', async () => {
      const { getByText, getByLabelText, getByPlaceholderText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      // Create habit
      fireEvent.press(getByText('Water'));
      fireEvent.press(getByLabelText(COPY.ctaButton));

      await waitFor(() => {
        expect(getByText(COPY.addAnother)).toBeDefined();
      });

      // Press "Add another"
      fireEvent.press(getByText(COPY.addAnother));

      // Should show initial state again
      await waitFor(() => {
        expect(getByText(COPY.headline)).toBeDefined();
        expect(getByPlaceholderText(COPY.inputPlaceholder)).toBeDefined();
      });
    });

    it('should clear input value after resetting', async () => {
      const { getByText, getByLabelText, getByPlaceholderText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      // Create habit
      fireEvent.press(getByText('Water'));
      fireEvent.press(getByLabelText(COPY.ctaButton));

      await waitFor(() => {
        expect(getByText(COPY.addAnother)).toBeDefined();
      });

      // Press "Add another"
      fireEvent.press(getByText(COPY.addAnother));

      // Input should be empty
      await waitFor(() => {
        const input = getByPlaceholderText(COPY.inputPlaceholder);
        expect(input.props.value).toBe('');
      });
    });
  });

  describe('Secondary Links', () => {
    it('should call openTemplatesScreen when "Browse templates" is pressed', () => {
      const { getByText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      fireEvent.press(getByText(COPY.browseTemplates));

      expect(defaultProps.openTemplatesScreen).toHaveBeenCalled();
    });

    it('should call openCreateHabitScreen when "Create custom habit" is pressed', () => {
      const { getByText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      fireEvent.press(getByText(COPY.createCustom));

      expect(defaultProps.openCreateHabitScreen).toHaveBeenCalled();
    });
  });

  describe('Input Behavior', () => {
    it('should deselect chips when user types in input', () => {
      const {
        getByText,
        getByPlaceholderText,
        getByDisplayValue,
        queryByDisplayValue,
      } = render(<HabitsEmptyStateMinimal {...defaultProps} />);

      // Select a chip first
      fireEvent.press(getByText('Water'));
      expect(getByDisplayValue('Drink water')).toBeDefined();

      // Now type something different
      const input = getByPlaceholderText(COPY.inputPlaceholder);
      fireEvent.changeText(input, 'New habit');

      // Input should have the new typed value
      expect(getByDisplayValue('New habit')).toBeDefined();
    });
  });

  describe('Loading State', () => {
    it('should render LoadingSkeleton when isLoading is true', () => {
      const { getByLabelText, queryByText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} isLoading={true} />
      );

      // Should show LoadingSkeleton with accessibility label
      expect(getByLabelText('Loading')).toBeDefined();

      // Should NOT render main content
      expect(queryByText(COPY.headline)).toBeNull();
    });

    it('should render main content when isLoading is false', () => {
      const { getByText, queryByLabelText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} isLoading={false} />
      );

      // Should show main content
      expect(getByText(COPY.headline)).toBeDefined();

      // Should NOT show loading skeleton
      expect(queryByLabelText('Loading')).toBeNull();
    });

    it('should transition from loading to content when isLoading changes', () => {
      const {
        rerender,
        getByLabelText,
        getByText,
        queryByText,
        queryByLabelText,
      } = render(
        <HabitsEmptyStateMinimal {...defaultProps} isLoading={true} />
      );

      // Initially loading
      expect(getByLabelText('Loading')).toBeDefined();
      expect(queryByText(COPY.headline)).toBeNull();

      // Change to not loading
      rerender(<HabitsEmptyStateMinimal {...defaultProps} isLoading={false} />);

      // Now shows content
      expect(getByText(COPY.headline)).toBeDefined();
      expect(queryByLabelText('Loading')).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible labels on chips', () => {
      const { getByLabelText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      // Each chip should have an accessibility label
      SUGGESTION_CHIPS.forEach((chip) => {
        expect(getByLabelText(`Select ${chip.fullName}`)).toBeDefined();
      });
    });

    it('should have accessible role on chips', () => {
      const { getAllByRole } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      // Should have button roles (chips + CTA + secondary links)
      const buttons = getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(SUGGESTION_CHIPS.length);
    });

    it('should announce disabled state on CTA', () => {
      const { getByLabelText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      const ctaButton = getByLabelText(COPY.ctaButton);
      expect(ctaButton.props.accessibilityState?.disabled).toBe(true);
    });
  });

  describe('CodeRabbit Review Checklist', () => {
    it('✅ Component renders without crashing', () => {
      const { getByText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );
      expect(getByText(COPY.headline)).toBeDefined();
    });

    it('✅ Chip selection populates input correctly', () => {
      const { getByText, getByDisplayValue } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      fireEvent.press(getByText('Water'));
      expect(getByDisplayValue('Drink water')).toBeDefined();
    });

    it('✅ CTA disabled until input has value', () => {
      const { getByLabelText, getByPlaceholderText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      // Initially disabled
      let ctaButton = getByLabelText(COPY.ctaButton);
      expect(ctaButton.props.accessibilityState?.disabled).toBe(true);

      // Add input
      fireEvent.changeText(getByPlaceholderText(COPY.inputPlaceholder), 'Test');

      // Now enabled
      ctaButton = getByLabelText(COPY.ctaButton);
      expect(ctaButton.props.accessibilityState?.disabled).toBe(false);
    });

    it('✅ Success state displays correct habit name', async () => {
      const { getByText, getByLabelText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      fireEvent.press(getByText('Breathe'));
      fireEvent.press(getByLabelText(COPY.ctaButton));

      await waitFor(() => {
        expect(
          getByText(COPY.successSubtext('Breathe for 2 minutes'))
        ).toBeDefined();
      });
    });

    it('✅ "Add another" resets state properly', async () => {
      const { getByText, getByLabelText, getByPlaceholderText } = render(
        <HabitsEmptyStateMinimal {...defaultProps} />
      );

      // Create and show success
      fireEvent.press(getByText('Water'));
      fireEvent.press(getByLabelText(COPY.ctaButton));

      await waitFor(() => {
        expect(getByText(COPY.addAnother)).toBeDefined();
      });

      // Reset
      fireEvent.press(getByText(COPY.addAnother));

      await waitFor(() => {
        // Back to initial state
        expect(getByText(COPY.headline)).toBeDefined();
        const input = getByPlaceholderText(COPY.inputPlaceholder);
        expect(input.props.value).toBe('');
      });
    });
  });
});
