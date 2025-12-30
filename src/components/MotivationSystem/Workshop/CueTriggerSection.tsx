/**
 * CueTriggerSection Component
 * Displays and allows editing of the habit's cue/trigger settings
 *
 * Part of the Motivation System Workshop tab
 * Story T3.2-T3.6: Create CueTriggerSection component with 3 fields
 *
 * Scientific Basis:
 * - Charles Duhigg's Habit Loop: Cue → Routine → Reward
 * - Implementation intentions double follow-through (Gollwitzer, 1999)
 * - "After I [cue], I will [habit]" - creates automatic trigger
 */

import React, { useCallback, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Plus, Check, Pencil } from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import {
  PulsingIcon,
  CompletionCheckmark,
  SPRING_BUTTON,
  SPRING_GENTLE,
  STAGGER_DELAY,
} from '../../animations';

export interface CueTriggerData {
  /** Time of day for the habit (e.g., "7:00 AM" or "Morning") */
  time?: string;
  /** Location where the habit occurs (e.g., "Kitchen") */
  location?: string;
  /** Preceding behavior that triggers the habit (e.g., "After morning coffee") */
  afterBehavior?: string;
}

export interface CueTriggerSectionProps {
  /** The habit's cue/trigger data */
  cue: CueTriggerData | undefined;
  /** Callback when user taps to edit/add their cue */
  onPress: () => void;
  /** Whether to run entrance animations (first tab visit only) */
  shouldAnimate?: boolean;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Section index for staggered animation timing */
  sectionIndex?: number;
}

/**
 * SectionCard Component for consistent styling with press animation
 * Matches mockup: app-card with border, 16px radius, subtle shadow
 */
function SectionCard({
  children,
  className,
  onPress,
  accessibilityLabel,
}: {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.05);
  const elevation = useSharedValue(2);

  const animatedStyle = useAnimatedStyle(() => ({
    elevation: elevation.value,
    shadowOffset: {
      height: interpolate(elevation.value, [1, 2], [1, 2]),
      width: 0,
    },
    shadowOpacity: shadowOpacity.value,
    shadowRadius: interpolate(elevation.value, [1, 2], [4, 8]),
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    'worklet';
    scale.value = withSpring(0.98, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.02, SPRING_BUTTON);
    elevation.value = withSpring(1, SPRING_BUTTON);
  }, [scale, shadowOpacity, elevation]);

  const handlePressOut = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.05, SPRING_BUTTON);
    elevation.value = withSpring(2, SPRING_BUTTON);
  }, [scale, shadowOpacity, elevation]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  }, [onPress]);

  if (onPress) {
    return (
      <Animated.View
        style={[
          animatedStyle,
          { shadowColor: '#000' },
        ]}
      >
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole='button'
          className={clsx('rounded-xl border border-stone-200 bg-white p-3', className)}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View
      className={clsx(
        'rounded-xl border border-stone-200 bg-white p-3',
        className
      )}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {children}
    </View>
  );
}

/**
 * AnimatedSection Component for staggered entrance animations
 */
function AnimatedSection({
  children,
  index,
  shouldAnimate,
  reduceMotion = false,
}: {
  children: React.ReactNode;
  index: number;
  shouldAnimate: boolean;
  reduceMotion?: boolean;
}) {
  const INITIAL_TRANSLATE_Y = 24;

  const translateY = useSharedValue(
    shouldAnimate && !reduceMotion ? INITIAL_TRANSLATE_Y : 0
  );
  const opacity = useSharedValue(shouldAnimate && !reduceMotion ? 0 : 1);

  useEffect(() => {
    if (!shouldAnimate || reduceMotion) {
      translateY.value = 0;
      opacity.value = 1;
      return;
    }

    const delay = index * STAGGER_DELAY;

    const timeout = setTimeout(() => {
      translateY.value = withSpring(0, SPRING_GENTLE);
      opacity.value = withTiming(1, { duration: 300 });
    }, delay);

    return () => clearTimeout(timeout);
  }, [shouldAnimate, reduceMotion, index, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * CueField Component - Individual cue field display with emoji icons
 * Matches mockup: sky-500 icon color, stone-600 label, stone-900 value
 */
function CueField({
  emoji,
  label,
  value,
}: {
  emoji: string;
  label: string;
  value?: string;
}) {
  return (
    <View className='flex-row items-center gap-2'>
      <Text className='text-sky-500'>{emoji}</Text>
      <Text className='text-xs text-stone-600'>
        {label}: <Text className='font-medium text-stone-900'>{value || '—'}</Text>
      </Text>
    </View>
  );
}

/**
 * Checks if the cue data has at least one field filled
 */
function hasCueData(cue: CueTriggerData | undefined): boolean {
  if (!cue) return false;
  return !!(cue.time || cue.location || cue.afterBehavior);
}

/**
 * Formats the implementation intention string
 * "After I [afterBehavior], I will [habit]"
 */
function formatIntentionPreview(cue: CueTriggerData): string | null {
  if (!cue.afterBehavior) return null;
  return `After I ${cue.afterBehavior}...`;
}

/**
 * CueTriggerSection - Main component
 *
 * Displays the habit's cue/trigger settings with:
 * - Empty state: Pulsing link icon with "Set up" CTA
 * - Filled state: Sky-tinted card with time, location, after behavior
 * - Completion checkmark when any field is filled
 * - Sky accent color (border-l-sky-400)
 * - Implementation intention preview
 */
export function CueTriggerSection({
  cue,
  onPress,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 2,
}: CueTriggerSectionProps) {
  const hasCue = hasCueData(cue);

  return (
    <AnimatedSection
      index={sectionIndex}
      reduceMotion={reduceMotion}
      shouldAnimate={shouldAnimate}
    >
      <SectionCard
        accessibilityLabel={hasCue ? 'Edit your cue' : 'Add your cue'}
        className='border-l-4 border-l-sky-400'
        onPress={onPress}
      >
        {/* Header row: icon + title on left, action on right */}
        <View className='mb-2 flex-row items-center justify-between'>
          <View className='flex-row items-center gap-2'>
            <Text className="text-base">🔔</Text>
            <Text className='text-xs font-semibold text-sky-600'>
              Cue / Trigger
            </Text>
          </View>
          {hasCue ? (
            <Pencil className='text-stone-400' size={14} />
          ) : (
            <View className='flex-row items-center gap-1'>
              <Plus className='text-sky-600' size={12} />
              <Text className='text-xs font-medium text-sky-600'>Set up</Text>
            </View>
          )}
        </View>

        {/* Content */}
        {hasCue ? (
          <View className='gap-1.5'>
            {cue?.time && (
              <CueField emoji='⏰' label='When' value={cue.time} />
            )}
            {cue?.location && (
              <CueField emoji='📍' label='Where' value={cue.location} />
            )}
            {cue?.afterBehavior && (
              <CueField emoji='⚡' label='After' value={cue.afterBehavior} />
            )}
          </View>
        ) : (
          <Text className='text-sm text-stone-500'>
            When, where, and after what
          </Text>
        )}

        {/* Completion checkmark */}
        <CompletionCheckmark
          isVisible={hasCue}
          reduceMotion={reduceMotion}
          sectionIndex={sectionIndex}
          shouldAnimate={shouldAnimate}
        />
      </SectionCard>
    </AnimatedSection>
  );
}

export default CueTriggerSection;
