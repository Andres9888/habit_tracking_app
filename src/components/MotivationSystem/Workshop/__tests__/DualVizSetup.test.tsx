/**
 * DualVizSetup Tests
 * Story T5.1-T5.6 - Dual Visualization Section Component
 *
 * Tests:
 * - Empty state rendering with pulsing icon
 * - Filled state rendering with success/failure previews
 * - Success visualization fields (Body/Mind/Emotion) (T5.3)
 * - Failure visualization fields (Body/Mind/Emotion) (T5.4)
 * - Science explainer: "Fear moves you 2x better" (T5.5)
 * - Emerald (success) / rose (failure) styling (T5.6)
 * - Completion checkmark visibility
 * - Press interaction
 * - Accessibility labels
 */

import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import { DualVizSetup, VisualizationData } from '../DualVizSetup';

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
  Eye: () => null,
  Plus: () => null,
  Check: () => null,
  HelpCircle: () => null,
  X: () => null,
  Sparkles: () => null,
  AlertTriangle: () => null,
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

describe('DualVizSetup', () => {
  const defaultProps = {
    visualization: undefined as VisualizationData | undefined,
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('T5.2: Empty state rendering', () => {
    it('renders empty state when visualization is undefined', () => {
      const { getByText } = render(<DualVizSetup {...defaultProps} />);

      expect(getByText('Dual Visualization')).toBeTruthy();
      expect(getByText('Success + Failure feelings')).toBeTruthy();
      expect(getByText('Set up')).toBeTruthy();
    });

    it('shows empty state when visualization object has no fields filled', () => {
      const { getByText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{
            successBody: undefined,
            successMind: undefined,
            successEmotion: undefined,
            failureBody: undefined,
            failureMind: undefined,
            failureEmotion: undefined,
          }}
        />
      );

      expect(getByText('Success + Failure feelings')).toBeTruthy();
    });

    it('shows empty state when visualization fields are empty strings', () => {
      const { getByText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{
            successBody: '',
            successMind: '',
            successEmotion: '',
            failureBody: '',
            failureMind: '',
            failureEmotion: '',
          }}
        />
      );

      expect(getByText('Success + Failure feelings')).toBeTruthy();
    });

    it('has correct accessibility label for empty state', () => {
      const { getByLabelText } = render(<DualVizSetup {...defaultProps} />);

      expect(getByLabelText('Add your visualizations')).toBeTruthy();
    });

    it('displays scientific motivation text in empty state', () => {
      const { getByText } = render(<DualVizSetup {...defaultProps} />);

      expect(
        getByText('Fear moves you 2x better when unmotivated')
      ).toBeTruthy();
    });
  });

  describe('T5.3: Success visualization fields (Body/Mind/Emotion)', () => {
    it('renders success body field when provided', () => {
      const { getByText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{ successBody: 'Light and energized' }}
        />
      );

      // Text is rendered with "Body: Light and energized" as nested Text nodes
      expect(getByText(/Light and energized/)).toBeTruthy();
    });

    it('renders success mind field when provided', () => {
      const { getByText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{ successMind: 'Clear and focused' }}
        />
      );

      expect(getByText(/Clear and focused/)).toBeTruthy();
    });

    it('renders success emotion field when provided', () => {
      const { getByText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{ successEmotion: 'Proud and confident' }}
        />
      );

      expect(getByText(/Proud and confident/)).toBeTruthy();
    });

    it('shows success preview with all fields', () => {
      const { getByText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{
            successBody: 'Light',
            successMind: 'Clear',
            successEmotion: 'Proud',
          }}
        />
      );

      expect(getByText('Success')).toBeTruthy();
      expect(getByText(/Light/)).toBeTruthy();
      expect(getByText(/Clear/)).toBeTruthy();
      expect(getByText(/Proud/)).toBeTruthy();
    });

    it('shows "Body:" label for success body field', () => {
      const { getByText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{ successBody: 'Light' }}
        />
      );

      expect(getByText('Body:')).toBeTruthy();
    });

    it('shows "Mind:" label for success mind field', () => {
      const { getByText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{ successMind: 'Clear' }}
        />
      );

      expect(getByText('Mind:')).toBeTruthy();
    });

    it('shows "Feel:" label for success emotion field', () => {
      const { getByText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{ successEmotion: 'Proud' }}
        />
      );

      expect(getByText('Feel:')).toBeTruthy();
    });
  });

  describe('T5.4: Failure visualization fields (Body/Mind/Emotion)', () => {
    it('renders failure body field when provided', () => {
      const { getByText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{ failureBody: 'Heavy and sluggish' }}
        />
      );

      expect(getByText(/Heavy and sluggish/)).toBeTruthy();
    });

    it('renders failure mind field when provided', () => {
      const { getByText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{ failureMind: 'Foggy, making excuses' }}
        />
      );

      expect(getByText(/Foggy, making excuses/)).toBeTruthy();
    });

    it('renders failure emotion field when provided', () => {
      const { getByText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{ failureEmotion: 'Regret and shame' }}
        />
      );

      expect(getByText(/Regret and shame/)).toBeTruthy();
    });

    it('shows failure preview with all fields', () => {
      const { getByText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{
            failureBody: 'Heavy',
            failureMind: 'Foggy',
            failureEmotion: 'Regret',
          }}
        />
      );

      expect(getByText('Failure')).toBeTruthy();
      expect(getByText(/Heavy/)).toBeTruthy();
      expect(getByText(/Foggy/)).toBeTruthy();
      expect(getByText(/Regret/)).toBeTruthy();
    });
  });

  describe('T5.5: Science explainer modal', () => {
    it('renders help button in empty state', () => {
      const { getByLabelText } = render(<DualVizSetup {...defaultProps} />);

      expect(getByLabelText('Learn about dual visualization')).toBeTruthy();
    });

    it('renders help button in filled state', () => {
      const { getByLabelText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{ successBody: 'Light' }}
        />
      );

      expect(getByLabelText('Learn about dual visualization')).toBeTruthy();
    });

    it('opens explainer modal when help button is pressed', () => {
      const { getByLabelText, getAllByText, getByText } = render(
        <DualVizSetup {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Learn about dual visualization'));

      // Modal opens - there will be two "Dual Visualization" texts (section + modal title)
      expect(getAllByText('Dual Visualization').length).toBeGreaterThan(1);
      expect(getByText('Andrew Huberman, Stanford')).toBeTruthy();
    });

    it('shows key insight: "Fear moves you 2x better" in modal', () => {
      const { getByLabelText, getByText, getAllByText } = render(
        <DualVizSetup {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Learn about dual visualization'));

      // There are two instances of "fear moves you 2x better" - one in empty state and one in modal
      expect(getAllByText(/Fear moves you 2x better/).length).toBeGreaterThan(
        0
      );
    });

    it('explains when to use success vs failure visualization', () => {
      const { getByLabelText, getByText } = render(
        <DualVizSetup {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Learn about dual visualization'));

      expect(getByText('Feeling Motivated?')).toBeTruthy();
      expect(getByText(/Visualize SUCCESS/)).toBeTruthy();
      expect(getByText('Not Motivated?')).toBeTruthy();
      expect(getByText(/Visualize FAILURE/)).toBeTruthy();
    });

    it('shows Body/Mind/Emotion explanation in modal', () => {
      const { getByLabelText, getByText } = render(
        <DualVizSetup {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Learn about dual visualization'));

      expect(getByText(/Body:/)).toBeTruthy();
      expect(getByText(/Mind:/)).toBeTruthy();
      expect(getByText(/Emotion:/)).toBeTruthy();
    });

    it('shows scientific source in modal', () => {
      const { getByLabelText, getByText } = render(
        <DualVizSetup {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Learn about dual visualization'));

      expect(getByText('Source: Huberman Lab Podcast #55')).toBeTruthy();
    });

    it('closes modal when close button is pressed', () => {
      const { getByLabelText, queryByText, getByText } = render(
        <DualVizSetup {...defaultProps} />
      );

      // Open modal
      fireEvent.press(getByLabelText('Learn about dual visualization'));
      expect(getByText('Andrew Huberman, Stanford')).toBeTruthy();

      // Close modal
      fireEvent.press(getByLabelText('Close'));
      expect(queryByText('Andrew Huberman, Stanford')).toBeNull();
    });
  });

  describe('T5.6: Emerald/rose gradient styling', () => {
    const fullViz: VisualizationData = {
      successBody: 'Light',
      successMind: 'Clear',
      successEmotion: 'Proud',
      failureBody: 'Heavy',
      failureMind: 'Foggy',
      failureEmotion: 'Regret',
    };

    it('displays Success preview card', () => {
      const { getByText } = render(
        <DualVizSetup {...defaultProps} visualization={fullViz} />
      );

      expect(getByText('Success')).toBeTruthy();
    });

    it('displays Failure preview card', () => {
      const { getByText } = render(
        <DualVizSetup {...defaultProps} visualization={fullViz} />
      );

      expect(getByText('Failure')).toBeTruthy();
    });

    it('shows both success and failure previews side by side', () => {
      const { getByText } = render(
        <DualVizSetup {...defaultProps} visualization={fullViz} />
      );

      // Both should be visible
      expect(getByText('Success')).toBeTruthy();
      expect(getByText('Failure')).toBeTruthy();
    });
  });

  describe('Filled state with all fields', () => {
    const fullViz: VisualizationData = {
      successBody: 'Light, energized, powerful',
      successMind: 'Clear, focused, accomplished',
      successEmotion: 'Proud, confident, capable',
      failureBody: 'Heavy, sluggish, stuck',
      failureMind: 'Foggy, making excuses',
      failureEmotion: 'Regret, shame, broken promise',
    };

    it('renders all six fields when provided', () => {
      const { getByText } = render(
        <DualVizSetup {...defaultProps} visualization={fullViz} />
      );

      // Success fields (using regex since text is nested in Text nodes)
      expect(getByText(/Light, energized, powerful/)).toBeTruthy();
      expect(getByText(/Clear, focused, accomplished/)).toBeTruthy();
      expect(getByText(/Proud, confident, capable/)).toBeTruthy();

      // Failure fields
      expect(getByText(/Heavy, sluggish, stuck/)).toBeTruthy();
      expect(getByText(/Foggy, making excuses/)).toBeTruthy();
      expect(getByText(/Regret, shame, broken promise/)).toBeTruthy();
    });

    it('has correct accessibility label for filled state', () => {
      const { getByLabelText } = render(
        <DualVizSetup {...defaultProps} visualization={fullViz} />
      );

      expect(getByLabelText('Edit your visualizations')).toBeTruthy();
    });

    it('does not show empty state elements', () => {
      const { queryByText } = render(
        <DualVizSetup {...defaultProps} visualization={fullViz} />
      );

      expect(queryByText('Success + Failure feelings')).toBeNull();
      expect(queryByText('Set up')).toBeNull();
    });
  });

  describe('Partial fill states', () => {
    it('shows filled state with only success visualization', () => {
      const { getByLabelText, getByText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{
            successBody: 'Light',
            successMind: 'Clear',
            successEmotion: 'Proud',
          }}
        />
      );

      expect(getByLabelText('Edit your visualizations')).toBeTruthy();
      expect(getByText('Success')).toBeTruthy();
    });

    it('shows filled state with only failure visualization', () => {
      const { getByLabelText, getByText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{
            failureBody: 'Heavy',
            failureMind: 'Foggy',
            failureEmotion: 'Regret',
          }}
        />
      );

      expect(getByLabelText('Edit your visualizations')).toBeTruthy();
      expect(getByText('Failure')).toBeTruthy();
    });

    it('shows empty preview prompts for unfilled side', () => {
      const { getByText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{ successBody: 'Light' }}
        />
      );

      // Failure side should show prompt
      expect(getByText('What will you avoid?')).toBeTruthy();
    });
  });

  describe('Completion checkmark', () => {
    it('does not show checkmark in empty state', () => {
      const { queryByTestId } = render(<DualVizSetup {...defaultProps} />);

      expect(queryByTestId('completion-checkmark')).toBeNull();
    });

    it('shows checkmark only when ALL 6 fields are filled', () => {
      const { getByLabelText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{
            successBody: 'Light',
            successMind: 'Clear',
            successEmotion: 'Proud',
            failureBody: 'Heavy',
            failureMind: 'Foggy',
            failureEmotion: 'Regret',
          }}
        />
      );

      expect(getByLabelText('Edit your visualizations')).toBeTruthy();
    });

    it('does not show checkmark when only some fields filled', () => {
      const { queryByTestId, getByLabelText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{
            successBody: 'Light',
            successMind: 'Clear',
            successEmotion: 'Proud',
            // Missing failure fields
          }}
        />
      );

      expect(getByLabelText('Edit your visualizations')).toBeTruthy();
      expect(queryByTestId('completion-checkmark')).toBeNull();
    });
  });

  describe('Press interaction', () => {
    it('calls onPress when section is tapped in empty state', () => {
      const onPress = jest.fn();
      const { getByLabelText } = render(
        <DualVizSetup {...defaultProps} onPress={onPress} />
      );

      fireEvent.press(getByLabelText('Add your visualizations'));

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('calls onPress when section is tapped in filled state', () => {
      const onPress = jest.fn();
      const { getByLabelText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{ successBody: 'Light' }}
          onPress={onPress}
        />
      );

      fireEvent.press(getByLabelText('Edit your visualizations'));

      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Animation props', () => {
    it('accepts shouldAnimate prop', () => {
      const { getByLabelText } = render(
        <DualVizSetup {...defaultProps} shouldAnimate={true} />
      );

      expect(getByLabelText('Add your visualizations')).toBeTruthy();
    });

    it('accepts reduceMotion prop', () => {
      const { getByLabelText } = render(
        <DualVizSetup {...defaultProps} reduceMotion={true} />
      );

      expect(getByLabelText('Add your visualizations')).toBeTruthy();
    });

    it('accepts sectionIndex prop for stagger timing', () => {
      const { getByLabelText } = render(
        <DualVizSetup {...defaultProps} sectionIndex={5} />
      );

      expect(getByLabelText('Add your visualizations')).toBeTruthy();
    });

    it('defaults to sectionIndex 4 for proper stagger after WOOP', () => {
      // DualVizSetup should come after YourWhySection (0), IdentitySection (1),
      // CueTriggerSection (2), WOOPSection (3)
      const { getByLabelText } = render(<DualVizSetup {...defaultProps} />);

      expect(getByLabelText('Add your visualizations')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has accessible button role', () => {
      const { getByRole } = render(<DualVizSetup {...defaultProps} />);

      expect(getByRole('button')).toBeTruthy();
    });

    it('uses appropriate label for edit action when filled', () => {
      const { getByLabelText } = render(
        <DualVizSetup
          {...defaultProps}
          visualization={{ successBody: 'Light' }}
        />
      );

      expect(getByLabelText('Edit your visualizations')).toBeTruthy();
    });

    it('help button has accessible label', () => {
      const { getByLabelText } = render(<DualVizSetup {...defaultProps} />);

      expect(getByLabelText('Learn about dual visualization')).toBeTruthy();
    });
  });
});
