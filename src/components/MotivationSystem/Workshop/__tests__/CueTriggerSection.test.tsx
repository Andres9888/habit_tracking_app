/**
 * CueTriggerSection Tests
 * Story T3.2-T3.6 - Cue/Trigger Section Component
 *
 * Tests:
 * - Empty state rendering with pulsing icon
 * - Filled state rendering with cue fields
 * - Individual field display (time, location, afterBehavior)
 * - Implementation intention preview
 * - Completion checkmark visibility
 * - Press interaction
 * - Accessibility labels
 * - Sky accent color styling
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CueTriggerSection, CueTriggerData } from '../CueTriggerSection';

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
  Clock: () => null,
  MapPin: () => null,
  Link: () => null,
  Plus: () => null,
  Check: () => null,
}));

// Mock clsx
jest.mock('clsx', () => ({
  clsx: (...args: any[]) => args.filter(Boolean).join(' '),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    default: {
      View,
      createAnimatedComponent: (Component: any) => Component,
    },
    useSharedValue: (initial: any) => ({ value: initial }),
    useAnimatedStyle: () => ({}),
    withSpring: (value: any) => value,
    withTiming: (value: any) => value,
    withSequence: (...values: any[]) => values[values.length - 1],
    interpolate: (value: number, input: number[], output: number[]) =>
      output[0],
    runOnJS: (fn: any) => fn,
    View,
  };
});

describe('CueTriggerSection', () => {
  const defaultProps = {
    cue: undefined as CueTriggerData | undefined,
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('T3.2: Empty state rendering', () => {
    it('renders empty state when cue is undefined', () => {
      const { getByText } = render(<CueTriggerSection {...defaultProps} />);

      expect(getByText('Cue / Trigger')).toBeTruthy();
      expect(getByText('When, where, and after what')).toBeTruthy();
      expect(getByText('Set up')).toBeTruthy();
    });

    it('shows empty state when cue object has no fields filled', () => {
      const { getByText } = render(
        <CueTriggerSection
          {...defaultProps}
          cue={{
            time: undefined,
            location: undefined,
            afterBehavior: undefined,
          }}
        />
      );

      expect(getByText('When, where, and after what')).toBeTruthy();
    });

    it('shows empty state when cue fields are empty strings', () => {
      const { getByText } = render(
        <CueTriggerSection
          {...defaultProps}
          cue={{ time: '', location: '', afterBehavior: '' }}
        />
      );

      expect(getByText('When, where, and after what')).toBeTruthy();
    });

    it('has correct accessibility label for empty state', () => {
      const { getByLabelText } = render(
        <CueTriggerSection {...defaultProps} />
      );

      expect(getByLabelText('Add your cue')).toBeTruthy();
    });

    it('displays scientific motivation text in empty state', () => {
      const { getByText } = render(<CueTriggerSection {...defaultProps} />);

      expect(
        getByText('Habits with cues are 2x more likely to stick')
      ).toBeTruthy();
    });
  });

  describe('T3.3: Time field display', () => {
    it('renders time field when provided', () => {
      const { getByText } = render(
        <CueTriggerSection {...defaultProps} cue={{ time: '7:00 AM' }} />
      );

      expect(getByText('When:')).toBeTruthy();
      expect(getByText('7:00 AM')).toBeTruthy();
    });

    it('shows filled state with only time field', () => {
      const { getByLabelText } = render(
        <CueTriggerSection {...defaultProps} cue={{ time: 'Morning' }} />
      );

      expect(getByLabelText('Edit your cue')).toBeTruthy();
    });
  });

  describe('T3.4: Location field display', () => {
    it('renders location field when provided', () => {
      const { getByText } = render(
        <CueTriggerSection {...defaultProps} cue={{ location: 'Kitchen' }} />
      );

      expect(getByText('Where:')).toBeTruthy();
      expect(getByText('Kitchen')).toBeTruthy();
    });

    it('shows filled state with only location field', () => {
      const { getByLabelText } = render(
        <CueTriggerSection {...defaultProps} cue={{ location: 'Front door' }} />
      );

      expect(getByLabelText('Edit your cue')).toBeTruthy();
    });
  });

  describe('T3.5: After behavior field display', () => {
    it('renders after behavior field when provided', () => {
      const { getByText } = render(
        <CueTriggerSection
          {...defaultProps}
          cue={{ afterBehavior: 'morning coffee' }}
        />
      );

      expect(getByText('After:')).toBeTruthy();
      expect(getByText('morning coffee')).toBeTruthy();
    });

    it('shows implementation intention preview when afterBehavior is set', () => {
      const { getByText } = render(
        <CueTriggerSection
          {...defaultProps}
          cue={{ afterBehavior: 'pour my morning coffee' }}
        />
      );

      expect(getByText('"After I pour my morning coffee..."')).toBeTruthy();
    });

    it('does not show implementation intention preview without afterBehavior', () => {
      const { queryByText } = render(
        <CueTriggerSection
          {...defaultProps}
          cue={{ time: '7:00 AM', location: 'Kitchen' }}
        />
      );

      expect(queryByText(/After I/)).toBeNull();
    });
  });

  describe('T3.6: Sky accent color styling', () => {
    it('has sky border-l-4 accent color', () => {
      const { getByLabelText } = render(
        <CueTriggerSection {...defaultProps} />
      );

      // The card should have the sky border class
      const card = getByLabelText('Add your cue');
      expect(card).toBeTruthy();
    });
  });

  describe('Filled state with all fields', () => {
    const fullCue: CueTriggerData = {
      time: '7:00 AM',
      location: 'Kitchen',
      afterBehavior: 'pour my morning coffee',
    };

    it('renders all three fields when provided', () => {
      const { getByText } = render(
        <CueTriggerSection {...defaultProps} cue={fullCue} />
      );

      expect(getByText('When:')).toBeTruthy();
      expect(getByText('7:00 AM')).toBeTruthy();
      expect(getByText('Where:')).toBeTruthy();
      expect(getByText('Kitchen')).toBeTruthy();
      expect(getByText('After:')).toBeTruthy();
      expect(getByText('pour my morning coffee')).toBeTruthy();
    });

    it('has correct accessibility label for filled state', () => {
      const { getByLabelText } = render(
        <CueTriggerSection {...defaultProps} cue={fullCue} />
      );

      expect(getByLabelText('Edit your cue')).toBeTruthy();
    });

    it('does not show empty state elements', () => {
      const { queryByText } = render(
        <CueTriggerSection {...defaultProps} cue={fullCue} />
      );

      expect(queryByText('When, where, and after what')).toBeNull();
      expect(queryByText('Set up')).toBeNull();
    });
  });

  describe('Completion checkmark', () => {
    it('does not show checkmark in empty state', () => {
      const { queryByTestId } = render(<CueTriggerSection {...defaultProps} />);

      expect(queryByTestId('completion-checkmark')).toBeNull();
    });

    it('shows checkmark when any field is filled', () => {
      const { getByLabelText } = render(
        <CueTriggerSection {...defaultProps} cue={{ time: '7:00 AM' }} />
      );

      expect(getByLabelText('Edit your cue')).toBeTruthy();
    });
  });

  describe('Press interaction', () => {
    it('calls onPress when section is tapped in empty state', () => {
      const onPress = jest.fn();
      const { getByLabelText } = render(
        <CueTriggerSection {...defaultProps} onPress={onPress} />
      );

      fireEvent.press(getByLabelText('Add your cue'));

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('calls onPress when section is tapped in filled state', () => {
      const onPress = jest.fn();
      const { getByLabelText } = render(
        <CueTriggerSection
          {...defaultProps}
          cue={{ time: '7:00 AM' }}
          onPress={onPress}
        />
      );

      fireEvent.press(getByLabelText('Edit your cue'));

      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Animation props', () => {
    it('accepts shouldAnimate prop', () => {
      const { getByLabelText } = render(
        <CueTriggerSection {...defaultProps} shouldAnimate={true} />
      );

      expect(getByLabelText('Add your cue')).toBeTruthy();
    });

    it('accepts reduceMotion prop', () => {
      const { getByLabelText } = render(
        <CueTriggerSection {...defaultProps} reduceMotion={true} />
      );

      expect(getByLabelText('Add your cue')).toBeTruthy();
    });

    it('accepts sectionIndex prop for stagger timing', () => {
      const { getByLabelText } = render(
        <CueTriggerSection {...defaultProps} sectionIndex={3} />
      );

      expect(getByLabelText('Add your cue')).toBeTruthy();
    });

    it('defaults to sectionIndex 2 for proper stagger after Identity', () => {
      // CueTriggerSection should come after YourWhySection (0) and IdentitySection (1)
      const { getByLabelText } = render(
        <CueTriggerSection {...defaultProps} />
      );

      expect(getByLabelText('Add your cue')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has accessible button role', () => {
      const { getByRole } = render(<CueTriggerSection {...defaultProps} />);

      expect(getByRole('button')).toBeTruthy();
    });

    it('uses appropriate label for edit action when filled', () => {
      const { getByLabelText } = render(
        <CueTriggerSection {...defaultProps} cue={{ time: '7:00 AM' }} />
      );

      expect(getByLabelText('Edit your cue')).toBeTruthy();
    });
  });
});
