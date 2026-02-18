/**
 * Premium Gating Acceptance Criteria Validation Tests
 *
 * Story: AC7: Free/Premium features are correctly gated
 *
 * This test suite validates the acceptance criteria for premium feature gating
 * in the Motivation System. It verifies that:
 *
 * 1. Free Features are always accessible:
 *    - Your Why statement
 *    - Identity Statement
 *    - Cue/Trigger Setup
 *    - WOOP Plan
 *    - Basic Dual Visualization
 *    - Quick Reflection
 *
 * 2. Premium Features require subscription:
 *    - Voice Notes (1 free, unlimited premium)
 *    - Letters to Self (premium only)
 *    - Vision Board (premium only)
 *    - Affirmations (2 free, unlimited premium)
 *    - Rescue Mode (premium only)
 *    - Advanced Visualization (premium only)
 *
 * 3. Premium UI Patterns work correctly:
 *    - PRO badges appear on locked features
 *    - Free tier limits display accurately
 *    - Upgrade prompts trigger appropriately
 *    - Premium state is consistent across features
 *
 * 4. Business Logic is enforced:
 *    - Free tier limits are respected
 *    - Premium users have unlimited access
 *    - Upsell flow is triggered correctly
 */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { View, Text, Button } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// Component Imports - Free Features (Workshop sections without premium gates)
// ─────────────────────────────────────────────────────────────────────────────

import { YourWhySection } from '../../../src/components/MotivationSystem/Workshop/YourWhySection';
import { IdentitySection } from '../../../src/components/MotivationSystem/Workshop/IdentitySection';
import { CueTriggerSection } from '../../../src/components/MotivationSystem/Workshop/CueTriggerSection';
import { WOOPSection } from '../../../src/components/MotivationSystem/Workshop/WOOPSection';
import { DualVizSetup } from '../../../src/components/MotivationSystem/Workshop/DualVizSetup';
import { QuickReflection } from '../../../src/components/MotivationSystem/Reward/QuickReflection';

// ─────────────────────────────────────────────────────────────────────────────
// Component Imports - Premium Features
// ─────────────────────────────────────────────────────────────────────────────

import { VoiceNotesSection } from '../../../src/components/MotivationSystem/Workshop/VoiceNotesSection';
import { LettersSection } from '../../../src/components/MotivationSystem/Workshop/LettersSection';
import { VisionBoardSection } from '../../../src/components/MotivationSystem/Workshop/VisionBoardSection';
import { AffirmationsSection } from '../../../src/components/MotivationSystem/Workshop/AffirmationsSection';

// ─────────────────────────────────────────────────────────────────────────────
// Component Imports - Premium Gating UI
// ─────────────────────────────────────────────────────────────────────────────

import {
  PremiumFeatureLock,
  FeatureLimitBadge,
  type MotivationPremiumFeature,
} from '../../../src/components/MotivationSystem/Premium/PremiumFeatureLock';
import { usePremiumUpsell } from '../../../src/components/MotivationSystem/Premium/usePremiumUpsell';

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
        return function MockIcon(props: unknown) {
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
  LinearGradient: ({ children, ...props }: unknown) => (
    <mock-linear-gradient {...props}>{children}</mock-linear-gradient>
  ),
}));

// Mock expo-blur
jest.mock('expo-blur', () => ({
  BlurView: ({ children, ...props }: unknown) => (
    <mock-blur-view {...props}>{children}</mock-blur-view>
  ),
}));

// Mock clsx
jest.mock('clsx', () => ({
  clsx: (...args: unknown[]) =>
    args
      .flat()
      .filter((a) => typeof a === 'string')
      .join(' ')
      .trim(),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    default: {
      View,
      createAnimatedComponent: (Component: unknown) => Component,
    },
    useSharedValue: (initial: unknown) => ({ value: initial }),
    useAnimatedStyle: () => ({}),
    withSpring: (value: unknown) => value,
    withTiming: (value: unknown, _config?: unknown, _callback?: unknown) => value,
    withDelay: (_delay: unknown, value: unknown) => value,
    withSequence: (...values: unknown[]) => values[values.length - 1],
    withRepeat: (animation: unknown) => animation,
    interpolate: (value: number, input: number[], output: number[]) =>
      output[0],
    runOnJS: (fn: unknown) => fn,
    cancelAnimation: jest.fn(),
    Extrapolation: { CLAMP: 'clamp' },
    Easing: {
      out: (fn: unknown) => fn,
      in: (fn: unknown) => fn,
      inOut: (fn: unknown) => fn,
      ease: (t: number) => t,
      cubic: (x: number) => x,
      linear: (t: number) => t,
      quad: (t: number) => t,
      elastic: () => (t: number) => t,
      bezier: () => (t: number) => t,
    },
    View,
    FadeIn: { duration: () => ({ delay: () => ({}) }) },
    FadeOut: { duration: () => ({}) },
    LinearTransition: {
      springify: () => ({ damping: () => ({ stiffness: () => ({}) }) }),
    },
    SlideInDown: { duration: () => ({}) },
    SlideOutDown: { duration: () => ({}) },
  };
});

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

