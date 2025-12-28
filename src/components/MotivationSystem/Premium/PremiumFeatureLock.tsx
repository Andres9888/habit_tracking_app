/**
 * PremiumFeatureLock Component
 *
 * A reusable component that overlays locked premium features
 * with a visually appealing lock state and upgrade CTA.
 *
 * Used for Motivation System premium features:
 * - Voice Notes (1 free, unlimited premium)
 * - Letters to Self
 * - Vision Board
 * - Affirmations (2 free, unlimited premium)
 * - Rescue Mode
 * - Advanced Visualization
 *
 * @see motivation-system-spec.md - Premium Gating section
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, AccessibilityInfo } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Crown, ChevronRight, Sparkles } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

/**
 * Premium feature tiers for the Motivation System
 */
export type MotivationPremiumFeature =
  | 'voiceNotes'
  | 'letters'
  | 'visionBoard'
  | 'affirmations'
  | 'rescueMode'
  | 'advancedViz';

/**
 * Feature metadata for display
 */
const FEATURE_META: Record<
  MotivationPremiumFeature,
  {
    title: string;
    description: string;
    freeLimit?: string;
    scienceBasis: string;
  }
> = {
  advancedViz: {
    description: 'Full Huberman protocol with Body/Mind/Emotion breakdown',
    scienceBasis: 'Fear visualization moves you 2x better when unmotivated',
    title: 'Advanced Visualization',
  },
  affirmations: {
    description: 'Add as many daily affirmations as you need',
    freeLimit: '2 affirmations',
    scienceBasis: 'Repetition builds neural pathways',
    title: 'Unlimited Affirmations',
  },
  letters: {
    description: 'Write time-locked messages to your future self',
    scienceBasis: 'Temporal self-continuity increases self-control',
    title: 'Letters to Self',
  },
  rescueMode: {
    description: 'Get interventions when your streak is at risk',
    scienceBasis: 'Streak protection is #1 retention driver (Duolingo)',
    title: 'Rescue Mode',
  },
  visionBoard: {
    description: 'Create a visual collection of your motivation',
    scienceBasis: 'Personal images create stronger emotional connections',
    title: 'Vision Board',
  },
  voiceNotes: {
    description: 'Record audio motivation from your most inspired moments',
    freeLimit: '1 recording',
    scienceBasis: 'Voice has 40% higher emotional recall than text',
    title: 'Voice Notes',
  },
};

interface PremiumFeatureLockProps {
  /**
   * Which premium feature this lock represents
   */
  feature: MotivationPremiumFeature;

  /**
   * Callback when user taps the upgrade CTA
   */
  onUpgrade: () => void;

  /**
   * Optional callback for analytics tracking
   */
  onLockViewed?: (feature: MotivationPremiumFeature) => void;

  /**
   * Display variant
   * - 'inline': Small badge shown next to feature title (default)
   * - 'overlay': Full overlay on locked content area
   * - 'card': Standalone card explaining the feature
   */
  variant?: 'inline' | 'overlay' | 'card';

  /**
   * Whether to show the science-based explanation
   */
  showScience?: boolean;

