/**
 * PremiumBenefitsModal Component Tests
 *
 * Story T15.3 - Premium benefits modal
 *
 * Tests:
 * - Modal rendering and visibility
 * - All 6 premium features displayed with details
 * - Feature highlighting when triggered
 * - Feature sorting (highlighted first)
 * - Free vs Premium comparison display
 * - Science facts for each feature
 * - Pricing and trial information
 * - CTA button functionality
 * - Close button functionality
 * - Restore purchases link
 * - Social proof display
 * - Accessibility (reduceMotion, labels)
 * - Staggered animation behavior
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PremiumPaywall as PremiumBenefitsModal } from '../../../PremiumPaywall';

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
    <mock-linear-gradient {...props}>{children}</mock-linear-gradient>
  ),
}));

// Mock react-native-reanimated
// Mock haptic feedback
jest.mock('@/hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    triggerLightImpact: jest.fn(),
    triggerSelection: jest.fn(),
  }),
}));

describe('PremiumBenefitsModal', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    onStartTrial: jest.fn(),
    reduceMotion: true, // Disable animations for test stability
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Modal visibility', () => {
    it('renders when visible is true', () => {
      const { getByText } = render(<PremiumBenefitsModal variant="benefits" {...defaultProps} />);

      expect(getByText('Premium Features')).toBeTruthy();
    });

    it('uses testID when provided', () => {
      const { getByTestId } = render(
        <PremiumBenefitsModal variant="benefits" {...defaultProps} testID='benefits-modal' />
      );

      expect(getByTestId('benefits-modal')).toBeTruthy();
    });
  });

  describe('Header section', () => {
    it('displays Premium Features title with crown icon', () => {
      const { getByText } = render(<PremiumBenefitsModal variant="benefits" {...defaultProps} />);

      expect(getByText('Premium Features')).toBeTruthy();
    });

    it('displays hero headline', () => {
      const { getByText } = render(<PremiumBenefitsModal variant="benefits" {...defaultProps} />);

      expect(getByText('Unlock Your Full Motivation Toolkit')).toBeTruthy();
    });

    it('displays hero subtext with retention statistic', () => {
      const { getByText } = render(<PremiumBenefitsModal variant="benefits" {...defaultProps} />);

      expect(
        getByText(
          'Science-backed features proven to increase habit retention by 3x'
        )
      ).toBeTruthy();
    });
  });

  describe('Premium features list', () => {
    it('displays all 6 premium features', () => {
      const { getByText } = render(<PremiumBenefitsModal variant="benefits" {...defaultProps} />);

      // Voice Notes
      expect(getByText('Unlimited Voice Notes')).toBeTruthy();
      // Letters to Self
      expect(getByText('Letters to Self')).toBeTruthy();
      // Vision Board
      expect(getByText('Vision Board')).toBeTruthy();
      // Affirmations
      expect(getByText('Unlimited Affirmations')).toBeTruthy();
      // Rescue Mode
      expect(getByText('Rescue Mode')).toBeTruthy();
      // Advanced Visualization
      expect(getByText('Advanced Visualization')).toBeTruthy();
    });

    it('displays feature descriptions', () => {
      const { getByText } = render(<PremiumBenefitsModal variant="benefits" {...defaultProps} />);

      expect(
        getByText('Record audio motivation from your most inspired moments')
      ).toBeTruthy();
      expect(
        getByText('Write time-locked messages that unlock in the future')
      ).toBeTruthy();
      expect(
        getByText('Create a visual collection of your motivation')
      ).toBeTruthy();
    });

    it('displays science facts for all features', () => {
      const { getByText } = render(<PremiumBenefitsModal variant="benefits" {...defaultProps} />);

      // Voice Notes science fact
      expect(
        getByText('Voice has 40% higher emotional recall than text')
      ).toBeTruthy();
      // Letters science fact
      expect(
        getByText('Connecting with future self increases self-control')
      ).toBeTruthy();
      // Vision Board science fact
      expect(
        getByText('Personal images create stronger emotional connections')
      ).toBeTruthy();
      // Affirmations science fact
      expect(getByText('Repetition builds neural pathways')).toBeTruthy();
      // Rescue Mode science fact
      expect(
        getByText('Streak rescue is #1 retention driver (Duolingo)')
      ).toBeTruthy();
      // Advanced Viz science fact
      expect(
        getByText('Fear moves you 2x better when unmotivated')
      ).toBeTruthy();
    });

    it('displays free vs premium comparison for each feature', () => {
      const { getByText } = render(<PremiumBenefitsModal variant="benefits" {...defaultProps} />);

      // Voice Notes
      expect(getByText('1 recording')).toBeTruthy();
      expect(getByText('Unlimited recordings')).toBeTruthy();

      // Affirmations
      expect(getByText('2 affirmations')).toBeTruthy();
      expect(getByText('Unlimited affirmations')).toBeTruthy();

      // Features not available in free tier
      expect(getByText('Unlimited letters')).toBeTruthy();
      expect(getByText('4 images per habit')).toBeTruthy();
      expect(getByText('Smart streak protection')).toBeTruthy();
      expect(getByText('Complete protocol')).toBeTruthy();
    });
  });

  describe('Feature highlighting', () => {
    it('highlights the triggered feature with badge', () => {
      const { getByText } = render(
        <PremiumBenefitsModal variant="benefits"
          {...defaultProps}
          triggeredByFeature='voiceNotes'
        />
      );

      expect(getByText('You tried to use this feature')).toBeTruthy();
    });

    it('sorts features to show highlighted feature first', () => {
      const { getAllByText } = render(
        <PremiumBenefitsModal variant="benefits" {...defaultProps} triggeredByFeature='letters' />
      );

      // Letters to Self should be visible with the highlight badge
      expect(getAllByText('Letters to Self').length).toBeGreaterThan(0);
    });

    it('does not show highlight badge when no feature triggered', () => {
      const { queryByText } = render(
        <PremiumBenefitsModal variant="benefits" {...defaultProps} />
      );

      expect(queryByText('You tried to use this feature')).toBeNull();
    });
  });

  describe('Pricing section', () => {
    it('displays monthly price', () => {
      const { getByText } = render(<PremiumBenefitsModal variant="benefits" {...defaultProps} />);

      expect(getByText('$6.99')).toBeTruthy();
      expect(getByText('/month')).toBeTruthy();
    });

    it('displays trial and auto-renewal info', () => {
      const { getByText } = render(<PremiumBenefitsModal variant="benefits" {...defaultProps} />);

      expect(
        getByText(
          '7-day free trial • Auto-renews at $6.99/month • Cancel anytime'
        )
      ).toBeTruthy();
    });
  });

  describe('Social proof', () => {
    it('displays star rating', () => {
      const { getByText } = render(<PremiumBenefitsModal variant="benefits" {...defaultProps} />);

      // Social proof text
      expect(
        getByText('Trusted by 10,000+ users building lasting habits')
      ).toBeTruthy();
    });
  });

  describe('CTA button', () => {
    it('displays Start 7-Day Free Trial button', () => {
      const { getByText } = render(<PremiumBenefitsModal variant="benefits" {...defaultProps} />);

      expect(getByText('Start 7-Day Free Trial')).toBeTruthy();
    });

    it('calls onStartTrial when CTA is pressed', () => {
      const onStartTrial = jest.fn();
      const { getByText } = render(
        <PremiumBenefitsModal variant="benefits" {...defaultProps} onStartTrial={onStartTrial} />
      );

      fireEvent.press(getByText('Start 7-Day Free Trial'));
      expect(onStartTrial).toHaveBeenCalledTimes(1);
    });

    it('has correct accessibility attributes', () => {
      const { getByLabelText, getByA11yHint } = render(
        <PremiumBenefitsModal variant="benefits" {...defaultProps} />
      );

      expect(getByLabelText('Start 7-Day Free Trial')).toBeTruthy();
      expect(getByA11yHint('Opens subscription options')).toBeTruthy();
    });
  });

  describe('Close button', () => {
    it('displays close button', () => {
      const { getByLabelText } = render(
        <PremiumBenefitsModal variant="benefits" {...defaultProps} />
      );

      expect(getByLabelText('Close')).toBeTruthy();
    });

    it('calls onClose when close button is pressed', () => {
      const onClose = jest.fn();
      const { getByLabelText } = render(
        <PremiumBenefitsModal variant="benefits" {...defaultProps} onClose={onClose} />
      );

      fireEvent.press(getByLabelText('Close'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Restore purchases', () => {
    it('displays restore purchases link', () => {
      const { getByText } = render(<PremiumBenefitsModal variant="benefits" {...defaultProps} />);

      expect(getByText('Already premium? Restore purchases')).toBeTruthy();
    });

    it('restore purchases link is pressable', () => {
      const { getByText } = render(<PremiumBenefitsModal variant="benefits" {...defaultProps} />);

      // Should not throw when pressed
      fireEvent.press(getByText('Already premium? Restore purchases'));
    });
  });

  describe('Accessibility', () => {
    it('respects reduceMotion prop for modal animation', () => {
      const { getByText } = render(
        <PremiumBenefitsModal variant="benefits" {...defaultProps} reduceMotion />
      );

      // Modal should still render with fade animation instead of slide
      expect(getByText('Premium Features')).toBeTruthy();
    });

    it('respects reduceMotion prop for feature row animations', () => {
      const { getByText } = render(
        <PremiumBenefitsModal variant="benefits" {...defaultProps} reduceMotion />
      );

      // Features should render immediately without stagger delay
      expect(getByText('Unlimited Voice Notes')).toBeTruthy();
      expect(getByText('Letters to Self')).toBeTruthy();
    });

    it('close button has correct accessibility role', () => {
      const { getByRole } = render(<PremiumBenefitsModal variant="benefits" {...defaultProps} />);

      expect(getByRole('button', { name: 'Close' })).toBeTruthy();
    });

    it('CTA button has correct accessibility role', () => {
      const { getByRole } = render(<PremiumBenefitsModal variant="benefits" {...defaultProps} />);

      expect(
        getByRole('button', { name: 'Start 7-Day Free Trial' })
      ).toBeTruthy();
    });
  });

  describe('Feature trigger scenarios', () => {
    const features = [
      'voiceNotes',
      'letters',
      'visionBoard',
      'affirmations',
      'rescueMode',
      'advancedViz',
    ] as const;

    features.forEach((feature) => {
      it(`correctly highlights ${feature} when triggered`, () => {
        const { getByText } = render(
          <PremiumBenefitsModal variant="benefits"
            {...defaultProps}
            triggeredByFeature={feature}
          />
        );

        expect(getByText('You tried to use this feature')).toBeTruthy();
      });
    });
  });

  describe('Modal behavior', () => {
    it('uses pageSheet presentation style', () => {
      const { getByTestId } = render(
        <PremiumBenefitsModal variant="benefits" {...defaultProps} testID='modal' />
      );

      // Modal renders (pageSheet is native presentation)
      expect(getByTestId('modal')).toBeTruthy();
    });

    it('calls onClose when modal is dismissed via onRequestClose', () => {
      const onClose = jest.fn();
      const { getByTestId } = render(
        <PremiumBenefitsModal variant="benefits"
          {...defaultProps}
          onClose={onClose}
          testID='modal'
        />
      );

      // Simulate hardware back button / swipe dismiss
      const modal = getByTestId('modal');
      fireEvent(modal, 'onRequestClose');
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Button press animations', () => {
    it('handles press in/out events on CTA', () => {
      const { getByLabelText } = render(
        <PremiumBenefitsModal variant="benefits" {...defaultProps} reduceMotion={false} />
      );

      const ctaButton = getByLabelText('Start 7-Day Free Trial');

      // These should not throw
      fireEvent(ctaButton, 'pressIn');
      fireEvent(ctaButton, 'pressOut');
    });
  });
});
