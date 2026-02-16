/**
 * Premium Gating Integration Tests
 *
 * Story T16.3: Premium gating tests
 *
 * Comprehensive tests for the Motivation System's premium gating:
 * - Feature-level gating (6 premium features)
 * - Free tier limits and badge displays
 * - onPremiumRequired callback triggers
 * - Premium upsell flow: feature lock → benefits → paywall
 * - Consistent premium state across all features
 * - PremiumFeatureLock variants (inline, overlay, card)
 * - FeatureLimitBadge behavior
 *
 * Premium Features Tested:
 * 1. voiceNotes (1 free, unlimited premium)
 * 2. letters (0 free, premium only)
 * 3. visionBoard (0 free, premium only)
 * 4. affirmations (2 free, unlimited premium)
 * 5. rescueMode (0 free, premium only)
 * 6. advancedViz (basic free, full protocol premium)
 */

import React, { useState } from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { View, Text, Button } from 'react-native';

// Import premium components
import {
  PremiumFeatureLock,
  FeatureLimitBadge,
  type MotivationPremiumFeature,
} from '../../../src/components/MotivationSystem/Premium/PremiumFeatureLock';
import { usePremiumUpsell } from '../../../src/components/MotivationSystem/Premium/usePremiumUpsell';

// Import feature sections
import { VoiceNotesSection } from '../../../src/components/MotivationSystem/Workshop/VoiceNotesSection';
import { AffirmationsSection } from '../../../src/components/MotivationSystem/Workshop/AffirmationsSection';
import { VisionBoardSection } from '../../../src/components/MotivationSystem/Workshop/VisionBoardSection';
import { LettersSection } from '../../../src/components/MotivationSystem/Workshop/LettersSection';

// ─────────────────────────────────────────────────────────────────────────────
// Mocks
// ─────────────────────────────────────────────────────────────────────────────

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Mock useHapticFeedback hook
jest.mock('../../../src/hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    triggerLightImpact: jest.fn(),
    triggerMediumImpact: jest.fn(),
    triggerHeavyImpact: jest.fn(),
    triggerSelection: jest.fn(),
    triggerSuccess: jest.fn(),
    triggerWarning: jest.fn(),
    triggerError: jest.fn(),
  }),
}));

// Mock lucide-react-native with Proxy for dynamic icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop === '__esModule') return true;
        return function MockIcon(props: any) {
          return React.createElement(View, {
            testID: `lucide-icon-${String(prop)}`,
            ...props,
          });
        };
      },
    }
  );
});

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, ...props }: any) => (
    <mock-linear-gradient {...props}>{children}</mock-linear-gradient>
  ),
}));

// Mock expo-blur
jest.mock('expo-blur', () => ({
  BlurView: ({ children, ...props }: any) => (
    <mock-blur-view {...props}>{children}</mock-blur-view>
  ),
}));

// Mock clsx
jest.mock('clsx', () => ({
  clsx: (...args: any[]) =>
    args
      .flat()
      .filter((a) => typeof a === 'string')
      .join(' ')
      .trim(),
}));

// Mock react-native-reanimated
// Mock useAudioRecording hook
jest.mock('../../../src/hooks/useAudioRecording', () => ({
  useAudioRecording: () => ({
    status: {
      state: 'idle',
      durationSeconds: 0,
      meteringLevel: 0,
      hasPermission: true,
      errorMessage: null,
      recordingUri: null,
    },
    startRecording: jest.fn(),
    stopRecording: jest.fn(),
    pauseRecording: jest.fn(),
    resumeRecording: jest.fn(),
    cancelRecording: jest.fn(),
    reset: jest.fn(),
    isRecording: false,
    isPaused: false,
    canStartRecording: true,
    formattedDuration: '00:00',
    isMaxDurationReached: false,
  }),
  RecordingState: {},
}));

// Mock useAudioPlayback hook
jest.mock('../../../src/hooks/useAudioPlayback', () => ({
  useAudioPlayback: () => ({
    status: {
      state: 'ready',
      positionSeconds: 0,
      durationSeconds: 60,
      progress: 0,
      speed: 1,
      isMuted: false,
      didJustFinish: false,
      errorMessage: null,
      audioUri: 'file:///test.m4a',
    },
    loadAudio: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    togglePlayPause: jest.fn(),
    seekToProgress: jest.fn(),
    setSpeed: jest.fn(),
    toggleMute: jest.fn(),
    replay: jest.fn(),
    unloadAudio: jest.fn(),
    isPlaying: false,
    isReady: true,
    isLoading: false,
    formattedPosition: '0:00',
    formattedDuration: '1:00',
    formattedRemaining: '-1:00',
  }),
  PLAYBACK_SPEEDS: [0.5, 1, 1.5, 2],
}));

