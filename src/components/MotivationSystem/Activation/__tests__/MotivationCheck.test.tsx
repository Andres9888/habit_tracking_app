/**
 * MotivationCheck Tests
 * Story T7.4 - Create `MotivationCheck` component (emoji buttons)
 *
 * Tests:
 * - Renders all three motivation options
 * - Selection state updates correctly
 * - Callback fired when option selected
 * - Correct accent colors per option
 * - Science hint shows for non-ready selections
 * - Compact mode rendering
 * - Accessibility labels and hints
 * - shouldShowFailureViz helper function
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import {
  MotivationCheck,
  shouldShowFailureViz,
  type MotivationLevel,
} from '../MotivationCheck';

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
  HelpCircle: () => null,
  Sparkles: () => null,
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
    withTiming: (value: unknown, _config?: unknown, _callback?: unknown) => value,
    withSequence: (...values: unknown[]) => values[values.length - 1],
    View,
  };
});

describe('MotivationCheck', () => {
  const defaultProps = {
    onSelectLevel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all three motivation options', () => {
      const { getByText } = render(<MotivationCheck {...defaultProps} />);

      expect(getByText('😩')).toBeTruthy();
      expect(getByText('😐')).toBeTruthy();
      expect(getByText('💪')).toBeTruthy();
    });

    it('renders labels for all options', () => {
      const { getByText } = render(<MotivationCheck {...defaultProps} />);

      expect(getByText('Not at all')).toBeTruthy();
      expect(getByText('Meh')).toBeTruthy();
      expect(getByText('Ready!')).toBeTruthy();
    });

    it('renders the question text', () => {
      const { getByText } = render(<MotivationCheck {...defaultProps} />);

      expect(getByText('How motivated are you right now?')).toBeTruthy();
    });

    it('renders header with title', () => {
      const { getByText } = render(<MotivationCheck {...defaultProps} />);

      expect(getByText('Motivation Check')).toBeTruthy();
    });

    it('renders explainer button when showExplainer is true and callback provided', () => {
      const onExplainerPress = jest.fn();
      const { getByLabelText } = render(
        <MotivationCheck
          {...defaultProps}
          showExplainer={true}
          onExplainerPress={onExplainerPress}
        />
      );

      expect(getByLabelText('Learn about motivation check')).toBeTruthy();
    });

    it('does not render explainer button when showExplainer is false', () => {
      const { queryByLabelText } = render(
        <MotivationCheck {...defaultProps} showExplainer={false} />
      );

      expect(queryByLabelText('Learn about motivation check')).toBeNull();
    });
  });

  describe('Selection', () => {
    it('calls onSelectLevel when not_motivated is pressed', () => {
      const onSelectLevel = jest.fn();
      const { getByLabelText } = render(
        <MotivationCheck {...defaultProps} onSelectLevel={onSelectLevel} />
      );

      fireEvent.press(getByLabelText('Not at all motivation level'));

      expect(onSelectLevel).toHaveBeenCalledWith('not_motivated');
    });

    it('calls onSelectLevel when meh is pressed', () => {
      const onSelectLevel = jest.fn();
      const { getByLabelText } = render(
        <MotivationCheck {...defaultProps} onSelectLevel={onSelectLevel} />
      );

      fireEvent.press(getByLabelText('Meh motivation level'));

      expect(onSelectLevel).toHaveBeenCalledWith('meh');
    });

    it('calls onSelectLevel when ready is pressed', () => {
      const onSelectLevel = jest.fn();
      const { getByLabelText } = render(
        <MotivationCheck {...defaultProps} onSelectLevel={onSelectLevel} />
      );

      fireEvent.press(getByLabelText('Ready! motivation level'));

      expect(onSelectLevel).toHaveBeenCalledWith('ready');
    });

    it('shows selected state for not_motivated', () => {
      const { getByLabelText } = render(
        <MotivationCheck {...defaultProps} selectedLevel='not_motivated' />
      );

      const button = getByLabelText('Not at all motivation level');
      expect(button.props.accessibilityState.selected).toBe(true);
    });

    it('shows selected state for meh', () => {
      const { getByLabelText } = render(
        <MotivationCheck {...defaultProps} selectedLevel='meh' />
      );

      const button = getByLabelText('Meh motivation level');
      expect(button.props.accessibilityState.selected).toBe(true);
    });

    it('shows selected state for ready', () => {
      const { getByLabelText } = render(
        <MotivationCheck {...defaultProps} selectedLevel='ready' />
      );

      const button = getByLabelText('Ready! motivation level');
      expect(button.props.accessibilityState.selected).toBe(true);
    });
  });

  describe('Science hint', () => {
    it('shows science hint when not_motivated is selected', () => {
      const { getByText } = render(
        <MotivationCheck {...defaultProps} selectedLevel='not_motivated' />
      );

      expect(
        getByText(/Visualizing consequences moves you 2x better/)
      ).toBeTruthy();
    });

    it('shows science hint when meh is selected', () => {
      const { getByText } = render(
        <MotivationCheck {...defaultProps} selectedLevel='meh' />
      );

      expect(
        getByText(/Visualizing consequences moves you 2x better/)
      ).toBeTruthy();
    });

    it('does NOT show science hint when ready is selected', () => {
      const { queryByText } = render(
        <MotivationCheck {...defaultProps} selectedLevel='ready' />
      );

      expect(
        queryByText(/Visualizing consequences moves you 2x better/)
      ).toBeNull();
    });

    it('does NOT show science hint when nothing is selected', () => {
      const { queryByText } = render(<MotivationCheck {...defaultProps} />);

      expect(
        queryByText(/Visualizing consequences moves you 2x better/)
      ).toBeNull();
    });
  });

  describe('Compact mode', () => {
    it('renders emoji buttons in compact mode', () => {
      const { getByText, queryByText } = render(
        <MotivationCheck {...defaultProps} compact={true} />
      );

      // Emojis should be present
      expect(getByText('😩')).toBeTruthy();
      expect(getByText('😐')).toBeTruthy();
      expect(getByText('💪')).toBeTruthy();

      // Header should NOT be present in compact mode
      expect(queryByText('Motivation Check')).toBeNull();
      expect(queryByText('How motivated are you right now?')).toBeNull();
    });

    it('fires selection callback in compact mode', () => {
      const onSelectLevel = jest.fn();
      const { getByLabelText } = render(
        <MotivationCheck
          {...defaultProps}
          onSelectLevel={onSelectLevel}
          compact={true}
        />
      );

      fireEvent.press(getByLabelText('Ready! motivation level'));

      expect(onSelectLevel).toHaveBeenCalledWith('ready');
    });
  });

  describe('Accessibility', () => {
    it('has accessibility labels for all buttons', () => {
      const { getByLabelText } = render(<MotivationCheck {...defaultProps} />);

      expect(getByLabelText('Not at all motivation level')).toBeTruthy();
      expect(getByLabelText('Meh motivation level')).toBeTruthy();
      expect(getByLabelText('Ready! motivation level')).toBeTruthy();
    });

    it('has correct accessibility hint for failure visualization options', () => {
      const { getByLabelText } = render(<MotivationCheck {...defaultProps} />);

      const notMotivated = getByLabelText('Not at all motivation level');
      expect(notMotivated.props.accessibilityHint).toContain(
        'failure visualization'
      );

      const meh = getByLabelText('Meh motivation level');
      expect(meh.props.accessibilityHint).toContain('failure visualization');
    });

    it('has correct accessibility hint for success visualization option', () => {
      const { getByLabelText } = render(<MotivationCheck {...defaultProps} />);

      const ready = getByLabelText('Ready! motivation level');
      expect(ready.props.accessibilityHint).toContain('success visualization');
    });

    it('has button roles for all options', () => {
      const { getAllByRole } = render(<MotivationCheck {...defaultProps} />);

      const buttons = getAllByRole('button');
      // At least 3 emoji buttons, possibly 4 with explainer
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });

    it('accepts reduceMotion prop', () => {
      const { getByText } = render(
        <MotivationCheck {...defaultProps} reduceMotion={true} />
      );

      expect(getByText('Motivation Check')).toBeTruthy();
    });
  });

  describe('Explainer button', () => {
    it('calls onExplainerPress when explainer button is pressed', () => {
      const onExplainerPress = jest.fn();
      const { getByLabelText } = render(
        <MotivationCheck
          {...defaultProps}
          showExplainer={true}
          onExplainerPress={onExplainerPress}
        />
      );

      fireEvent.press(getByLabelText('Learn about motivation check'));

      expect(onExplainerPress).toHaveBeenCalledTimes(1);
    });
  });
});

describe('shouldShowFailureViz helper', () => {
  it('returns true for not_motivated', () => {
    expect(shouldShowFailureViz('not_motivated')).toBe(true);
  });

  it('returns true for meh', () => {
    expect(shouldShowFailureViz('meh')).toBe(true);
  });

  it('returns false for ready', () => {
    expect(shouldShowFailureViz('ready')).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(shouldShowFailureViz(undefined)).toBe(false);
  });
});
