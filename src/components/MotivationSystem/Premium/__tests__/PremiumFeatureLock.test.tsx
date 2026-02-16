/**
 * Tests for PremiumFeatureLock component
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import {
  PremiumFeatureLock,
  FeatureLimitBadge,
  MotivationPremiumFeature,
} from '../PremiumFeatureLock';

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
    <mock-linear-gradient {...props}>{children}</mock-linear-gradient>
  ),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    default: {
      View,
      createAnimatedComponent: (component: unknown) => component,
    },
    useSharedValue: (initial: unknown) => ({ value: initial }),
    useAnimatedStyle: () => ({}),
    withTiming: (value: unknown) => value,
    withSpring: (value: unknown) => value,
    withRepeat: (value: unknown) => value,
    Easing: { inOut: () => (v: unknown) => v, ease: (v: unknown) => v },
    runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
  };
});

// Mock haptic feedback
jest.mock('@/hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    triggerLightImpact: jest.fn(),
    triggerSelection: jest.fn(),
    triggerSuccess: jest.fn(),
    triggerMediumImpact: jest.fn(),
    triggerHeavyImpact: jest.fn(),
    triggerWarning: jest.fn(),
    triggerError: jest.fn(),
  }),
}));

describe('PremiumFeatureLock', () => {
  const mockOnUpgrade = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Inline variant', () => {
    it('renders PRO badge with lock icon', () => {
      const { getByText } = render(
        <PremiumFeatureLock
          feature='voiceNotes'
          onUpgrade={mockOnUpgrade}
          variant='inline'
        />
      );

      expect(getByText('PRO')).toBeTruthy();
    });

    it('triggers onUpgrade when pressed', () => {
      const { getByRole } = render(
        <PremiumFeatureLock
          feature='voiceNotes'
          onUpgrade={mockOnUpgrade}
          variant='inline'
          testID='lock-badge'
        />
      );

      fireEvent.press(getByRole('button'));
      expect(mockOnUpgrade).toHaveBeenCalledTimes(1);
    });

    it('has correct accessibility labels', () => {
      const { getByLabelText } = render(
        <PremiumFeatureLock
          feature='letters'
          onUpgrade={mockOnUpgrade}
          variant='inline'
        />
      );

      expect(getByLabelText('Premium feature')).toBeTruthy();
    });
  });

  describe('Overlay variant', () => {
    it('renders feature title and description', () => {
      const { getByText } = render(
        <PremiumFeatureLock
          feature='voiceNotes'
          onUpgrade={mockOnUpgrade}
          variant='overlay'
        />
      );

      expect(getByText('Voice Notes')).toBeTruthy();
      expect(
        getByText('Record audio motivation from your most inspired moments')
      ).toBeTruthy();
    });

    it('shows science explanation when showScience is true', () => {
      const { getByText } = render(
        <PremiumFeatureLock
          feature='voiceNotes'
          onUpgrade={mockOnUpgrade}
          showScience
          variant='overlay'
        />
      );

      expect(
        getByText('Voice has 40% higher emotional recall than text')
      ).toBeTruthy();
    });

    it('shows free limit when applicable', () => {
      const { getByText } = render(
        <PremiumFeatureLock
          feature='voiceNotes'
          onUpgrade={mockOnUpgrade}
          variant='overlay'
        />
      );

      expect(getByText('Free tier: 1 recording')).toBeTruthy();
    });

    it('triggers onUpgrade when CTA is pressed', () => {
      const { getByRole } = render(
        <PremiumFeatureLock
          feature='letters'
          onUpgrade={mockOnUpgrade}
          variant='overlay'
        />
      );

      fireEvent.press(getByRole('button', { name: /unlock/i }));
      expect(mockOnUpgrade).toHaveBeenCalledTimes(1);
    });
  });

  describe('Card variant', () => {
    it('renders header with feature title', () => {
      const { getByText } = render(
        <PremiumFeatureLock
          feature='letters'
          onUpgrade={mockOnUpgrade}
          variant='card'
        />
      );

      expect(getByText('Letters to Self')).toBeTruthy();
    });

    it('shows free vs premium comparison', () => {
      const { getByText } = render(
        <PremiumFeatureLock
          feature='affirmations'
          onUpgrade={mockOnUpgrade}
          variant='card'
        />
      );

      expect(getByText('Unlimited Affirmations')).toBeTruthy();
    });

    it('shows science fact by default in card variant', () => {
      const { getByText } = render(
        <PremiumFeatureLock
          feature='rescueMode'
          onUpgrade={mockOnUpgrade}
          variant='card'
        />
      );

      expect(
        getByText('Streak protection is #1 retention driver (Duolingo)')
      ).toBeTruthy();
    });
  });

  describe('Feature metadata', () => {
    const features: MotivationPremiumFeature[] = [
      'voiceNotes',
      'letters',
      'visionBoard',
      'affirmations',
      'rescueMode',
      'advancedViz',
    ];

    features.forEach((feature) => {
      it(`renders correct content for ${feature}`, () => {
        const { getByText } = render(
          <PremiumFeatureLock
            feature={feature}
            onUpgrade={mockOnUpgrade}
            variant='overlay'
          />
        );

        // All features should have a title
        expect(getByText(/./)).toBeTruthy();
      });
    });
  });

  describe('Analytics tracking', () => {
    it('calls onLockViewed when mounted', () => {
      const mockOnLockViewed = jest.fn();

      render(
        <PremiumFeatureLock
          feature='voiceNotes'
          onLockViewed={mockOnLockViewed}
          onUpgrade={mockOnUpgrade}
        />
      );

      expect(mockOnLockViewed).toHaveBeenCalledWith('voiceNotes');
    });
  });

  describe('Accessibility', () => {
    it('respects reduceMotion prop', () => {
      const { getByTestId } = render(
        <PremiumFeatureLock
          feature='voiceNotes'
          onUpgrade={mockOnUpgrade}
          reduceMotion
          testID='lock-overlay'
          variant='overlay'
        />
      );

      // Component should still render
      expect(getByTestId('lock-overlay')).toBeTruthy();
    });
  });
});

describe('FeatureLimitBadge', () => {
  const mockOnUpgrade = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render for premium users', () => {
    const { queryByText } = render(
      <FeatureLimitBadge
        current={1}
        isPremium
        limit={2}
        onUpgrade={mockOnUpgrade}
      />
    );

    expect(queryByText(/Free/)).toBeNull();
  });

  it('shows current usage for free users', () => {
    const { getByText } = render(
      <FeatureLimitBadge
        current={1}
        isPremium={false}
        limit={2}
        onUpgrade={mockOnUpgrade}
      />
    );

    expect(getByText('1/2 Free')).toBeTruthy();
  });

  it('shows limit reached state', () => {
    const { getByText, getByRole } = render(
      <FeatureLimitBadge
        current={2}
        isPremium={false}
        limit={2}
        onUpgrade={mockOnUpgrade}
      />
    );

    expect(getByText('2/2 Free')).toBeTruthy();
    expect(getByRole('button')).toBeTruthy();
  });

  it('triggers onUpgrade when at limit and pressed', () => {
    const { getByRole } = render(
      <FeatureLimitBadge
        current={2}
        isPremium={false}
        limit={2}
        onUpgrade={mockOnUpgrade}
      />
    );

    fireEvent.press(getByRole('button'));
    expect(mockOnUpgrade).toHaveBeenCalledTimes(1);
  });

  it('is not pressable when under limit', () => {
    const { getByLabelText } = render(
      <FeatureLimitBadge
        current={1}
        isPremium={false}
        limit={2}
        onUpgrade={mockOnUpgrade}
      />
    );

    const badge = getByLabelText('1 of 2 free used');
    fireEvent.press(badge);
    expect(mockOnUpgrade).not.toHaveBeenCalled();
  });
});
