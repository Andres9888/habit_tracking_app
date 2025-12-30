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
import { Clock, MapPin, Link, Plus, Check } from 'lucide-react-native';
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
  const shadowOpacity = useSharedValue(0.08);
  const elevation = useSharedValue(2);

  const animatedStyle = useAnimatedStyle(() => ({
    elevation: elevation.value,
    shadowOffset: {
      height: interpolate(elevation.value, [1, 2], [1, 2]),
      width: 0,
    },
    shadowOpacity: shadowOpacity.value,
    shadowRadius: interpolate(elevation.value, [1, 2], [2, 4]),
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    'worklet';
    scale.value = withSpring(0.98, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.04, SPRING_BUTTON);
    elevation.value = withSpring(1, SPRING_BUTTON);
  }, [scale, shadowOpacity, elevation]);

  const handlePressOut = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.08, SPRING_BUTTON);
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
          { shadowColor: '#78716c' }, // stone-500
        ]}
      >
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole='button'
          className={clsx('rounded-2xl bg-white p-4', className)}
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
        'rounded-2xl bg-white p-4 shadow-sm shadow-stone-200/50',
        className
      )}
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
 * CueField Component - Individual cue field display
 */
function CueField({
  icon: Icon,
  label,
  value,
  iconColorClass = 'text-sky-500',
}: {
  icon: typeof Clock;
  label: string;
  value?: string;
  iconColorClass?: string;
}) {
  return (
    <View className='flex-row items-center gap-2'>
      <Icon className={iconColorClass} size={14} />
      <Text className='text-xs text-stone-500'>{label}:</Text>
      <Text className='flex-1 text-xs font-medium text-stone-700'>
        {value || '—'}
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
  const intentionPreview = cue ? formatIntentionPreview(cue) : null;

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
        <View className='flex-row items-start gap-3'>
          {/* Icon with completion checkmark */}
          <View className='relative h-10 w-10 items-center justify-center rounded-xl bg-sky-100'>
            {hasCue ? (
              <Link className='text-sky-500' size={20} />
            ) : (
              <PulsingIcon reduceMotion={reduceMotion}>
                <Link className='text-sky-500' size={20} />
              </PulsingIcon>
            )}
            <CompletionCheckmark
              isVisible={hasCue}
              reduceMotion={reduceMotion}
              sectionIndex={sectionIndex}
              shouldAnimate={shouldAnimate}
            />
          </View>

          {/* Content area */}
          <View className='flex-1'>
            {hasCue ? (
              /* Filled state */
              <>
                <Text className='mb-2 font-semibold text-stone-800'>
                  Cue / Trigger
                </Text>
                <View className='gap-1.5'>
                  {cue?.time && (
                    <CueField icon={Clock} label='When' value={cue.time} />
                  )}
                  {cue?.location && (
                    <CueField
                      icon={MapPin}
                      label='Where'
                      value={cue.location}
                    />
                  )}
                  {cue?.afterBehavior && (
                    <CueField
                      icon={Link}
                      label='After'
                      value={cue.afterBehavior}
                    />
                  )}
                </View>
                {intentionPreview && (
                  <View className='mt-2 rounded-lg bg-sky-50 px-2 py-1.5'>
                    <Text className='text-xs italic text-sky-700'>
                      "{intentionPreview}"
                    </Text>
                  </View>
                )}
              </>
            ) : (
              /* Empty state */
              <>
                <View className='mb-1 flex-row items-center justify-between'>
                  <Text className='font-semibold text-stone-800'>
                    Cue / Trigger
                  </Text>
                  <View className='flex-row items-center gap-1'>
                    <Plus className='text-sky-600' size={12} />
                    <Text className='text-xs font-medium text-sky-600'>
                      Set up
                    </Text>
                  </View>
                </View>
                <Text className='text-sm text-stone-500'>
                  When, where, and after what
                </Text>
                <Text className='mt-1 text-xs text-stone-400'>
                  Habits with cues are 2x more likely to stick
                </Text>
              </>
            )}
          </View>
        </View>
      </SectionCard>
    </AnimatedSection>
  );
}

export default CueTriggerSection;