// Mock useImagePicker hook
jest.mock('../../../src/hooks/useImagePicker', () => ({
  useImagePicker: () => ({
    pickFromCamera: jest.fn(),
    pickFromLibrary: jest.fn(),
    pickWithChoice: jest.fn(),
    clearImage: jest.fn(),
    isLoading: false,
    image: null,
    error: null,
  }),
}));

// Mock useImageUpload hook
jest.mock('../../../src/hooks/useImageUpload', () => ({
  useImageUpload: () => ({
    uploadImage: jest.fn(),
    isUploading: false,
    progress: 0,
    error: null,
    clearError: jest.fn(),
  }),
}));

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    requestPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
    setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
    Recording: {
      createAsync: jest.fn().mockResolvedValue({ recording: {} }),
    },
    Sound: {
      createAsync: jest.fn().mockResolvedValue({ sound: {} }),
    },
  },
}));

// Mock Alert (using spyOn instead of mocking entire react-native module)
import { Alert } from 'react-native';
jest.spyOn(Alert, 'alert');

// ─────────────────────────────────────────────────────────────────────────────
// Test Fixtures
// ─────────────────────────────────────────────────────────────────────────────

const ALL_PREMIUM_FEATURES: MotivationPremiumFeature[] = [
  'voiceNotes',
  'letters',
  'visionBoard',
  'affirmations',
  'rescueMode',
  'advancedViz',
];

const FEATURE_METADATA: Record<
  MotivationPremiumFeature,
  {
    title: string;
    freeLimit: number | null;
    description: string;
  }
