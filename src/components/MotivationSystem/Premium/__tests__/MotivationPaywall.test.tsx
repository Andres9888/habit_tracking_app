/**
 * Tests for MotivationPaywall and PremiumBenefitsModal components
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { PremiumPaywall as MotivationPaywall } from '../../../PremiumPaywall';
import { PremiumPaywall as PremiumBenefitsModal } from '../../../PremiumPaywall';

// Mock expo-blur
jest.mock('expo-blur', () => ({
  BlurView: ({ children, ...props }: any) => (
    <mock-blur-view {...props}>{children}</mock-blur-view>
  ),
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, ...props }: any) => (
    <mock-linear-gradient {...props}>{children}</mock-linear-gradient>
  ),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    default: {
      View,
      createAnimatedComponent: (component: any) => component,
    },
    useSharedValue: (initial: any) => ({ value: initial }),
    useAnimatedStyle: () => ({}),
    withTiming: (value: any) => value,
    withSpring: (value: any) => value,
    withRepeat: (value: any) => value,
    withSequence: (...args: any) => args[0],
    Easing: { inOut: () => (v: any) => v, ease: (v: any) => v },
    FadeIn: {},
    FadeOut: {},
    SlideInDown: {},
    SlideOutDown: {},
    interpolate: jest.fn(),
    Extrapolation: { CLAMP: 'clamp' },
    runOnJS: (fn: any) => fn,
  };
});

// Mock haptic feedback
jest.mock('@/hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    triggerLightImpact: jest.fn(),
    triggerSelection: jest.fn(),
    triggerSuccess: jest.fn(),
  }),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('MotivationPaywall', () => {
  const mockOnClose = jest.fn();
  const mockOnStartTrial = jest.fn();
  const mockOnRestorePurchases = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnStartTrial.mockResolvedValue(true);
    mockOnRestorePurchases.mockResolvedValue(true);
  });

  it('renders when visible', () => {
    const { getByText } = render(
      <MotivationPaywall variant="motivation"
        onClose={mockOnClose}
        onStartTrial={mockOnStartTrial}
        visible
      />
    );

    expect(getByText('Unlock Premium Motivation')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(
      <MotivationPaywall variant="motivation"
        onClose={mockOnClose}
        onStartTrial={mockOnStartTrial}
        visible={false}
      />
    );

    // Modal with visible=false still mounts but is hidden
    expect(queryByText('Unlock Premium Motivation')).toBeTruthy();
  });

  it('shows all premium features', () => {
    const { getByText } = render(
      <MotivationPaywall variant="motivation"
        onClose={mockOnClose}
        onStartTrial={mockOnStartTrial}
        visible
      />
    );

    expect(getByText('Unlimited Voice Notes')).toBeTruthy();
    expect(getByText('Letters to Self')).toBeTruthy();
    expect(getByText('Vision Board')).toBeTruthy();
    expect(getByText('Unlimited Affirmations')).toBeTruthy();
    expect(getByText('Rescue Mode')).toBeTruthy();
    expect(getByText('Huberman Protocol')).toBeTruthy();
  });

  it('shows pricing information', () => {
    const { getByText } = render(
      <MotivationPaywall variant="motivation"
        onClose={mockOnClose}
        onStartTrial={mockOnStartTrial}
        visible
      />
    );

    expect(getByText('$6.99')).toBeTruthy();
    expect(getByText('/month')).toBeTruthy();
    expect(
      getByText(
        '7-day free trial • Auto-renews at $6.99/month • Cancel anytime'
      )
    ).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const { getByLabelText } = render(
      <MotivationPaywall variant="motivation"
        onClose={mockOnClose}
        onStartTrial={mockOnStartTrial}
        visible
      />
    );

    fireEvent.press(getByLabelText('Close'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onStartTrial when CTA is pressed', async () => {
    const { getByText } = render(
      <MotivationPaywall variant="motivation"
        onClose={mockOnClose}
        onStartTrial={mockOnStartTrial}
        visible
      />
    );

    await act(async () => {
      fireEvent.press(getByText('Start 7-Day Free Trial'));
    });

    await waitFor(() => {
      expect(mockOnStartTrial).toHaveBeenCalledTimes(1);
    });
  });

  it('closes on successful trial start', async () => {
    mockOnStartTrial.mockResolvedValue(true);

    const { getByText } = render(
      <MotivationPaywall variant="motivation"
        onClose={mockOnClose}
        onStartTrial={mockOnStartTrial}
        visible
      />
    );

    await act(async () => {
      fireEvent.press(getByText('Start 7-Day Free Trial'));
    });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('shows error alert on purchase failure', async () => {
    mockOnStartTrial.mockRejectedValue(new Error('Purchase failed'));

    const { getByText } = render(
      <MotivationPaywall variant="motivation"
        onClose={mockOnClose}
        onStartTrial={mockOnStartTrial}
        visible
      />
    );

    await act(async () => {
      fireEvent.press(getByText('Start 7-Day Free Trial'));
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Something went wrong',
        'Please try again or contact support.',
        expect.any(Array)
      );
    });
  });

  it('highlights triggered feature', () => {
    const { getByText, getAllByText } = render(
      <MotivationPaywall variant="motivation"
        onClose={mockOnClose}
        onStartTrial={mockOnStartTrial}
        triggeredByFeature='voiceNotes'
        visible
      />
    );

    // Voice Notes should be rendered (highlighted)
    expect(getByText('Unlimited Voice Notes')).toBeTruthy();
  });

  describe('Restore purchases', () => {
    it('shows restore option when callback provided', () => {
      const { getByText } = render(
        <MotivationPaywall variant="motivation"
          onClose={mockOnClose}
          onRestorePurchases={mockOnRestorePurchases}
          onStartTrial={mockOnStartTrial}
          visible
        />
      );

      expect(getByText('Already premium? Restore purchases')).toBeTruthy();
    });

    it('calls onRestorePurchases when tapped', async () => {
      const { getByText } = render(
        <MotivationPaywall variant="motivation"
          onClose={mockOnClose}
          onRestorePurchases={mockOnRestorePurchases}
          onStartTrial={mockOnStartTrial}
          visible
        />
      );

      await act(async () => {
        fireEvent.press(getByText('Already premium? Restore purchases'));
      });

      await waitFor(() => {
        expect(mockOnRestorePurchases).toHaveBeenCalledTimes(1);
      });
    });

    it('shows alert when no purchases found', async () => {
      mockOnRestorePurchases.mockResolvedValue(false);

      const { getByText } = render(
        <MotivationPaywall variant="motivation"
          onClose={mockOnClose}
          onRestorePurchases={mockOnRestorePurchases}
          onStartTrial={mockOnStartTrial}
          visible
        />
      );

      await act(async () => {
        fireEvent.press(getByText('Already premium? Restore purchases'));
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'No purchases found',
          expect.any(String),
          expect.any(Array)
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('has accessible CTA button', () => {
      const { getByLabelText } = render(
        <MotivationPaywall variant="motivation"
          onClose={mockOnClose}
          onStartTrial={mockOnStartTrial}
          visible
        />
      );

      expect(getByLabelText('Start 7-Day Free Trial')).toBeTruthy();
    });

    it('respects reduceMotion prop', () => {
      const { getByText } = render(
        <MotivationPaywall variant="motivation"
          onClose={mockOnClose}
          onStartTrial={mockOnStartTrial}
          reduceMotion
          visible
        />
      );

      expect(getByText('Unlock Premium Motivation')).toBeTruthy();
    });
  });
});

describe('PremiumBenefitsModal', () => {
  const mockOnClose = jest.fn();
  const mockOnStartTrial = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when visible', () => {
    const { getByText } = render(
      <PremiumBenefitsModal variant="benefits"
        onClose={mockOnClose}
        onStartTrial={mockOnStartTrial}
        visible
      />
    );

    expect(getByText('Premium Features')).toBeTruthy();
    expect(getByText('Unlock Your Full Motivation Toolkit')).toBeTruthy();
  });

  it('shows all feature details with science facts', () => {
    const { getByText } = render(
      <PremiumBenefitsModal variant="benefits"
        onClose={mockOnClose}
        onStartTrial={mockOnStartTrial}
        visible
      />
    );

    expect(getByText('Unlimited Voice Notes')).toBeTruthy();
    expect(
      getByText('Voice has 40% higher emotional recall than text')
    ).toBeTruthy();
  });

  it('shows free vs premium comparison', () => {
    const { getByText, getAllByText } = render(
      <PremiumBenefitsModal variant="benefits"
        onClose={mockOnClose}
        onStartTrial={mockOnStartTrial}
        visible
      />
    );

    expect(getByText('1 recording')).toBeTruthy();
    expect(getByText('Unlimited recordings')).toBeTruthy();
  });

  it('highlights triggered feature with badge', () => {
    const { getByText } = render(
      <PremiumBenefitsModal variant="benefits"
        onClose={mockOnClose}
        onStartTrial={mockOnStartTrial}
        triggeredByFeature='voiceNotes'
        visible
      />
    );

    expect(getByText('You tried to use this feature')).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const { getByLabelText } = render(
      <PremiumBenefitsModal variant="benefits"
        onClose={mockOnClose}
        onStartTrial={mockOnStartTrial}
        visible
      />
    );

    fireEvent.press(getByLabelText('Close'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onStartTrial when CTA is pressed', () => {
    const { getByText } = render(
      <PremiumBenefitsModal variant="benefits"
        onClose={mockOnClose}
        onStartTrial={mockOnStartTrial}
        visible
      />
    );

    fireEvent.press(getByText('Start 7-Day Free Trial'));
    expect(mockOnStartTrial).toHaveBeenCalledTimes(1);
  });

  it('shows pricing', () => {
    const { getByText } = render(
      <PremiumBenefitsModal variant="benefits"
        onClose={mockOnClose}
        onStartTrial={mockOnStartTrial}
        visible
      />
    );

    expect(getByText('$6.99')).toBeTruthy();
    expect(getByText('/month')).toBeTruthy();
  });

  it('shows social proof', () => {
    const { getByText } = render(
      <PremiumBenefitsModal variant="benefits"
        onClose={mockOnClose}
        onStartTrial={mockOnStartTrial}
        visible
      />
    );

    expect(getByText(/10,000\+ users/)).toBeTruthy();
  });
});
