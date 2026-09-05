/**
 * TipQuickActionsSheet Component Tests
 *
 * Tests for the tip quick actions bottom sheet component.
 * Covers rendering, accessibility, action handling, and tip type determination.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TipQuickActionsSheet } from '../TipQuickActionsSheet';
import { getQuickActionsForTipType } from '../TipQuickActionsSheet/getQuickActionsForTipType';
import { determineTipTypeFromText } from '../TipQuickActionsSheet/determineTipTypeFromText';
import type { QuickAction, TipType } from '../TipQuickActionsSheet/types';

// Mock useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  __esModule: true,
  useReduceMotion: jest.fn(() => false),
  default: jest.fn(() => false),
}));

// Mock useHapticFeedback hook
const mockTriggerLightImpact = jest.fn();
jest.mock('../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  useHapticFeedback: jest.fn(() => ({
    triggerSelection: jest.fn(),
    triggerLightImpact: mockTriggerLightImpact,
    triggerMediumImpact: jest.fn(),
    triggerHeavyImpact: jest.fn(),
    triggerSuccess: jest.fn(),
    triggerWarning: jest.fn(),
    triggerError: jest.fn(),
  })),
  default: jest.fn(),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, Pressable } = require('react-native');

  const Animated = {
    View,
    Text: require('react-native').Text,
    createAnimatedComponent: (Component: React.ComponentType) => {
      const AnimatedComponent = React.forwardRef((props: Record<string, unknown>, ref: React.Ref<unknown>) =>
        React.createElement(Component, { ...props, ref })
      );
      AnimatedComponent.displayName = `Animated(${Component.displayName || Component.name || 'Component'})`;
      return AnimatedComponent;
    },
  };

  return {
    __esModule: true,
    default: Animated,
    ...Animated,
    FadeIn: { delay: () => ({ duration: () => ({}) }) },
    FadeOut: {},
    SlideInDown: {},
    SlideOutDown: {},
    useReducedMotion: jest.fn(() => false),
    useSharedValue: (initialValue: number) => ({ value: initialValue }),
    useAnimatedStyle: () => ({}),
    withTiming: (value: number) => value,
    withDelay: (_delay: number, value: number) => value,
    withSpring: (value: number) => value,
    Easing: {
      out: () => () => 0,
      cubic: () => 0,
      in: () => () => 0,
    },
    runOnJS: (fn: Function) => fn,
    interpolate: () => 0,
    Extrapolation: { CLAMP: 'clamp' },
  };
});

// Mock Modal component
jest.mock('../../Modal', () => ({
  Modal: ({ children, visible, onClose }: unknown) => {
    if (!visible) return null;
    return children;
  },
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  const createMockIcon = (name: string) => (props: Record<string, unknown>) =>
    React.createElement(View, { testID: `icon-${name}`, ...props });

  return {
    Bell: createMockIcon('bell'),
    Edit3: createMockIcon('edit-3'),
    Calendar: createMockIcon('calendar'),
    Target: createMockIcon('target'),
    Heart: createMockIcon('heart'),
    Zap: createMockIcon('zap'),
    X: createMockIcon('x'),
  };
});

describe('TipQuickActionsSheet', () => {
  const defaultProps = {
    visible: true,
    tipText: 'Focus on Saturday to level up!',
    tipType: 'focusDay' as TipType,
    focusDayName: 'Saturday',
    currentStreak: 5,
    onActionPress: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders when visible is true', () => {
      const { getByText } = render(<TipQuickActionsSheet {...defaultProps} />);
      expect(getByText('Quick Actions')).toBeTruthy();
    });

    it('does not render when visible is false', () => {
      const { queryByText } = render(
        <TipQuickActionsSheet {...defaultProps} visible={false} />
      );
      expect(queryByText('Quick Actions')).toBeNull();
    });

    it('displays the tip text in the header', () => {
      const { getByText } = render(<TipQuickActionsSheet {...defaultProps} />);
      expect(getByText('Focus on Saturday to level up!')).toBeTruthy();
    });

    it('renders quick actions for focus day tip type', () => {
      const { getByText } = render(<TipQuickActionsSheet {...defaultProps} />);
      expect(getByText('Set Saturday reminder')).toBeTruthy();
      expect(getByText('Make habit easier on Saturday')).toBeTruthy();
      expect(getByText('View Saturday history')).toBeTruthy();
    });

    it('renders quick actions for low streak tip type', () => {
      const { getByText } = render(
        <TipQuickActionsSheet
          {...defaultProps}
          tipType='lowStreak'
          tipText='Complete today to start a new streak!'
        />
      );
      expect(getByText('Set daily reminder')).toBeTruthy();
      expect(getByText('Try a smaller version')).toBeTruthy();
      expect(getByText('Review your why')).toBeTruthy();
    });

    it('renders quick actions for good streak tip type', () => {
      const { getByText } = render(
        <TipQuickActionsSheet
          {...defaultProps}
          tipType='goodStreak'
          tipText='Amazing streak! Keep the momentum going.'
          currentStreak={10}
        />
      );
      expect(getByText('Keep the momentum!')).toBeTruthy();
      expect(getByText("Ensure you don't miss tomorrow")).toBeTruthy();
    });

    it('renders close button', () => {
      const { getByTestId } = render(
        <TipQuickActionsSheet {...defaultProps} />
      );
      expect(getByTestId('close-quick-actions')).toBeTruthy();
    });
  });

  describe('Interactivity', () => {
    it('calls onActionPress when a quick action is pressed', () => {
      const mockOnActionPress = jest.fn();
      const { getByText } = render(
        <TipQuickActionsSheet
          {...defaultProps}
          onActionPress={mockOnActionPress}
        />
      );

      fireEvent.press(getByText('Set Saturday reminder'));

      expect(mockOnActionPress).toHaveBeenCalledTimes(1);
      expect(mockOnActionPress).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'set-reminder',
          actionType: 'setReminder',
        })
      );
    });

    it('calls onClose when close button is pressed', () => {
      const mockOnClose = jest.fn();
      const { getByTestId } = render(
        <TipQuickActionsSheet {...defaultProps} onClose={mockOnClose} />
      );

      fireEvent.press(getByTestId('close-quick-actions'));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('triggers haptic feedback on action press', () => {
      const { getByText } = render(<TipQuickActionsSheet {...defaultProps} />);

      fireEvent.press(getByText('Set Saturday reminder'));

      expect(mockTriggerLightImpact).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility role for the container', () => {
      const { getByLabelText } = render(
        <TipQuickActionsSheet {...defaultProps} />
      );
      const container = getByLabelText('Quick actions for tip');
      expect(container.props.accessibilityRole).toBe('menu');
    });

    it('action buttons have proper accessibility labels', () => {
      const { getByLabelText } = render(
        <TipQuickActionsSheet {...defaultProps} />
      );
      expect(getByLabelText('Set Saturday reminder')).toBeTruthy();
    });

    it('action buttons have accessibility hints', () => {
      const { getByLabelText } = render(
        <TipQuickActionsSheet {...defaultProps} />
      );
      const action = getByLabelText('Set Saturday reminder');
      expect(action.props.accessibilityHint).toBe(
        'Get a notification to stay on track'
      );
    });

    it('close button has proper accessibility label', () => {
      const { getByLabelText } = render(
        <TipQuickActionsSheet {...defaultProps} />
      );
      expect(getByLabelText('Close quick actions')).toBeTruthy();
    });
  });
});

describe('getQuickActionsForTipType', () => {
  describe('focusDay tip type', () => {
    it('returns 3 actions for focus day', () => {
      const actions = getQuickActionsForTipType('focusDay', 'Saturday');
      expect(actions).toHaveLength(3);
    });

    it('includes day name in action labels', () => {
      const actions = getQuickActionsForTipType('focusDay', 'Saturday');
      expect(actions[0].label).toContain('Saturday');
      expect(actions[1].label).toContain('Saturday');
      expect(actions[2].label).toContain('Saturday');
    });

    it('includes day name in action data', () => {
      const actions = getQuickActionsForTipType('focusDay', 'Saturday');
      expect(actions[0].data?.dayName).toBe('Saturday');
    });

    it('has correct action types', () => {
      const actions = getQuickActionsForTipType('focusDay', 'Saturday');
      expect(actions[0].actionType).toBe('setReminder');
      expect(actions[1].actionType).toBe('makeSmaller');
      expect(actions[2].actionType).toBe('viewHistory');
    });
  });

  describe('lowStreak tip type', () => {
    it('returns 3 actions for low streak', () => {
      const actions = getQuickActionsForTipType('lowStreak');
      expect(actions).toHaveLength(3);
    });

    it('has correct action types', () => {
      const actions = getQuickActionsForTipType('lowStreak');
      expect(actions[0].actionType).toBe('setReminder');
      expect(actions[1].actionType).toBe('makeSmaller');
      expect(actions[2].actionType).toBe('reviewWhy');
    });

    it('has correct icons', () => {
      const actions = getQuickActionsForTipType('lowStreak');
      expect(actions[0].icon).toBe('bell');
      expect(actions[1].icon).toBe('zap');
      expect(actions[2].icon).toBe('heart');
    });
  });

  describe('goodStreak tip type', () => {
    it('returns 2 actions for good streak', () => {
      const actions = getQuickActionsForTipType('goodStreak', undefined, 10);
      expect(actions).toHaveLength(2);
    });

    it('includes streak count in subtitle', () => {
      const actions = getQuickActionsForTipType('goodStreak', undefined, 10);
      expect(actions[0].subtitle).toContain('10');
    });

    it('has correct action types', () => {
      const actions = getQuickActionsForTipType('goodStreak');
      expect(actions[0].actionType).toBe('celebrate');
      expect(actions[1].actionType).toBe('setReminder');
    });
  });

  describe('weekStreak tip type', () => {
    it('returns 2 actions for week streak', () => {
      const actions = getQuickActionsForTipType('weekStreak');
      expect(actions).toHaveLength(2);
    });

    it('has celebrate and editHabit action types', () => {
      const actions = getQuickActionsForTipType('weekStreak');
      expect(actions[0].actionType).toBe('celebrate');
      expect(actions[1].actionType).toBe('editHabit');
    });
  });

  describe('noData tip type', () => {
    it('returns 2 actions for no data', () => {
      const actions = getQuickActionsForTipType('noData');
      expect(actions).toHaveLength(2);
    });

    it('has celebrate and setReminder action types', () => {
      const actions = getQuickActionsForTipType('noData');
      expect(actions[0].actionType).toBe('celebrate');
      expect(actions[1].actionType).toBe('setReminder');
    });
  });
});

describe('determineTipTypeFromText', () => {
  describe('focusDay detection', () => {
    it('detects focus day from tip text', () => {
      const result = determineTipTypeFromText(
        'Focus on Saturday to level up!',
        5
      );
      expect(result.tipType).toBe('focusDay');
      expect(result.focusDayName).toBe('Saturday');
    });

    it('extracts first day when multiple days mentioned', () => {
      const result = determineTipTypeFromText(
        'Focus on Sat & Sun to level up!',
        5
      );
      expect(result.tipType).toBe('focusDay');
      expect(result.focusDayName).toBe('Sat');
    });

    it('handles case insensitive matching', () => {
      const result = determineTipTypeFromText(
        'focus on TUESDAY to level up!',
        5
      );
      expect(result.tipType).toBe('focusDay');
      expect(result.focusDayName).toBe('TUESDAY');
    });
  });

  describe('goodStreak detection', () => {
    it('detects amazing streak message', () => {
      const result = determineTipTypeFromText(
        'Amazing streak! Keep the momentum going.',
        10
      );
      expect(result.tipType).toBe('goodStreak');
    });

    it('detects keep the momentum message', () => {
      const result = determineTipTypeFromText('Keep the momentum!', 10);
      expect(result.tipType).toBe('goodStreak');
    });
  });

  describe('weekStreak detection', () => {
    it('detects week streak message', () => {
      const result = determineTipTypeFromText(
        '3 more days to hit a week streak!',
        4
      );
      expect(result.tipType).toBe('weekStreak');
    });
  });

  describe('lowStreak/noData detection', () => {
    it('returns noData when streak is 0 and tip mentions completing today', () => {
      const result = determineTipTypeFromText(
        'Complete today to start a new streak!',
        0
      );
      expect(result.tipType).toBe('noData');
    });

    it('returns lowStreak when streak > 0 and tip mentions completing today', () => {
      const result = determineTipTypeFromText(
        'Complete today to start a new streak!',
        1
      );
      expect(result.tipType).toBe('lowStreak');
    });

    it('returns noData for unknown tip with no streak', () => {
      const result = determineTipTypeFromText('Some random tip', 0);
      expect(result.tipType).toBe('noData');
    });

    it('returns lowStreak for unknown tip with streak', () => {
      const result = determineTipTypeFromText('Some random tip', 3);
      expect(result.tipType).toBe('lowStreak');
    });
  });
});

describe('QuickAction types', () => {
  it('all actions have required fields', () => {
    const tipTypes: TipType[] = [
      'focusDay',
      'lowStreak',
      'goodStreak',
      'weekStreak',
      'noData',
    ];

    tipTypes.forEach((tipType) => {
      const actions = getQuickActionsForTipType(tipType, 'Monday', 5);
      actions.forEach((action) => {
        expect(action.id).toBeDefined();
        expect(action.label).toBeDefined();
        expect(action.icon).toBeDefined();
        expect(action.actionType).toBeDefined();
      });
    });
  });

  it('all icons are valid icon names', () => {
    const validIcons = ['bell', 'edit-3', 'calendar', 'target', 'heart', 'zap'];
    const tipTypes: TipType[] = [
      'focusDay',
      'lowStreak',
      'goodStreak',
      'weekStreak',
      'noData',
    ];

    tipTypes.forEach((tipType) => {
      const actions = getQuickActionsForTipType(tipType);
      actions.forEach((action) => {
        expect(validIcons).toContain(action.icon);
      });
    });
  });

  it('all action types are valid', () => {
    const validActionTypes = [
      'setReminder',
      'editHabit',
      'viewHistory',
      'reviewWhy',
      'makeSmaller',
      'celebrate',
    ];
    const tipTypes: TipType[] = [
      'focusDay',
      'lowStreak',
      'goodStreak',
      'weekStreak',
      'noData',
    ];

    tipTypes.forEach((tipType) => {
      const actions = getQuickActionsForTipType(tipType);
      actions.forEach((action) => {
        expect(validActionTypes).toContain(action.actionType);
      });
    });
  });
});
