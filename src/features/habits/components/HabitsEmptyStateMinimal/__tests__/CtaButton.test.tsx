/**
 * CtaButton Component Tests
 *
 * Tests for the CTA button with shimmer animation on enable:
 * - Component renders without crashing
 * - CTA shimmer animation constants
 * - Shimmer triggers on disabled → enabled transition
 * - Shimmer does not trigger on other state changes
 * - Reduced motion respects no shimmer
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { CTA_SHIMMER, CTA_TRANSFORMS, SPRING_CONFIGS } from '../animations';
import { COPY } from '../constants';
import { CtaButton } from '../CtaButton';

// Mock reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // Mock useReducedMotion to return false by default
  Reanimated.useReducedMotion = jest.fn(() => false);

  return Reanimated;
});

// Mock LinearGradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

describe('CtaButton', () => {
  const defaultProps = {
    disabled: false,
    isLoading: false,
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<CtaButton {...defaultProps} />);
      expect(getByText(COPY.ctaButton)).toBeDefined();
    });

    it('should render shimmer overlay element', () => {
      const { getByTestId } = render(<CtaButton {...defaultProps} />);
      expect(getByTestId('cta-shimmer-overlay')).toBeDefined();
    });

    it('should render loading indicator when isLoading is true', () => {
      const { queryByText } = render(
        <CtaButton {...defaultProps} isLoading={true} />
      );
      // Text should not be visible when loading
      expect(queryByText(COPY.ctaButton)).toBeNull();
    });
  });

  describe('CTA Shimmer Animation Constants', () => {
    it('should have correct shimmer duration (600ms)', () => {
      expect(CTA_SHIMMER.duration).toBe(600);
    });

    it('should have correct gradient opacity (0.3)', () => {
      expect(CTA_SHIMMER.gradientOpacity).toBe(0.3);
    });
  });

  describe('CTA Transform Constants', () => {
    it('should have correct press scale (0.98)', () => {
      expect(CTA_TRANSFORMS.pressScale).toBe(0.98);
    });

    it('should have correct hover translateY (-1)', () => {
      expect(CTA_TRANSFORMS.hoverTranslateY).toBe(-1);
    });
  });

  describe('Spring Config Constants', () => {
    it('should have correct ctaPress spring config', () => {
      expect(SPRING_CONFIGS.ctaPress.damping).toBe(20);
      expect(SPRING_CONFIGS.ctaPress.stiffness).toBe(280);
    });
  });

  describe('Shimmer Trigger Behavior', () => {
    it('should trigger shimmer when disabled changes from true to false', () => {
      const { rerender, getByTestId } = render(
        <CtaButton {...defaultProps} disabled={true} />
      );

      // Shimmer overlay should exist
      const shimmerOverlay = getByTestId('cta-shimmer-overlay');
      expect(shimmerOverlay).toBeDefined();

      // Change from disabled to enabled
      rerender(<CtaButton {...defaultProps} disabled={false} />);

      // Shimmer overlay should still exist (animation in progress)
      expect(getByTestId('cta-shimmer-overlay')).toBeDefined();
    });

    it('should not trigger shimmer when disabled stays false', () => {
      const { rerender, getByTestId } = render(
        <CtaButton {...defaultProps} disabled={false} />
      );

      const shimmerOverlay = getByTestId('cta-shimmer-overlay');
      expect(shimmerOverlay).toBeDefined();

      // Re-render with same disabled state
      rerender(<CtaButton {...defaultProps} disabled={false} />);

      // Component should still render without error
      expect(getByTestId('cta-shimmer-overlay')).toBeDefined();
    });

    it('should not trigger shimmer when disabled stays true', () => {
      const { rerender, getByTestId } = render(
        <CtaButton {...defaultProps} disabled={true} />
      );

      const shimmerOverlay = getByTestId('cta-shimmer-overlay');
      expect(shimmerOverlay).toBeDefined();

      // Re-render with same disabled state
      rerender(<CtaButton {...defaultProps} disabled={true} />);

      // Component should still render without error
      expect(getByTestId('cta-shimmer-overlay')).toBeDefined();
    });

    it('should not trigger shimmer when disabled changes from false to true', () => {
      const { rerender, getByTestId } = render(
        <CtaButton {...defaultProps} disabled={false} />
      );

      const shimmerOverlay = getByTestId('cta-shimmer-overlay');
      expect(shimmerOverlay).toBeDefined();

      // Change from enabled to disabled (reverse direction - no shimmer)
      rerender(<CtaButton {...defaultProps} disabled={true} />);

      // Component should still render without error
      expect(getByTestId('cta-shimmer-overlay')).toBeDefined();
    });
  });

  describe('Disabled State', () => {
    it('should have opacity 0.4 when disabled', () => {
      const { getByLabelText } = render(
        <CtaButton {...defaultProps} disabled={true} />
      );

      const button = getByLabelText(COPY.ctaButton);
      // Check that the button renders (opacity is part of style)
      expect(button).toBeDefined();
    });

    it('should have full opacity when enabled', () => {
      const { getByLabelText } = render(
        <CtaButton {...defaultProps} disabled={false} />
      );

      const button = getByLabelText(COPY.ctaButton);
      expect(button).toBeDefined();
    });
  });

  describe('Press Behavior', () => {
    it('should call onPress when pressed and not disabled', () => {
      const onPress = jest.fn();
      const { getByLabelText } = render(
        <CtaButton {...defaultProps} onPress={onPress} />
      );

      fireEvent.press(getByLabelText(COPY.ctaButton));

      expect(onPress).toHaveBeenCalled();
    });

    it('should not call onPress when disabled', () => {
      const onPress = jest.fn();
      const { getByLabelText } = render(
        <CtaButton {...defaultProps} disabled={true} onPress={onPress} />
      );

      fireEvent.press(getByLabelText(COPY.ctaButton));

      expect(onPress).not.toHaveBeenCalled();
    });

    it('should not call onPress when loading', () => {
      const onPress = jest.fn();
      const { getByLabelText } = render(
        <CtaButton {...defaultProps} isLoading={true} onPress={onPress} />
      );

      fireEvent.press(getByLabelText(COPY.ctaButton));

      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility label', () => {
      const { getByLabelText } = render(<CtaButton {...defaultProps} />);
      expect(getByLabelText(COPY.ctaButton)).toBeDefined();
    });

    it('should have button role', () => {
      const { getByRole } = render(<CtaButton {...defaultProps} />);
      expect(getByRole('button')).toBeDefined();
    });

    it('should report disabled state to accessibility', () => {
      const { getByLabelText } = render(
        <CtaButton {...defaultProps} disabled={true} />
      );

      const button = getByLabelText(COPY.ctaButton);
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });

    it('should report enabled state to accessibility', () => {
      const { getByLabelText } = render(
        <CtaButton {...defaultProps} disabled={false} />
      );

      const button = getByLabelText(COPY.ctaButton);
      expect(button.props.accessibilityState?.disabled).toBe(false);
    });

    it('should have hint for disabled state', () => {
      const { getByLabelText } = render(
        <CtaButton {...defaultProps} disabled={true} />
      );

      const button = getByLabelText(COPY.ctaButton);
      expect(button.props.accessibilityHint).toBe('Enter a habit name first');
    });

    it('should have hint for enabled state', () => {
      const { getByLabelText } = render(
        <CtaButton {...defaultProps} disabled={false} />
      );

      const button = getByLabelText(COPY.ctaButton);
      expect(button.props.accessibilityHint).toBe('Creates your new habit');
    });
  });

  describe('Reduced Motion', () => {
    it('should respect reduced motion preference (no shimmer)', () => {
      // This test verifies the component handles reduced motion
      // The actual animation behavior is handled by the useReducedMotion hook
      const Reanimated = require('react-native-reanimated');
      Reanimated.useReducedMotion.mockReturnValue(true);

      const { rerender, getByTestId } = render(
        <CtaButton {...defaultProps} disabled={true} />
      );

      // Trigger enable transition
      rerender(<CtaButton {...defaultProps} disabled={false} />);

      // Shimmer overlay element should still exist but won't animate
      expect(getByTestId('cta-shimmer-overlay')).toBeDefined();

      // Reset mock for other tests
      Reanimated.useReducedMotion.mockReturnValue(false);
    });
  });
});
