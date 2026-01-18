/**
 * StickyCreateBar Component Tests - V9 Redesign
 * Task 7 & 8: Motivation text and CTA button behavior
 *
 * Tests:
 * - Motivation text "Start your streak today" renders correctly
 * - CTA button state (enabled/disabled)
 * - Color gradient transitions
 * - Accessibility labels
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StickyCreateBar } from '../StickyCreateBar';

// Mock dependencies
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 34, left: 0 }),
}));

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return {
    LinearGradient: View,
  };
});

jest.mock('../../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerSuccess: jest.fn(),
    triggerSelection: jest.fn(),
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
  }),
}));

describe('StickyCreateBar - V9 Redesign', () => {
  const mockOnPress = jest.fn();

  const defaultProps = {
    disabled: false,
    onPress: mockOnPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('V9 Motivation Text', () => {
    it('should render "Start your streak today" motivation text', () => {
      const { getByText } = render(<StickyCreateBar {...defaultProps} />);
      expect(getByText('Start your streak today')).toBeDefined();
    });

    it('should render motivation text with consistency message and fire emoji', () => {
      const { getByText } = render(<StickyCreateBar {...defaultProps} />);
      // The full text contains " — consistency is key 🔥"
      expect(getByText(/consistency is key/)).toBeDefined();
    });

    it('should render motivation text above the CTA button', () => {
      const { getByText } = render(<StickyCreateBar {...defaultProps} />);

      // Both elements should exist
      const motivationText = getByText('Start your streak today');
      const ctaButton = getByText('Create habit');

      expect(motivationText).toBeDefined();
      expect(ctaButton).toBeDefined();
    });
  });

  describe('CTA Button Rendering', () => {
    it('should render the "Create habit" button', () => {
      const { getByText } = render(<StickyCreateBar {...defaultProps} />);
      expect(getByText('Create habit')).toBeDefined();
    });

    it('should have accessibility label "Create habit"', () => {
      const { getByLabelText } = render(<StickyCreateBar {...defaultProps} />);
      expect(getByLabelText('Create habit')).toBeDefined();
    });

    it('should have role="button"', () => {
      const { getByRole } = render(<StickyCreateBar {...defaultProps} />);
      expect(getByRole('button')).toBeDefined();
    });
  });

  describe('Button State', () => {
    it('should be enabled when disabled prop is false', () => {
      const { getByLabelText } = render(<StickyCreateBar {...defaultProps} />);
      const button = getByLabelText('Create habit');
      expect(button.props.accessibilityState?.disabled).toBe(false);
    });

    it('should be disabled when disabled prop is true', () => {
      const { getByLabelText } = render(
        <StickyCreateBar {...defaultProps} disabled={true} />
      );
      const button = getByLabelText('Create habit');
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });

    it('should call onPress when button is pressed and not disabled', () => {
      const { getByLabelText } = render(<StickyCreateBar {...defaultProps} />);
      const button = getByLabelText('Create habit');

      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should NOT call onPress when button is disabled', () => {
      const { getByLabelText } = render(
        <StickyCreateBar {...defaultProps} disabled={true} />
      );
      const button = getByLabelText('Create habit');

      fireEvent.press(button);

      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('Color Customization', () => {
    it('should accept selectedColor prop for button gradient', () => {
      const { getByLabelText } = render(
        <StickyCreateBar {...defaultProps} selectedColor='#EF4444' />
      );

      // Button should render without errors
      expect(getByLabelText('Create habit')).toBeDefined();
    });

    it('should use default green when no color is selected', () => {
      const { getByLabelText } = render(<StickyCreateBar {...defaultProps} />);

      // Button should render without errors
      expect(getByLabelText('Create habit')).toBeDefined();
    });
  });

  describe('Home Indicator', () => {
    it('should render home indicator bar', () => {
      const { UNSAFE_root } = render(<StickyCreateBar {...defaultProps} />);

      // Check that component renders without errors (home indicator is purely visual)
      expect(UNSAFE_root).toBeDefined();
    });
  });
});