  /**
   * Whether to reduce motion for accessibility
   */
  reduceMotion?: boolean;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Inline PRO badge - minimal, shown next to feature titles
 */
function InlineLock({
  onUpgrade,
  reduceMotion = false,
  testID,
}: {
  onUpgrade: () => void;
  reduceMotion?: boolean;
  testID?: string;
}) {
  const { triggerLightImpact } = useHapticFeedback({});
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    triggerLightImpact();
    onUpgrade();
  }, [onUpgrade, triggerLightImpact]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.95, { duration: 100 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 100 });
  }, [scale]);

  return (
    <Pressable
      accessibilityHint='Tap to upgrade to premium'
      accessibilityLabel='Premium feature'
      accessibilityRole='button'
      testID={testID}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={reduceMotion ? undefined : animatedStyle}>
        <LinearGradient
          className='flex-row items-center gap-1 rounded-full px-2 py-0.5'
          colors={['#8b5cf6', '#7c3aed']}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
        >
          <Lock color='#ffffff' size={10} strokeWidth={2.5} />
          <Text className='text-[10px] font-bold uppercase tracking-wide text-white'>
            PRO
          </Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

/**
 * Overlay lock - covers locked content with blur and upgrade CTA
 */
function OverlayLock({
  feature,
  onUpgrade,
  showScience = false,
  reduceMotion = false,
  testID,
}: {
  feature: MotivationPremiumFeature;
  onUpgrade: () => void;
  showScience?: boolean;
  reduceMotion?: boolean;
  testID?: string;
}) {
  const { triggerSelection } = useHapticFeedback({});
  const meta = FEATURE_META[feature];
  const shimmerPosition = useSharedValue(0);

  // Shimmer animation on the CTA button
  React.useEffect(() => {
    if (reduceMotion) return;

    shimmerPosition.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [shimmerPosition, reduceMotion]);

  const handlePress = useCallback(() => {
    triggerSelection();
    onUpgrade();
  }, [onUpgrade, triggerSelection]);

  return (
    <View
      className='absolute inset-0 items-center justify-center rounded-xl bg-stone-900/60 px-4 py-6'
      testID={testID}
    >
      {/* Lock icon with glow */}
      <View className='mb-4 items-center'>
        <View className='absolute h-16 w-16 rounded-full bg-violet-500/30' />
        <View className='h-14 w-14 items-center justify-center rounded-full bg-violet-100'>
          <Lock className='text-violet-600' size={28} />
        </View>
      </View>

      {/* Feature info */}
      <Text className='mb-1 text-center text-lg font-bold text-white'>
        {meta.title}
      </Text>
      <Text className='mb-4 text-center text-sm text-stone-200'>
        {meta.description}
      </Text>

      {/* Science callout */}
      {showScience && (
        <View className='mb-4 flex-row items-start gap-2 rounded-lg bg-white/10 px-3 py-2'>
          <Sparkles className='mt-0.5 text-amber-300' size={14} />
          <Text className='flex-1 text-xs italic text-stone-200'>
            {meta.scienceBasis}
          </Text>
        </View>
      )}

      {/* Upgrade CTA */}
      <Pressable
        accessibilityHint='Opens premium subscription options'
        accessibilityLabel='Unlock with Premium'
        accessibilityRole='button'
        className='w-full'
        onPress={handlePress}
      >
        <LinearGradient
          className='flex-row items-center justify-center gap-2 rounded-xl px-6 py-3'
          colors={['#8b5cf6', '#7c3aed']}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
        >
          <Crown color='#ffffff' size={18} />
          <Text className='text-base font-semibold text-white'>
            Unlock with Premium
          </Text>
          <ChevronRight color='#ffffff' size={18} />
        </LinearGradient>
      </Pressable>

      {/* Free limit indicator */}
      {meta.freeLimit && (
        <Text className='mt-2 text-center text-xs text-stone-300'>
          Free tier: {meta.freeLimit}
        </Text>
      )}
    </View>
  );
}

/**
 * Card lock - standalone feature explanation with upgrade CTA
 */
function CardLock({
  feature,
  onUpgrade,
  showScience = true,
  reduceMotion = false,
  testID,
}: {
  feature: MotivationPremiumFeature;
  onUpgrade: () => void;
  showScience?: boolean;
  reduceMotion?: boolean;
  testID?: string;
}) {
  const { triggerSelection } = useHapticFeedback({});
  const meta = FEATURE_META[feature];
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    triggerSelection();
    onUpgrade();
  }, [onUpgrade, triggerSelection]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.98, { duration: 100 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 100 });
  }, [scale]);

  return (
    <Pressable
      accessibilityHint='Tap to learn more about this premium feature'
      accessibilityLabel={`${meta.title} - Premium feature`}
      accessibilityRole='button'
      testID={testID}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className='overflow-hidden rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white'
        style={reduceMotion ? undefined : animatedStyle}
      >
        {/* Header with gradient */}
        <LinearGradient
          className='flex-row items-center gap-3 px-4 py-3'
          colors={['#8b5cf6', '#7c3aed']}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
        >
          <View className='h-10 w-10 items-center justify-center rounded-full bg-white/20'>
            <Crown color='#ffffff' size={20} />
          </View>
          <View className='flex-1'>
            <Text className='text-base font-bold text-white'>{meta.title}</Text>
            {meta.freeLimit && (
              <Text className='text-xs text-violet-100'>
                Free: {meta.freeLimit}
              </Text>
            )}
          </View>
          <View className='flex-row items-center gap-1'>
            <Text className='text-sm font-medium text-white'>Upgrade</Text>
            <ChevronRight color='#ffffff' size={16} />
          </View>
        </LinearGradient>

        {/* Content */}
        <View className='px-4 py-3'>
          <Text className='mb-2 text-sm text-stone-600'>
            {meta.description}
          </Text>

          {/* Science callout */}
          {showScience && (
            <View className='flex-row items-start gap-2 rounded-lg bg-amber-50 px-3 py-2'>
              <Sparkles className='mt-0.5 text-amber-500' size={14} />
              <Text className='flex-1 text-xs italic text-amber-700'>
                {meta.scienceBasis}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

/**
 * Main PremiumFeatureLock component
 */
export function PremiumFeatureLock({
  feature,
  onUpgrade,
  onLockViewed,
  variant = 'inline',
  showScience = false,
  reduceMotion = false,
  className,
  testID,
}: PremiumFeatureLockProps) {
  // Track when lock is viewed (for analytics)
  React.useEffect(() => {
    if (onLockViewed) {
      onLockViewed(feature);
    }
  }, [feature, onLockViewed]);

  if (variant === 'inline') {
    return (
      <View className={className}>
        <InlineLock
          reduceMotion={reduceMotion}
          testID={testID}
          onUpgrade={onUpgrade}
        />
      </View>
    );
  }

  if (variant === 'overlay') {
    return (
      <OverlayLock
        feature={feature}
        reduceMotion={reduceMotion}
        showScience={showScience}
        testID={testID}
        onUpgrade={onUpgrade}
      />
    );
  }

  return (
    <View className={className}>
      <CardLock
        feature={feature}
        reduceMotion={reduceMotion}
        showScience={showScience}
        testID={testID}
        onUpgrade={onUpgrade}
      />
    </View>
  );
}

/**
 * Feature limit indicator - shows free tier usage
 */
export function FeatureLimitBadge({
  current,
  limit,
  isPremium,
  onUpgrade,
  reduceMotion = false,
  testID,
}: {
  current: number;
  limit: number;
  isPremium: boolean;
  onUpgrade: () => void;
  reduceMotion?: boolean;
  testID?: string;
}) {
  const { triggerLightImpact } = useHapticFeedback({});
  const isAtLimit = !isPremium && current >= limit;

  const handlePress = useCallback(() => {
    if (!isPremium) {
      triggerLightImpact();
      onUpgrade();
    }
  }, [isPremium, onUpgrade, triggerLightImpact]);

  if (isPremium) {
    return null;
  }

  return (
    <Pressable
      accessibilityHint={isAtLimit ? 'Tap to upgrade for unlimited' : undefined}
      accessibilityLabel={`${current} of ${limit} free used`}
      accessibilityRole={isAtLimit ? 'button' : 'text'}
      disabled={!isAtLimit}
      testID={testID}
      onPress={handlePress}
    >
      <View
        className={`flex-row items-center gap-1 rounded-full px-2 py-0.5 ${
          isAtLimit ? 'bg-amber-100' : 'bg-stone-100'
        }`}
      >
        <Text
          className={`text-xs font-medium ${
            isAtLimit ? 'text-amber-700' : 'text-stone-600'
          }`}
        >
          {current}/{limit} Free
        </Text>
        {isAtLimit && <ChevronRight className='text-amber-600' size={12} />}
      </View>
    </Pressable>
  );
}

export default PremiumFeatureLock;