> = {
  voiceNotes: {
    title: 'Voice Notes',
    freeLimit: 1,
    description: 'Record audio motivation from your most inspired moments',
  },
  letters: {
    title: 'Letters to Self',
    freeLimit: null,
    description: 'Write time-locked messages to your future self',
  },
  visionBoard: {
    title: 'Vision Board',
    freeLimit: null,
    description: 'Create a visual collection of your motivation',
  },
  affirmations: {
    title: 'Unlimited Affirmations',
    freeLimit: 2,
    description: 'Add as many daily affirmations as you need',
  },
  rescueMode: {
    title: 'Rescue Mode',
    freeLimit: null,
    description: 'Get interventions when your streak is at risk',
  },
  advancedViz: {
    title: 'Advanced Visualization',
    freeLimit: null,
    description: 'Full Huberman protocol with Body/Mind/Emotion breakdown',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Integration Tests: PremiumFeatureLock Component
// ─────────────────────────────────────────────────────────────────────────────

describe('PremiumFeatureLock Integration', () => {
  const mockOnUpgrade = jest.fn();
  const mockOnLockViewed = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('All Premium Features Coverage', () => {
    ALL_PREMIUM_FEATURES.forEach((feature) => {
      const metadata = FEATURE_METADATA[feature];

      describe(`Feature: ${feature}`, () => {
        it(`renders inline variant with PRO badge for ${feature}`, () => {
          const { getByText, getByRole } = render(
            <PremiumFeatureLock
              feature={feature}
              onUpgrade={mockOnUpgrade}
              variant='inline'
            />
          );

          expect(getByText('PRO')).toBeTruthy();
          expect(getByRole('button')).toBeTruthy();
        });

        it(`renders overlay variant with feature title for ${feature}`, () => {
          const { getByText } = render(
            <PremiumFeatureLock
              feature={feature}
              onUpgrade={mockOnUpgrade}
              variant='overlay'
            />
          );

          expect(getByText(metadata.title)).toBeTruthy();
          expect(getByText(metadata.description)).toBeTruthy();
        });

        it(`triggers onUpgrade when pressed for ${feature}`, () => {
          const { getByRole } = render(
            <PremiumFeatureLock
              feature={feature}
              onUpgrade={mockOnUpgrade}
              variant='inline'
            />
          );

          fireEvent.press(getByRole('button'));
          expect(mockOnUpgrade).toHaveBeenCalledTimes(1);
        });

        it(`calls onLockViewed analytics callback for ${feature}`, () => {
          render(
            <PremiumFeatureLock
              feature={feature}
              onUpgrade={mockOnUpgrade}
              onLockViewed={mockOnLockViewed}
            />
          );

          expect(mockOnLockViewed).toHaveBeenCalledWith(feature);
        });
      });
    });
  });

  describe('Variant Behaviors', () => {
    it('inline variant shows minimal PRO badge', () => {
      const { getByText, queryByText } = render(
        <PremiumFeatureLock
          feature='voiceNotes'
          onUpgrade={mockOnUpgrade}
          variant='inline'
        />
      );

      expect(getByText('PRO')).toBeTruthy();
      // Should not show description in inline mode
      expect(
        queryByText('Record audio motivation from your most inspired moments')
      ).toBeNull();
    });

    it('overlay variant shows full feature info', () => {
      const { getByText, getByRole } = render(
        <PremiumFeatureLock
          feature='letters'
          onUpgrade={mockOnUpgrade}
          variant='overlay'
        />
      );

      expect(getByText('Letters to Self')).toBeTruthy();
      expect(
        getByText('Write time-locked messages to your future self')
      ).toBeTruthy();
      expect(getByRole('button', { name: /unlock/i })).toBeTruthy();
    });

    it('card variant shows feature info and science', () => {
      const { getByText } = render(
        <PremiumFeatureLock
          feature='rescueMode'
          onUpgrade={mockOnUpgrade}
          variant='card'
          showScience
        />
      );

      expect(getByText('Rescue Mode')).toBeTruthy();
      expect(
        getByText('Get interventions when your streak is at risk')
      ).toBeTruthy();
      // Science callout is shown with showScience=true (default for card)
      expect(
        getByText('Streak protection is #1 retention driver (Duolingo)')
      ).toBeTruthy();
    });

    it('shows science explanation when showScience prop is true', () => {
      const { getByText } = render(
        <PremiumFeatureLock
          feature='voiceNotes'
          onUpgrade={mockOnUpgrade}
          variant='overlay'
          showScience
        />
      );

      expect(
        getByText('Voice has 40% higher emotional recall than text')
      ).toBeTruthy();
    });
  });

  describe('Free Tier Limits Display', () => {
    it('shows free tier limit for voiceNotes (1 recording)', () => {
      const { getByText } = render(
        <PremiumFeatureLock
          feature='voiceNotes'
          onUpgrade={mockOnUpgrade}
          variant='overlay'
        />
      );

      expect(getByText('Free tier: 1 recording')).toBeTruthy();
    });

    it('shows free tier limit for affirmations (2 affirmations)', () => {
      const { getByText } = render(
        <PremiumFeatureLock
          feature='affirmations'
          onUpgrade={mockOnUpgrade}
          variant='overlay'
        />
      );

      expect(getByText('Free tier: 2 affirmations')).toBeTruthy();
    });

    it('does not show free tier for premium-only features', () => {
      const { queryByText } = render(
        <PremiumFeatureLock
          feature='letters'
          onUpgrade={mockOnUpgrade}
          variant='overlay'
        />
      );

      expect(queryByText(/Free tier/)).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility labels', () => {
      const { getByLabelText } = render(
        <PremiumFeatureLock
          feature='visionBoard'
          onUpgrade={mockOnUpgrade}
          variant='inline'
        />
      );

      expect(getByLabelText('Premium feature')).toBeTruthy();
    });

    it('respects reduceMotion prop', () => {
      const { getByTestId } = render(
        <PremiumFeatureLock
          feature='advancedViz'
          onUpgrade={mockOnUpgrade}
          reduceMotion
          testID='lock-component'
          variant='overlay'
        />
      );

      expect(getByTestId('lock-component')).toBeTruthy();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Integration Tests: FeatureLimitBadge
// ─────────────────────────────────────────────────────────────────────────────

describe('FeatureLimitBadge Integration', () => {
  const mockOnUpgrade = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Free User Scenarios', () => {
    it('displays current/limit usage (e.g., "1/2 Free")', () => {
      const { getByText } = render(
        <FeatureLimitBadge
          current={1}
          limit={2}
          isPremium={false}
          onUpgrade={mockOnUpgrade}
        />
      );

      expect(getByText('1/2 Free')).toBeTruthy();
    });

    it('displays 0 usage at start', () => {
      const { getByText } = render(
        <FeatureLimitBadge
          current={0}
          limit={2}
          isPremium={false}
          onUpgrade={mockOnUpgrade}
        />
      );

      expect(getByText('0/2 Free')).toBeTruthy();
    });

    it('shows at-limit state with upgrade option', () => {
      const { getByText, getByRole } = render(
        <FeatureLimitBadge
          current={2}
          limit={2}
          isPremium={false}
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
          limit={2}
          isPremium={false}
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
          limit={2}
          isPremium={false}
          onUpgrade={mockOnUpgrade}
        />
      );

      const badge = getByLabelText('1 of 2 free used');
      fireEvent.press(badge);
      expect(mockOnUpgrade).not.toHaveBeenCalled();
    });
  });

  describe('Premium User Scenarios', () => {
    it('does not render for premium users', () => {
      const { queryByText } = render(
        <FeatureLimitBadge
          current={5}
          limit={2}
          isPremium={true}
          onUpgrade={mockOnUpgrade}
        />
      );

      expect(queryByText(/Free/)).toBeNull();
    });

    it('does not show any badge regardless of current count', () => {
      const { toJSON } = render(
        <FeatureLimitBadge
          current={10}
          limit={2}
          isPremium={true}
          onUpgrade={mockOnUpgrade}
        />
      );

      // Should not render any meaningful content for premium users
      // FeatureLimitBadge returns null for premium users
      expect(toJSON()).toBeNull();
    });
  });

  describe('Various Limit Configurations', () => {
    it('handles 1/1 limit (voiceNotes)', () => {
      const { getByText } = render(
        <FeatureLimitBadge
          current={0}
          limit={1}
          isPremium={false}
          onUpgrade={mockOnUpgrade}
        />
      );

      expect(getByText('0/1 Free')).toBeTruthy();
    });

    it('handles larger limits correctly', () => {
      const { getByText } = render(
        <FeatureLimitBadge
          current={5}
          limit={10}
          isPremium={false}
          onUpgrade={mockOnUpgrade}
        />
      );

      expect(getByText('5/10 Free')).toBeTruthy();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Integration Tests: usePremiumUpsell Hook
// ─────────────────────────────────────────────────────────────────────────────

describe('usePremiumUpsell Hook Integration', () => {
  // Test wrapper component to test the hook
  const HookTestComponent: React.FC<{
    onStateChange?: (state: ReturnType<typeof usePremiumUpsell>) => void;
  }> = ({ onStateChange }) => {
    const upsellState = usePremiumUpsell();

    React.useEffect(() => {
      onStateChange?.(upsellState);
    }, [
      upsellState.showPaywall,
      upsellState.showBenefits,
      upsellState.triggeredFeature,
    ]);

    return (
      <View>
        <Text testID='paywall-visible'>
          {upsellState.showPaywall ? 'paywall' : 'hidden'}
        </Text>
        <Text testID='benefits-visible'>
          {upsellState.showBenefits ? 'benefits' : 'hidden'}
        </Text>
        <Text testID='triggered-feature'>
          {upsellState.triggeredFeature || 'none'}
        </Text>
        <Button
          testID='trigger-paywall'
          title='Trigger Paywall'
          onPress={() => upsellState.triggerPaywall('voiceNotes')}
        />
        <Button
          testID='trigger-benefits'
          title='Trigger Benefits'
          onPress={() => upsellState.triggerBenefits('letters')}
        />
        <Button
          testID='dismiss-paywall'
          title='Dismiss Paywall'
          onPress={() => upsellState.dismissPaywall()}
        />
        <Button
          testID='benefits-to-paywall'
          title='Benefits to Paywall'
          onPress={() => upsellState.benefitsToPaywall()}
        />
      </View>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes with all modals hidden', () => {
    const { getByTestId } = render(<HookTestComponent />);

    expect(getByTestId('paywall-visible').props.children).toBe('hidden');
    expect(getByTestId('benefits-visible').props.children).toBe('hidden');
    expect(getByTestId('triggered-feature').props.children).toBe('none');
  });

  it('shows paywall and sets feature when triggered', () => {
    const { getByTestId } = render(<HookTestComponent />);

    fireEvent.press(getByTestId('trigger-paywall'));

    expect(getByTestId('paywall-visible').props.children).toBe('paywall');
    expect(getByTestId('triggered-feature').props.children).toBe('voiceNotes');
  });

  it('shows benefits modal when triggered', () => {
    const { getByTestId } = render(<HookTestComponent />);

    fireEvent.press(getByTestId('trigger-benefits'));

    expect(getByTestId('benefits-visible').props.children).toBe('benefits');
    expect(getByTestId('triggered-feature').props.children).toBe('letters');
  });

  it('transitions from benefits to paywall', async () => {
    const { getByTestId } = render(<HookTestComponent />);

    // First trigger benefits
    fireEvent.press(getByTestId('trigger-benefits'));
    expect(getByTestId('benefits-visible').props.children).toBe('benefits');

    // Then transition to paywall
    fireEvent.press(getByTestId('benefits-to-paywall'));

    // Benefits should be hidden immediately
    expect(getByTestId('benefits-visible').props.children).toBe('hidden');

    // Advance timers for the delayed paywall show
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(getByTestId('paywall-visible').props.children).toBe('paywall');
    // Feature should be preserved
    expect(getByTestId('triggered-feature').props.children).toBe('letters');
  });

  it('clears triggered feature after dismissal delay', () => {
    const { getByTestId } = render(<HookTestComponent />);

    // Trigger and dismiss paywall
    fireEvent.press(getByTestId('trigger-paywall'));
    expect(getByTestId('triggered-feature').props.children).toBe('voiceNotes');

    fireEvent.press(getByTestId('dismiss-paywall'));

    // Feature should still be set for animation
    expect(getByTestId('triggered-feature').props.children).toBe('voiceNotes');

    // After delay, feature should be cleared
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(getByTestId('triggered-feature').props.children).toBe('none');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Integration Tests: Feature Section Premium Gating
// ─────────────────────────────────────────────────────────────────────────────

describe('Feature Section Premium Gating Integration', () => {
  describe('VoiceNotesSection (1 free, unlimited premium)', () => {
    const defaultProps = {
      voiceNotes: [],
      voiceNoteCount: 0,
      isPremium: false,
      onSaveRecording: jest.fn(),
      onViewAllNotes: jest.fn(),
      onPremiumRequired: jest.fn(),
      reduceMotion: true,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('shows free tier badge for non-premium users', () => {
      const { getByText } = render(<VoiceNotesSection {...defaultProps} />);

      expect(getByText('0/1 Free')).toBeTruthy();
    });

    it('allows first recording for free users', () => {
      const { getByText } = render(<VoiceNotesSection {...defaultProps} />);

      // "Record Your Day 1" should be visible and work
      expect(getByText('Record Your Day 1')).toBeTruthy();
    });

    it('triggers onPremiumRequired when free user at limit tries to record', () => {
      const onPremiumRequired = jest.fn();
      const { getByText } = render(
        <VoiceNotesSection
          {...defaultProps}
          voiceNoteCount={1}
          onPremiumRequired={onPremiumRequired}
        />
      );

      fireEvent.press(getByText('New Recording'));

      expect(onPremiumRequired).toHaveBeenCalled();
    });

    it('allows unlimited recordings for premium users', () => {
      const onPremiumRequired = jest.fn();
      const { getByText, queryByText } = render(
        <VoiceNotesSection
          {...defaultProps}
          voiceNoteCount={10}
          isPremium={true}
          onPremiumRequired={onPremiumRequired}
        />
      );

      // Should not show free tier badge
      expect(queryByText(/Free/)).toBeNull();

      fireEvent.press(getByText('New Recording'));

      // Should not trigger premium required
      expect(onPremiumRequired).not.toHaveBeenCalled();
    });
  });

  describe('AffirmationsSection (2 free, unlimited premium)', () => {
    const defaultProps = {
      affirmations: [],
      affirmationCount: 0,
      isPremium: false,
      onSaveAffirmation: jest.fn(),
      onUpdateAffirmation: jest.fn(),
      onDeleteAffirmation: jest.fn(),
      onPremiumRequired: jest.fn(),
      reduceMotion: true,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('shows free tier badge for non-premium users', () => {
      const { getByText } = render(
        <AffirmationsSection {...defaultProps} affirmationCount={1} />
      );

      expect(getByText('1/2 Free')).toBeTruthy();
    });

    it('shows upgrade prompt when free user at limit', () => {
      const mockAffirmations = [
        { id: '1', text: 'First', createdAt: Date.now() },
        { id: '2', text: 'Second', createdAt: Date.now() },
      ];

      const { getByText, queryByLabelText } = render(
        <AffirmationsSection
          {...defaultProps}
          affirmations={mockAffirmations}
          affirmationCount={2}
        />
      );

      // Add button should be hidden, upgrade prompt shown
      expect(queryByLabelText('Add a new affirmation')).toBeNull();
      expect(getByText('Upgrade for Unlimited')).toBeTruthy();
    });

    it('triggers onPremiumRequired when upgrade prompt pressed', () => {
      const onPremiumRequired = jest.fn();
      const mockAffirmations = [
        { id: '1', text: 'First', createdAt: Date.now() },
        { id: '2', text: 'Second', createdAt: Date.now() },
      ];

      const { getByText } = render(
        <AffirmationsSection
          {...defaultProps}
          affirmations={mockAffirmations}
          affirmationCount={2}
          onPremiumRequired={onPremiumRequired}
        />
      );

      fireEvent.press(getByText('Upgrade for Unlimited'));

      expect(onPremiumRequired).toHaveBeenCalled();
    });

    it('shows Add button for premium users regardless of count', () => {
      const mockAffirmations = [
        { id: '1', text: 'First', createdAt: Date.now() },
        { id: '2', text: 'Second', createdAt: Date.now() },
      ];

      const { getByLabelText, queryByText } = render(
        <AffirmationsSection
          {...defaultProps}
          affirmations={mockAffirmations}
          affirmationCount={2}
          isPremium={true}
        />
      );

      expect(getByLabelText('Add a new affirmation')).toBeTruthy();
      expect(queryByText(/Free/)).toBeNull();
    });
  });

  describe('VisionBoardSection (0 free, premium only)', () => {
    const defaultProps = {
      images: [],
      imageCount: 0,
      isPremium: false,
      onAddImage: jest.fn(),
      onUpdateCaption: jest.fn(),
      onDeleteImage: jest.fn(),
      onPremiumRequired: jest.fn(),
      reduceMotion: true,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('shows PRO badge for non-premium users', () => {
      const { getByText } = render(<VisionBoardSection {...defaultProps} />);

      expect(getByText('PRO')).toBeTruthy();
    });

    it('hides add functionality for non-premium users', () => {
      const { queryByText } = render(<VisionBoardSection {...defaultProps} />);

      expect(queryByText('Add Your First Image')).toBeNull();
    });

    it('triggers onPremiumRequired when non-premium user presses section', () => {
      const onPremiumRequired = jest.fn();
      const { getByLabelText } = render(
        <VisionBoardSection
          {...defaultProps}
          onPremiumRequired={onPremiumRequired}
        />
      );

      fireEvent.press(
        getByLabelText('Create your Vision Board with motivational images')
      );

      expect(onPremiumRequired).toHaveBeenCalled();
    });

    it('shows full functionality for premium users', () => {
      const { getByText, queryByText } = render(
        <VisionBoardSection {...defaultProps} isPremium={true} />
      );

      expect(getByText('Add Your First Image')).toBeTruthy();
      expect(queryByText('PRO')).toBeNull();
    });
  });

  describe('LettersSection (0 free, premium only)', () => {
    const defaultProps = {
      letters: [],
      letterCount: 0,
      isPremium: false,
      onSaveLetter: jest.fn(),
      onViewAllLetters: jest.fn(),
      onReadLetter: jest.fn(),
      onMarkAsRead: jest.fn(),
      onPremiumRequired: jest.fn(),
      reduceMotion: true,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('shows PRO badge for non-premium users', () => {
      const { getByText } = render(<LettersSection {...defaultProps} />);

      expect(getByText('PRO')).toBeTruthy();
    });

    it('hides write button for non-premium users', () => {
      const { queryByText } = render(<LettersSection {...defaultProps} />);

      expect(queryByText('Write Your First Letter')).toBeNull();
    });

    it('triggers onPremiumRequired when non-premium user presses section', () => {
      const onPremiumRequired = jest.fn();
      const { getByLabelText } = render(
        <LettersSection
          {...defaultProps}
          onPremiumRequired={onPremiumRequired}
        />
      );

      fireEvent.press(getByLabelText('Write a letter to your future self'));

      expect(onPremiumRequired).toHaveBeenCalled();
    });

    it('shows full functionality for premium users', () => {
      const { getByText, queryByText } = render(
        <LettersSection {...defaultProps} isPremium={true} />
      );

      expect(getByText('Write Your First Letter')).toBeTruthy();
      expect(queryByText('PRO')).toBeNull();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Integration Tests: Premium State Consistency
// ─────────────────────────────────────────────────────────────────────────────

describe('Premium State Consistency Across Features', () => {
  it('all features respect isPremium=false consistently', () => {
    const onPremiumRequired = jest.fn();

    // VoiceNotes (at limit)
    const { rerender, getByText: getByTextVoice } = render(
      <VoiceNotesSection
        voiceNotes={[]}
        voiceNoteCount={1}
        isPremium={false}
        onSaveRecording={jest.fn()}
        onViewAllNotes={jest.fn()}
        onPremiumRequired={onPremiumRequired}
        reduceMotion
      />
    );
    expect(getByTextVoice('1/1 Free')).toBeTruthy();

    // Affirmations
    rerender(
      <AffirmationsSection
        affirmations={[]}
        affirmationCount={0}
        isPremium={false}
        onSaveAffirmation={jest.fn()}
        onUpdateAffirmation={jest.fn()}
        onDeleteAffirmation={jest.fn()}
        onPremiumRequired={onPremiumRequired}
        reduceMotion
      />
    );
    // Would check for free tier badge

    // VisionBoard
    rerender(
      <VisionBoardSection
        images={[]}
        imageCount={0}
        isPremium={false}
        onAddImage={jest.fn()}
        onUpdateCaption={jest.fn()}
        onDeleteImage={jest.fn()}
        onPremiumRequired={onPremiumRequired}
        reduceMotion
      />
    );

    const { getByText: getByTextVision } = render(
      <VisionBoardSection
        images={[]}
        imageCount={0}
        isPremium={false}
        onAddImage={jest.fn()}
        onUpdateCaption={jest.fn()}
        onDeleteImage={jest.fn()}
        onPremiumRequired={onPremiumRequired}
        reduceMotion
      />
    );
    expect(getByTextVision('PRO')).toBeTruthy();

    // Letters
    const { getByText: getByTextLetters } = render(
      <LettersSection
        letters={[]}
        letterCount={0}
        isPremium={false}
        onSaveLetter={jest.fn()}
        onViewAllLetters={jest.fn()}
        onReadLetter={jest.fn()}
        onMarkAsRead={jest.fn()}
        onPremiumRequired={onPremiumRequired}
        reduceMotion
      />
    );
    expect(getByTextLetters('PRO')).toBeTruthy();
  });

  it('all features respect isPremium=true consistently', () => {
    // All premium features should show full functionality, no PRO badges

    const { queryByText: queryVision } = render(
      <VisionBoardSection
        images={[]}
        imageCount={0}
        isPremium={true}
        onAddImage={jest.fn()}
        onUpdateCaption={jest.fn()}
        onDeleteImage={jest.fn()}
        onPremiumRequired={jest.fn()}
        reduceMotion
      />
    );
    expect(queryVision('PRO')).toBeNull();

    const { queryByText: queryLetters } = render(
      <LettersSection
        letters={[]}
        letterCount={0}
        isPremium={true}
        onSaveLetter={jest.fn()}
        onViewAllLetters={jest.fn()}
        onReadLetter={jest.fn()}
        onMarkAsRead={jest.fn()}
        onPremiumRequired={jest.fn()}
        reduceMotion
      />
    );
    expect(queryLetters('PRO')).toBeNull();

    const { queryByText: queryVoice } = render(
      <VoiceNotesSection
        voiceNotes={[]}
        voiceNoteCount={10}
        isPremium={true}
        onSaveRecording={jest.fn()}
        onViewAllNotes={jest.fn()}
        onPremiumRequired={jest.fn()}
        reduceMotion
      />
    );
    expect(queryVoice(/Free/)).toBeNull();

    const { queryByText: queryAff } = render(
      <AffirmationsSection
        affirmations={[]}
        affirmationCount={10}
        isPremium={true}
        onSaveAffirmation={jest.fn()}
        onUpdateAffirmation={jest.fn()}
        onDeleteAffirmation={jest.fn()}
        onPremiumRequired={jest.fn()}
        reduceMotion
      />
    );
    expect(queryAff(/Free/)).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Integration Tests: Premium Upsell Full Flow
// ─────────────────────────────────────────────────────────────────────────────

describe('Premium Upsell Full Flow Integration', () => {
  /**
   * Test the complete premium upsell flow:
   * 1. User hits a premium feature limit
   * 2. onPremiumRequired is called
   * 3. Parent component uses usePremiumUpsell to show benefits or paywall
   * 4. User can transition from benefits to paywall
   * 5. Dismissal clears state properly
   */

  const PremiumUpsellTestHarness: React.FC = () => {
    const {
      showPaywall,
      showBenefits,
      triggeredFeature,
      triggerPaywall,
      triggerBenefits,
      dismissPaywall,
      dismissBenefits,
      benefitsToPaywall,
    } = usePremiumUpsell();

    return (
      <View>
        {/* Feature section that triggers premium */}
        <VoiceNotesSection
          voiceNotes={[]}
          voiceNoteCount={1} // At limit
          isPremium={false}
          onSaveRecording={jest.fn()}
          onViewAllNotes={jest.fn()}
          onPremiumRequired={() => triggerPaywall('voiceNotes')}
          reduceMotion
        />

        {/* State indicators */}
        <Text testID='paywall-state'>
          {showPaywall ? 'paywall-visible' : 'paywall-hidden'}
        </Text>
        <Text testID='benefits-state'>
          {showBenefits ? 'benefits-visible' : 'benefits-hidden'}
        </Text>
        <Text testID='feature-state'>{triggeredFeature || 'none'}</Text>

        {/* Mock paywall UI */}
        {showPaywall && (
          <View testID='paywall-modal'>
            <Text>Premium Paywall for {triggeredFeature}</Text>
            <Button
              testID='dismiss-paywall-btn'
              title='Dismiss'
              onPress={dismissPaywall}
            />
          </View>
        )}

        {/* Mock benefits UI */}
        {showBenefits && (
          <View testID='benefits-modal'>
            <Text>Benefits for {triggeredFeature}</Text>
            <Button
              testID='benefits-to-paywall-btn'
              title='Upgrade'
              onPress={benefitsToPaywall}
            />
            <Button
              testID='dismiss-benefits-btn'
              title='Close'
              onPress={dismissBenefits}
            />
          </View>
        )}
      </View>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('triggers paywall when user hits voiceNotes limit', () => {
    const { getByText, getByTestId } = render(<PremiumUpsellTestHarness />);

    // Initially hidden
    expect(getByTestId('paywall-state').props.children).toBe('paywall-hidden');

    // User tries to record when at limit
    fireEvent.press(getByText('New Recording'));

    // Paywall should show
    expect(getByTestId('paywall-state').props.children).toBe('paywall-visible');
    expect(getByTestId('feature-state').props.children).toBe('voiceNotes');
    expect(getByTestId('paywall-modal')).toBeTruthy();
  });

  it('dismisses paywall and clears state', () => {
    const { getByText, getByTestId } = render(<PremiumUpsellTestHarness />);

    // Trigger paywall
    fireEvent.press(getByText('New Recording'));
    expect(getByTestId('paywall-state').props.children).toBe('paywall-visible');

    // Dismiss
    fireEvent.press(getByTestId('dismiss-paywall-btn'));

    // Paywall hidden
    expect(getByTestId('paywall-state').props.children).toBe('paywall-hidden');

    // Feature cleared after delay
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(getByTestId('feature-state').props.children).toBe('none');
  });

  it('maintains feature context throughout the flow', () => {
    const { getByText, getByTestId } = render(<PremiumUpsellTestHarness />);

    // Trigger via feature
    fireEvent.press(getByText('New Recording'));

    // Feature should be set
    expect(getByTestId('feature-state').props.children).toBe('voiceNotes');

    // Dismiss paywall
    fireEvent.press(getByTestId('dismiss-paywall-btn'));

    // Feature still set for animation
    expect(getByTestId('feature-state').props.children).toBe('voiceNotes');

    // Cleared after animation delay
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(getByTestId('feature-state').props.children).toBe('none');
  });
});