// ─────────────────────────────────────────────────────────────────────────────
// Test Fixtures
// ─────────────────────────────────────────────────────────────────────────────

const FREE_TIER_LIMITS = {
  voiceNotes: 1,
  affirmations: 2,
};

const ALL_PREMIUM_FEATURES: MotivationPremiumFeature[] = [
  'voiceNotes',
  'letters',
  'visionBoard',
  'affirmations',
  'rescueMode',
  'advancedViz',
];

// ─────────────────────────────────────────────────────────────────────────────
// AC7: Free/Premium features are correctly gated
// ─────────────────────────────────────────────────────────────────────────────

describe('AC7: Free/Premium features are correctly gated', () => {
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Free Features - Always Accessible
  // ───────────────────────────────────────────────────────────────────────────

  describe('1. Free Features - Always Accessible', () => {
    describe('Your Why (Free)', () => {
      it('is fully accessible to free users without any premium gate', () => {
        const onPress = jest.fn();
        const { getByLabelText, queryByText } = render(
          <YourWhySection why={undefined} onPress={onPress} reduceMotion />
        );

        // No PRO badge
        expect(queryByText('PRO')).toBeNull();
        // Fully interactive
        expect(getByLabelText('Add your why')).toBeTruthy();
        fireEvent.press(getByLabelText('Add your why'));
        expect(onPress).toHaveBeenCalled();
      });

      it('accepts user input without premium subscription', () => {
        const existingWhy = 'To be healthier for my family';
        const { getByText } = render(
          <YourWhySection why={existingWhy} onPress={jest.fn()} reduceMotion />
        );

        expect(getByText(`"${existingWhy}"`)).toBeTruthy();
      });
    });

    describe('Identity Statement (Free)', () => {
      it('is fully accessible to free users without any premium gate', () => {
        const onPress = jest.fn();
        const { getByLabelText, queryByText } = render(
          <IdentitySection
            identity={undefined}
            onPress={onPress}
            reduceMotion
          />
        );

        expect(queryByText('PRO')).toBeNull();
        expect(getByLabelText('Add your identity')).toBeTruthy();
        fireEvent.press(getByLabelText('Add your identity'));
        expect(onPress).toHaveBeenCalled();
      });
    });

    describe('Cue/Trigger Setup (Free)', () => {
      it('is fully accessible to free users without any premium gate', () => {
        const onPress = jest.fn();
        const { getByLabelText, queryByText } = render(
          <CueTriggerSection cue={{}} onPress={onPress} reduceMotion />
        );

        expect(queryByText('PRO')).toBeNull();
        expect(getByLabelText('Add your cue')).toBeTruthy();
        fireEvent.press(getByLabelText('Add your cue'));
        expect(onPress).toHaveBeenCalled();
      });
    });

    describe('WOOP Plan (Free)', () => {
      it('is fully accessible to free users without any premium gate', () => {
        const onPress = jest.fn();
        const { getByLabelText, queryByText } = render(
          <WOOPSection woop={{}} onPress={onPress} reduceMotion />
        );

        expect(queryByText('PRO')).toBeNull();
        expect(getByLabelText('Add your WOOP plan')).toBeTruthy();
        fireEvent.press(getByLabelText('Add your WOOP plan'));
        expect(onPress).toHaveBeenCalled();
      });
    });

    describe('Basic Dual Visualization (Free)', () => {
      it('is fully accessible to free users without any premium gate', () => {
        const onPress = jest.fn();
        const { getByLabelText, queryByText } = render(
          <DualVizSetup visualization={{}} onPress={onPress} reduceMotion />
        );

        expect(queryByText('PRO')).toBeNull();
        expect(getByLabelText(/Add.*visualization/i)).toBeTruthy();
        fireEvent.press(getByLabelText(/Add.*visualization/i));
        expect(onPress).toHaveBeenCalled();
      });
    });

    describe('Quick Reflection (Free)', () => {
      it('is fully accessible to free users without any premium gate', () => {
        const onEmojiSelect = jest.fn();
        const { getByLabelText, queryByText } = render(
          <QuickReflection onEmojiSelect={onEmojiSelect} reduceMotion />
        );

        expect(queryByText('PRO')).toBeNull();
        // All emoji options available
        expect(getByLabelText(/frustrated/i)).toBeTruthy();
        expect(getByLabelText(/neutral/i)).toBeTruthy();
        expect(getByLabelText(/happy/i)).toBeTruthy();
        expect(getByLabelText(/fire/i)).toBeTruthy();
      });
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Premium Features - Gated for Free Users
  // ───────────────────────────────────────────────────────────────────────────

  describe('2. Premium Features - Gated for Free Users', () => {
    describe('Voice Notes (1 free, unlimited premium)', () => {
      const baseProps = {
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

      it('shows free tier badge indicating 1 free recording', () => {
        const { getByText } = render(<VoiceNotesSection {...baseProps} />);

        expect(getByText('0/1 Free')).toBeTruthy();
      });

      it('allows first recording for free users', () => {
        const { getByText } = render(<VoiceNotesSection {...baseProps} />);

        // User should be able to record their Day 1 note
        expect(getByText('Record Your Day 1')).toBeTruthy();
      });

      it('blocks additional recordings for free users at limit', () => {
        const onPremiumRequired = jest.fn();
        const { getByText } = render(
          <VoiceNotesSection
            {...baseProps}
            voiceNoteCount={1}
            onPremiumRequired={onPremiumRequired}
          />
        );

        // Press the new recording button
        fireEvent.press(getByText('New Recording'));

        // Should trigger premium upsell
        expect(onPremiumRequired).toHaveBeenCalled();
      });

      it('shows unlimited recordings for premium users', () => {
        const onPremiumRequired = jest.fn();
        const { getByText, queryByText } = render(
          <VoiceNotesSection
            {...baseProps}
            voiceNoteCount={10}
            isPremium={true}
            onPremiumRequired={onPremiumRequired}
          />
        );

        // No free tier badge
        expect(queryByText(/Free/)).toBeNull();

        // Recording should work without triggering premium
        fireEvent.press(getByText('New Recording'));
        expect(onPremiumRequired).not.toHaveBeenCalled();
      });
    });

    describe('Letters to Self (Premium Only)', () => {
      const baseProps = {
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

      it('shows PRO badge for free users', () => {
        const { getByText } = render(<LettersSection {...baseProps} />);

        expect(getByText('PRO')).toBeTruthy();
      });

      it('hides write functionality for free users', () => {
        const { queryByText } = render(<LettersSection {...baseProps} />);

        // Write button should not be visible
        expect(queryByText('Write Your First Letter')).toBeNull();
      });

      it('triggers premium upsell when free user taps section', () => {
        const onPremiumRequired = jest.fn();
        const { getByLabelText } = render(
          <LettersSection
            {...baseProps}
            onPremiumRequired={onPremiumRequired}
          />
        );

        fireEvent.press(getByLabelText('Write a letter to your future self'));

        expect(onPremiumRequired).toHaveBeenCalled();
      });

      it('shows full functionality for premium users', () => {
        const { getByText, queryByText } = render(
          <LettersSection {...baseProps} isPremium={true} />
        );

        // No PRO badge
        expect(queryByText('PRO')).toBeNull();
        // Write button visible
        expect(getByText('Write Your First Letter')).toBeTruthy();
      });
    });

    describe('Vision Board (Premium Only)', () => {
      const baseProps = {
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

      it('shows PRO badge for free users', () => {
        const { getByText } = render(<VisionBoardSection {...baseProps} />);

        expect(getByText('PRO')).toBeTruthy();
      });

      it('hides image grid for free users', () => {
        const { queryByText } = render(<VisionBoardSection {...baseProps} />);

        // Add functionality should not be visible
        expect(queryByText('Add Your First Image')).toBeNull();
      });

      it('triggers premium upsell when free user taps section', () => {
        const onPremiumRequired = jest.fn();
        const { getByLabelText } = render(
          <VisionBoardSection
            {...baseProps}
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
          <VisionBoardSection {...baseProps} isPremium={true} />
        );

        // No PRO badge
        expect(queryByText('PRO')).toBeNull();
        // Add functionality visible
        expect(getByText('Add Your First Image')).toBeTruthy();
      });
    });

    describe('Affirmations (2 free, unlimited premium)', () => {
      const baseProps = {
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

      it('shows free tier badge indicating 2 free affirmations', () => {
        const { getByText } = render(
          <AffirmationsSection {...baseProps} affirmationCount={1} />
        );

        expect(getByText('1/2 Free')).toBeTruthy();
      });

      it('allows first 2 affirmations for free users', () => {
        const { getByLabelText } = render(
          <AffirmationsSection {...baseProps} affirmationCount={0} />
        );

        // Add button should be available (empty state has different label)
        expect(getByLabelText('Add your first affirmation')).toBeTruthy();
      });

      it('shows upgrade prompt when free user at limit', () => {
        const mockAffirmations = [
          { id: '1', text: 'I am strong', createdAt: Date.now() },
          { id: '2', text: 'I am focused', createdAt: Date.now() },
        ];

        const { getByText, queryByLabelText } = render(
          <AffirmationsSection
            {...baseProps}
            affirmations={mockAffirmations}
            affirmationCount={2}
          />
        );

        // Add button hidden
        expect(queryByLabelText('Add a new affirmation')).toBeNull();
        // Upgrade prompt shown
        expect(getByText('Upgrade for Unlimited')).toBeTruthy();
      });

      it('triggers premium upsell when upgrade prompt pressed', () => {
        const onPremiumRequired = jest.fn();
        const mockAffirmations = [
          { id: '1', text: 'I am strong', createdAt: Date.now() },
          { id: '2', text: 'I am focused', createdAt: Date.now() },
        ];

        const { getByText } = render(
          <AffirmationsSection
            {...baseProps}
            affirmations={mockAffirmations}
            affirmationCount={2}
            onPremiumRequired={onPremiumRequired}
          />
        );

        fireEvent.press(getByText('Upgrade for Unlimited'));

        expect(onPremiumRequired).toHaveBeenCalled();
      });

      it('shows unlimited affirmations for premium users', () => {
        const mockAffirmations = [
          { id: '1', text: 'I am strong', createdAt: Date.now() },
          { id: '2', text: 'I am focused', createdAt: Date.now() },
        ];

        const { getByLabelText, queryByText } = render(
          <AffirmationsSection
            {...baseProps}
            affirmations={mockAffirmations}
            affirmationCount={2}
            isPremium={true}
          />
        );

        // No free tier badge
        expect(queryByText(/Free/)).toBeNull();
        // Add button still visible
        expect(getByLabelText('Add a new affirmation')).toBeTruthy();
      });
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Premium UI Patterns
  // ───────────────────────────────────────────────────────────────────────────

  describe('3. Premium UI Patterns', () => {
    describe('PRO Badge Display', () => {
      const premiumOnlyFeatures: MotivationPremiumFeature[] = [
        'letters',
        'visionBoard',
        'rescueMode',
        'advancedViz',
      ];

      premiumOnlyFeatures.forEach((feature) => {
        it(`shows PRO badge for ${feature} (premium-only feature)`, () => {
          const { getByText } = render(
            <PremiumFeatureLock
              feature={feature}
              onUpgrade={jest.fn()}
              variant='inline'
            />
          );

          expect(getByText('PRO')).toBeTruthy();
        });
      });
    });

    describe('Free Tier Limit Badge', () => {
      it('shows current/limit usage for voiceNotes (1 free)', () => {
        const { getByText } = render(
          <FeatureLimitBadge
            current={0}
            limit={FREE_TIER_LIMITS.voiceNotes}
            isPremium={false}
            onUpgrade={jest.fn()}
          />
        );

        expect(getByText('0/1 Free')).toBeTruthy();
      });

      it('shows current/limit usage for affirmations (2 free)', () => {
        const { getByText } = render(
          <FeatureLimitBadge
            current={1}
            limit={FREE_TIER_LIMITS.affirmations}
            isPremium={false}
            onUpgrade={jest.fn()}
          />
        );

        expect(getByText('1/2 Free')).toBeTruthy();
      });

      it('hides badge for premium users', () => {
        const { toJSON } = render(
          <FeatureLimitBadge
            current={5}
            limit={2}
            isPremium={true}
            onUpgrade={jest.fn()}
          />
        );

        // Should render nothing for premium users
        expect(toJSON()).toBeNull();
      });
    });

    describe('Upgrade Prompt Behavior', () => {
      it('triggers onUpgrade callback when at-limit badge is pressed', () => {
        const onUpgrade = jest.fn();
        const { getByRole } = render(
          <FeatureLimitBadge
            current={1}
            limit={1}
            isPremium={false}
            onUpgrade={onUpgrade}
          />
        );

        fireEvent.press(getByRole('button'));

        expect(onUpgrade).toHaveBeenCalled();
      });

      it('does not trigger onUpgrade when under limit', () => {
        const onUpgrade = jest.fn();
        const { getByLabelText } = render(
          <FeatureLimitBadge
            current={0}
            limit={2}
            isPremium={false}
            onUpgrade={onUpgrade}
          />
        );

        // Under limit - should not be pressable for upgrade
        const badge = getByLabelText('0 of 2 free used');
        fireEvent.press(badge);

        expect(onUpgrade).not.toHaveBeenCalled();
      });
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Premium State Consistency
  // ───────────────────────────────────────────────────────────────────────────

  describe('4. Premium State Consistency', () => {
    it('all premium features respect isPremium=false consistently', () => {
      // Voice Notes at limit
      const { getByText: getByTextVoice } = render(
        <VoiceNotesSection
          voiceNotes={[]}
          voiceNoteCount={1}
          isPremium={false}
          onSaveRecording={jest.fn()}
          onViewAllNotes={jest.fn()}
          onPremiumRequired={jest.fn()}
          reduceMotion
        />
      );
      expect(getByTextVoice('1/1 Free')).toBeTruthy();

      // Vision Board
      const { getByText: getByTextVision } = render(
        <VisionBoardSection
          images={[]}
          imageCount={0}
          isPremium={false}
          onAddImage={jest.fn()}
          onUpdateCaption={jest.fn()}
          onDeleteImage={jest.fn()}
          onPremiumRequired={jest.fn()}
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
          onPremiumRequired={jest.fn()}
          reduceMotion
        />
      );
      expect(getByTextLetters('PRO')).toBeTruthy();
    });

    it('all premium features respect isPremium=true consistently', () => {
      // Voice Notes - no limit badge
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

      // Vision Board - no PRO badge
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

      // Letters - no PRO badge
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

      // Affirmations - no limit badge
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

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Premium Upsell Flow
  // ───────────────────────────────────────────────────────────────────────────

  describe('5. Premium Upsell Flow', () => {
    // Test wrapper component for the hook
    const HookTestComponent: React.FC = () => {
      const {
        showPaywall,
        showBenefits,
        triggeredFeature,
        triggerPaywall,
        dismissPaywall,
        benefitsToPaywall,
      } = usePremiumUpsell();

      return (
        <View>
          <Text testID='paywall-state'>
            {showPaywall ? 'paywall-visible' : 'paywall-hidden'}
          </Text>
          <Text testID='benefits-state'>
            {showBenefits ? 'benefits-visible' : 'benefits-hidden'}
          </Text>
          <Text testID='triggered-feature'>{triggeredFeature || 'none'}</Text>
          <Button
            testID='trigger-paywall'
            title='Trigger'
            onPress={() => triggerPaywall('voiceNotes')}
          />
          <Button
            testID='dismiss-paywall'
            title='Dismiss'
            onPress={dismissPaywall}
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

    it('starts with paywall hidden', () => {
      const { getByTestId } = render(<HookTestComponent />);

      expect(getByTestId('paywall-state').props.children).toBe(
        'paywall-hidden'
      );
    });

    it('shows paywall when feature limit is hit', () => {
      const { getByTestId } = render(<HookTestComponent />);

      fireEvent.press(getByTestId('trigger-paywall'));

      expect(getByTestId('paywall-state').props.children).toBe(
        'paywall-visible'
      );
      expect(getByTestId('triggered-feature').props.children).toBe(
        'voiceNotes'
      );
    });

    it('preserves triggered feature context for upsell messaging', () => {
      const { getByTestId } = render(<HookTestComponent />);

      fireEvent.press(getByTestId('trigger-paywall'));

      // The triggered feature should be preserved for the upsell modal
      // to show relevant messaging about why the user hit the limit
      expect(getByTestId('triggered-feature').props.children).toBe(
        'voiceNotes'
      );
    });

    it('clears state after dismissal', () => {
      const { getByTestId } = render(<HookTestComponent />);

      fireEvent.press(getByTestId('trigger-paywall'));
      fireEvent.press(getByTestId('dismiss-paywall'));

      // Paywall should be hidden
      expect(getByTestId('paywall-state').props.children).toBe(
        'paywall-hidden'
      );

      // Feature should be cleared after animation delay
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(getByTestId('triggered-feature').props.children).toBe('none');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Business Logic Validation
  // ───────────────────────────────────────────────────────────────────────────

  describe('6. Business Logic Validation', () => {
    describe('Voice Notes Limit: 1 Free Recording', () => {
      it('count 0 → can record (first free)', () => {
        const onPremiumRequired = jest.fn();
        render(
          <VoiceNotesSection
            voiceNotes={[]}
            voiceNoteCount={0}
            isPremium={false}
            onSaveRecording={jest.fn()}
            onViewAllNotes={jest.fn()}
            onPremiumRequired={onPremiumRequired}
            reduceMotion
          />
        );

        // At 0, user should be able to record
        expect(onPremiumRequired).not.toHaveBeenCalled();
      });

      it('count 1 → premium required (limit reached)', () => {
        const onPremiumRequired = jest.fn();
        const { getByText } = render(
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

        fireEvent.press(getByText('New Recording'));

        expect(onPremiumRequired).toHaveBeenCalled();
      });
    });

    describe('Affirmations Limit: 2 Free', () => {
      it('count 0 → can add (2 free remaining)', () => {
        const { getByLabelText } = render(
          <AffirmationsSection
            affirmations={[]}
            affirmationCount={0}
            isPremium={false}
            onSaveAffirmation={jest.fn()}
            onUpdateAffirmation={jest.fn()}
            onDeleteAffirmation={jest.fn()}
            onPremiumRequired={jest.fn()}
            reduceMotion
          />
        );

        // Empty state has "Add your first affirmation" label
        expect(getByLabelText('Add your first affirmation')).toBeTruthy();
      });

      it('count 1 → can add (1 free remaining)', () => {
        const { getByLabelText, getByText } = render(
          <AffirmationsSection
            affirmations={[{ id: '1', text: 'First', createdAt: Date.now() }]}
            affirmationCount={1}
            isPremium={false}
            onSaveAffirmation={jest.fn()}
            onUpdateAffirmation={jest.fn()}
            onDeleteAffirmation={jest.fn()}
            onPremiumRequired={jest.fn()}
            reduceMotion
          />
        );

        expect(getByLabelText('Add a new affirmation')).toBeTruthy();
        expect(getByText('1/2 Free')).toBeTruthy();
      });

      it('count 2 → cannot add (limit reached)', () => {
        const mockAffirmations = [
          { id: '1', text: 'First', createdAt: Date.now() },
          { id: '2', text: 'Second', createdAt: Date.now() },
        ];

        const { queryByLabelText, getByText } = render(
          <AffirmationsSection
            affirmations={mockAffirmations}
            affirmationCount={2}
            isPremium={false}
            onSaveAffirmation={jest.fn()}
            onUpdateAffirmation={jest.fn()}
            onDeleteAffirmation={jest.fn()}
            onPremiumRequired={jest.fn()}
            reduceMotion
          />
        );

        expect(queryByLabelText('Add a new affirmation')).toBeNull();
        expect(getByText('Upgrade for Unlimited')).toBeTruthy();
      });
    });

    describe('Premium-Only Features: 0 Free', () => {
      it('Letters - always shows PRO for free users', () => {
        const { getByText } = render(
          <LettersSection
            letters={[]}
            letterCount={0}
            isPremium={false}
            onSaveLetter={jest.fn()}
            onViewAllLetters={jest.fn()}
            onReadLetter={jest.fn()}
            onMarkAsRead={jest.fn()}
            onPremiumRequired={jest.fn()}
            reduceMotion
          />
        );

        expect(getByText('PRO')).toBeTruthy();
      });

      it('Vision Board - always shows PRO for free users', () => {
        const { getByText } = render(
          <VisionBoardSection
            images={[]}
            imageCount={0}
            isPremium={false}
            onAddImage={jest.fn()}
            onUpdateCaption={jest.fn()}
            onDeleteImage={jest.fn()}
            onPremiumRequired={jest.fn()}
            reduceMotion
          />
        );

        expect(getByText('PRO')).toBeTruthy();
      });
    });
  });
});
