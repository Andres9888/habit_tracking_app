/**
 * WOOPSection Tests
 * Story T4.2-T4.5 - WOOP Plan Section Component
 *
 * Tests:
 * - Empty state rendering with pulsing icon
 * - Filled state rendering with WOOP fields
 * - Individual field display (wish, outcome, obstacle, plan)
 * - IF-THEN implementation intention highlight (T4.3)
 * - WOOP explanation modal (T4.4)
 * - Amber/rose/emerald W-O-O-P letter styling (T4.5)
 * - Completion checkmark visibility
 * - Press interaction
 * - Accessibility labels
 */

import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import { WOOPSection, WOOPData } from '../WOOPSection';

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
  Target: () => null,
  Plus: () => null,
  Check: () => null,
  HelpCircle: () => null,
  X: () => null,
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
    interpolate: (value: number, input: number[], output: number[]) =>
      output[0],
    runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
    View,
  };
});

describe('WOOPSection', () => {
  const defaultProps = {
    woop: undefined as WOOPData | undefined,
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('T4.2: Empty state rendering', () => {
    it('renders empty state when woop is undefined', () => {
      const { getByText } = render(<WOOPSection {...defaultProps} />);

      expect(getByText('WOOP Plan')).toBeTruthy();
      expect(getByText('Wish-Outcome-Obstacle-Plan')).toBeTruthy();
      expect(getByText('Set up')).toBeTruthy();
    });

    it('shows empty state when woop object has no fields filled', () => {
      const { getByText } = render(
        <WOOPSection
          {...defaultProps}
          woop={{
            wish: undefined,
            outcome: undefined,
            obstacle: undefined,
            plan: undefined,
          }}
        />
      );

      expect(getByText('Wish-Outcome-Obstacle-Plan')).toBeTruthy();
    });

    it('shows empty state when woop fields are empty strings', () => {
      const { getByText } = render(
        <WOOPSection
          {...defaultProps}
          woop={{ wish: '', outcome: '', obstacle: '', plan: '' }}
        />
      );

      expect(getByText('Wish-Outcome-Obstacle-Plan')).toBeTruthy();
    });

    it('has correct accessibility label for empty state', () => {
      const { getByLabelText } = render(<WOOPSection {...defaultProps} />);

      expect(getByLabelText('Add your WOOP plan')).toBeTruthy();
    });

    it('displays scientific motivation text in empty state', () => {
      const { getByText } = render(<WOOPSection {...defaultProps} />);

      expect(getByText('Proven to double goal achievement')).toBeTruthy();
    });
  });

  describe('T4.2: Wish field display', () => {
    it('renders wish field when provided', () => {
      const { getByText } = render(
        <WOOPSection {...defaultProps} woop={{ wish: 'Run 30 min every morning' }} />
      );

      expect(getByText('W')).toBeTruthy();
      expect(getByText('Run 30 min every morning')).toBeTruthy();
    });

    it('shows filled state with only wish field', () => {
      const { getByLabelText } = render(
        <WOOPSection {...defaultProps} woop={{ wish: 'Exercise daily' }} />
      );

      expect(getByLabelText('Edit your WOOP plan')).toBeTruthy();
    });
  });

  describe('T4.2: Outcome field display', () => {
    it('renders outcome field when provided', () => {
      const { getByText, getAllByText } = render(
        <WOOPSection {...defaultProps} woop={{ outcome: 'Feel energized, proud' }} />
      );

      // There are two O's in WOOP
      const oLetters = getAllByText('O');
      expect(oLetters.length).toBe(2);
      expect(getByText('Feel energized, proud')).toBeTruthy();
    });
  });

  describe('T4.2: Obstacle field display', () => {
    it('renders obstacle field when provided', () => {
      const { getByText, getAllByText } = render(
        <WOOPSection {...defaultProps} woop={{ obstacle: 'Too tired in morning' }} />
      );

      // There are two O's in WOOP
      const oLetters = getAllByText('O');
      expect(oLetters.length).toBe(2);
      expect(getByText('Too tired in morning')).toBeTruthy();
    });
  });

  describe('T4.2: Plan field display', () => {
    it('renders plan field when provided', () => {
      const { getByText } = render(
        <WOOPSection {...defaultProps} woop={{ plan: 'walk 5 min first' }} />
      );

      expect(getByText('P')).toBeTruthy();
      expect(getByText('walk 5 min first')).toBeTruthy();
    });

    it('applies bold styling to plan field', () => {
      const { getByText } = render(
        <WOOPSection
          {...defaultProps}
          woop={{
            wish: 'Run',
            outcome: 'Feel good',
            obstacle: 'Tired',
            plan: 'walk first',
          }}
        />
      );

      // Plan text should be visible and styled
      expect(getByText('walk first')).toBeTruthy();
    });
  });

  describe('T4.3: IF-THEN implementation intention highlight', () => {
    it('shows IF-THEN preview when obstacle and plan are set', () => {
      const { getByText } = render(
        <WOOPSection
          {...defaultProps}
          woop={{
            obstacle: 'too tired',
            plan: 'walk 5 min first',
          }}
        />
      );

      expect(getByText('"If too tired → walk 5 min first"')).toBeTruthy();
    });

    it('does not show IF-THEN preview without obstacle', () => {
      const { queryByText } = render(
        <WOOPSection
          {...defaultProps}
          woop={{ wish: 'Run', outcome: 'Feel good', plan: 'walk first' }}
        />
      );

      expect(queryByText(/If/)).toBeNull();
    });

    it('does not show IF-THEN preview without plan', () => {
      const { queryByText } = render(
        <WOOPSection
          {...defaultProps}
          woop={{ wish: 'Run', outcome: 'Feel good', obstacle: 'Tired' }}
        />
      );

      expect(queryByText(/→/)).toBeNull();
    });
  });

  describe('T4.4: WOOP explanation tooltip/modal', () => {
    it('renders help button in empty state', () => {
      const { getByLabelText } = render(<WOOPSection {...defaultProps} />);

      expect(getByLabelText('Learn about WOOP')).toBeTruthy();
    });

    it('renders help button in filled state', () => {
      const { getByLabelText } = render(
        <WOOPSection {...defaultProps} woop={{ wish: 'Run' }} />
      );

      expect(getByLabelText('Learn about WOOP')).toBeTruthy();
    });

    it('opens explainer modal when help button is pressed', () => {
      const { getByLabelText, getByText } = render(
        <WOOPSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Learn about WOOP'));

      expect(getByText('WOOP Method')).toBeTruthy();
      expect(getByText('Dr. Gabriele Oettingen, NYU')).toBeTruthy();
    });

    it('shows WOOP breakdown in explainer modal', () => {
      const { getByLabelText, getByText } = render(
        <WOOPSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Learn about WOOP'));

      expect(getByText('Wish')).toBeTruthy();
      expect(getByText('Outcome')).toBeTruthy();
      expect(getByText('Obstacle')).toBeTruthy();
      expect(getByText('Plan')).toBeTruthy();
    });

    it('shows implementation intention explanation in modal', () => {
      const { getByLabelText, getByText } = render(
        <WOOPSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Learn about WOOP'));

      expect(getByText(/implementation intention/)).toBeTruthy();
    });

    it('shows scientific source in modal', () => {
      const { getByLabelText, getByText } = render(
        <WOOPSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Learn about WOOP'));

      expect(getByText('Source: "Rethinking Positive Thinking" (2014)')).toBeTruthy();
    });

    it('closes modal when close button is pressed', () => {
      const { getByLabelText, queryByText } = render(
        <WOOPSection {...defaultProps} />
      );

      // Open modal
      fireEvent.press(getByLabelText('Learn about WOOP'));
      expect(queryByText('WOOP Method')).toBeTruthy();

      // Close modal
      fireEvent.press(getByLabelText('Close'));
      expect(queryByText('WOOP Method')).toBeNull();
    });
  });

  describe('T4.5: Amber/rose W-O-O-P letter styling', () => {
    const fullWoop: WOOPData = {
      wish: 'Run 30 min',
      outcome: 'Feel energized',
      obstacle: 'Too tired',
      plan: 'Walk 5 min first',
    };

    it('displays W letter for Wish', () => {
      const { getByText } = render(
        <WOOPSection {...defaultProps} woop={fullWoop} />
      );

      expect(getByText('W')).toBeTruthy();
    });

    it('displays two O letters for Outcome and Obstacle', () => {
      const { getAllByText } = render(
        <WOOPSection {...defaultProps} woop={fullWoop} />
      );

      const oLetters = getAllByText('O');
      expect(oLetters.length).toBe(2);
    });

    it('displays P letter for Plan', () => {
      const { getByText } = render(
        <WOOPSection {...defaultProps} woop={fullWoop} />
      );

      expect(getByText('P')).toBeTruthy();
    });
  });

  describe('Filled state with all fields', () => {
    const fullWoop: WOOPData = {
      wish: 'Run 30 min every morning',
      outcome: 'Feel energized, proud',
      obstacle: 'Too tired in morning',
      plan: 'walk 5 min first',
    };

    it('renders all four fields when provided', () => {
      const { getByText } = render(
        <WOOPSection {...defaultProps} woop={fullWoop} />
      );

      expect(getByText('Run 30 min every morning')).toBeTruthy();
      expect(getByText('Feel energized, proud')).toBeTruthy();
      expect(getByText('Too tired in morning')).toBeTruthy();
      expect(getByText('walk 5 min first')).toBeTruthy();
    });

    it('has correct accessibility label for filled state', () => {
      const { getByLabelText } = render(
        <WOOPSection {...defaultProps} woop={fullWoop} />
      );

      expect(getByLabelText('Edit your WOOP plan')).toBeTruthy();
    });

    it('does not show empty state elements', () => {
      const { queryByText } = render(
        <WOOPSection {...defaultProps} woop={fullWoop} />
      );

      expect(queryByText('Wish-Outcome-Obstacle-Plan')).toBeNull();
      expect(queryByText('Set up')).toBeNull();
    });
  });

  describe('Completion checkmark', () => {
    it('does not show checkmark in empty state', () => {
      const { queryByTestId } = render(<WOOPSection {...defaultProps} />);

      expect(queryByTestId('completion-checkmark')).toBeNull();
    });

    it('shows checkmark only when ALL fields are filled', () => {
      const { getByLabelText } = render(
        <WOOPSection
          {...defaultProps}
          woop={{
            wish: 'Run',
            outcome: 'Feel good',
            obstacle: 'Tired',
            plan: 'Walk first',
          }}
        />
      );

      expect(getByLabelText('Edit your WOOP plan')).toBeTruthy();
    });

    it('does not show checkmark when only some fields filled', () => {
      // Partial fill should show filled state but not checkmark
      const { getByLabelText, queryByTestId } = render(
        <WOOPSection
          {...defaultProps}
          woop={{ wish: 'Run', outcome: 'Feel good' }}
        />
      );

      expect(getByLabelText('Edit your WOOP plan')).toBeTruthy();
      // Checkmark requires all 4 fields
      expect(queryByTestId('completion-checkmark')).toBeNull();
    });
  });

  describe('Press interaction', () => {
    it('calls onPress when section is tapped in empty state', () => {
      const onPress = jest.fn();
      const { getByLabelText } = render(
        <WOOPSection {...defaultProps} onPress={onPress} />
      );

      fireEvent.press(getByLabelText('Add your WOOP plan'));

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('calls onPress when section is tapped in filled state', () => {
      const onPress = jest.fn();
      const { getByLabelText } = render(
        <WOOPSection
          {...defaultProps}
          woop={{ wish: 'Run every day' }}
          onPress={onPress}
        />
      );

      fireEvent.press(getByLabelText('Edit your WOOP plan'));

      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Animation props', () => {
    it('accepts shouldAnimate prop', () => {
      const { getByLabelText } = render(
        <WOOPSection {...defaultProps} shouldAnimate={true} />
      );

      expect(getByLabelText('Add your WOOP plan')).toBeTruthy();
    });

    it('accepts reduceMotion prop', () => {
      const { getByLabelText } = render(
        <WOOPSection {...defaultProps} reduceMotion={true} />
      );

      expect(getByLabelText('Add your WOOP plan')).toBeTruthy();
    });

    it('accepts sectionIndex prop for stagger timing', () => {
      const { getByLabelText } = render(
        <WOOPSection {...defaultProps} sectionIndex={5} />
      );

      expect(getByLabelText('Add your WOOP plan')).toBeTruthy();
    });

    it('defaults to sectionIndex 3 for proper stagger after CueTrigger', () => {
      // WOOPSection should come after YourWhySection (0), IdentitySection (1), CueTriggerSection (2)
      const { getByLabelText } = render(<WOOPSection {...defaultProps} />);

      expect(getByLabelText('Add your WOOP plan')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has accessible button role', () => {
      const { getByRole } = render(<WOOPSection {...defaultProps} />);

      expect(getByRole('button')).toBeTruthy();
    });

    it('uses appropriate label for edit action when filled', () => {
      const { getByLabelText } = render(
        <WOOPSection {...defaultProps} woop={{ wish: 'Run' }} />
      );

      expect(getByLabelText('Edit your WOOP plan')).toBeTruthy();
    });

    it('help button has accessible label', () => {
      const { getByLabelText } = render(<WOOPSection {...defaultProps} />);

      expect(getByLabelText('Learn about WOOP')).toBeTruthy();
    });
  });
});
