/**
 * FailureViz Component
 * Dedicated failure visualization for Rescue Mode
 *
 * Part of the Motivation System - Rescue phase
 * Story T8.4: Create `FailureViz` component (always shows failure)
 *
 * Scientific Basis:
 * - Andrew Huberman (Stanford) Dual Visualization Protocol
 * - Key insight: In Rescue Mode, ALWAYS show failure (user is struggling)
 * - Loss aversion (Kahneman & Tversky, Nobel Prize): Losses hurt 2x more
 *
 * Differences from ContextAwareViz:
 * - Always shows failure visualization (no motivation check)
 * - More dramatic, urgent styling
 * - Includes streak loss preview
 * - Designed for emotional impact
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { AlertTriangle, Brain, Heart, User, Flame } from 'lucide-react-native';
import { clsx } from 'clsx';

// Animation spring configs
const SPRING_BOUNCY = { damping: 8, stiffness: 300 };
const SPRING_GENTLE = { damping: 28, mass: 1, stiffness: 180 };

/** Failure visualization data */
export interface FailureVisualizationData {
  /** How body feels when failing */
  failureBody?: string;
  /** How mind feels when failing */
  failureMind?: string;
  /** Emotions when failing */
  failureEmotion?: string;
}

export interface FailureVizProps {
  /** Visualization data from the habit */
  visualization: FailureVisualizationData | undefined;
  /** Current streak count (for streak loss preview) */
  streakCount?: number;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Optional className for container styling */
  className?: string;
}

/**
 * VizField - Individual visualization field with icon
 */
function VizField({
  label,
  value,
  icon,
  index,
  reduceMotion,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  index: number;
  reduceMotion: boolean;
}) {
  const translateX = useSharedValue(reduceMotion ? 0 : -10);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      translateX.value = 0;
      opacity.value = 1;
      return;
    }

    const delay = index * 100 + 200;

    translateX.value = withDelay(delay, withSpring(0, SPRING_GENTLE));
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
  }, [reduceMotion, index, translateX, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      className='flex-row items-start gap-3 py-2'
      style={animatedStyle}
    >
      <View className='mt-0.5 h-8 w-8 items-center justify-center rounded-lg bg-rose-100'>
        {icon}
      </View>
      <View className='flex-1'>
        <Text className='text-xs font-medium text-rose-600'>{label}</Text>
        <Text className='text-sm leading-5 text-rose-800'>{value}</Text>
      </View>
    </Animated.View>
  );
}

/**
 * StreakLossPreview - Shows what user will lose if they skip
 */
function StreakLossPreview({
  streakCount,
  reduceMotion,
}: {
  streakCount: number;
  reduceMotion: boolean;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;

    // Shake animation to emphasize loss
    scale.value = withDelay(
      600,
      withSequence(
        withSpring(1.05, SPRING_BOUNCY),
        withSpring(1, SPRING_BOUNCY)
      )
    );
  }, [reduceMotion, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      className='mt-3 flex-row items-center gap-2 rounded-xl bg-rose-500/10 p-3'
      style={animatedStyle}
    >
      <Flame className='text-rose-500' size={18} />
      <Text className='flex-1 text-sm font-medium text-rose-700'>
        {streakCount} days gone. Starting over from zero.
      </Text>
    </Animated.View>
  );
}

/**
 * EmptyVizState - Shown when no visualization data is available
 */
function EmptyVizState() {
  return (
    <View className='items-center justify-center py-6'>
      <View className='mb-3 h-12 w-12 items-center justify-center rounded-full bg-rose-100'>
        <AlertTriangle className='text-rose-500' size={24} />
      </View>
      <Text className='mb-2 text-center text-sm font-medium text-stone-600'>
        Imagine how you'll feel if you skip
      </Text>
      <Text className='text-center text-xs text-stone-500'>
        Add failure visualization in the Motivation tab
      </Text>
    </View>
  );
}

/**
 * FailureViz - Main component
 *
 * Always shows failure visualization for Rescue Mode.
 * Uses rose/red color scheme to create urgency and
 * leverage loss aversion psychology.
 */
export function FailureViz({
  visualization,
  streakCount,
  reduceMotion = false,
  className,
}: FailureVizProps) {
  // Animation values
  const scale = useSharedValue(reduceMotion ? 1 : 0.95);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1;
      opacity.value = 1;
      return;
    }

    // Entrance animation
    scale.value = withSpring(1, SPRING_GENTLE);
    opacity.value = withTiming(1, { duration: 300 });
  }, [reduceMotion, scale, opacity]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const hasAnyField =
    visualization?.failureBody ||
    visualization?.failureMind ||
    visualization?.failureEmotion;

  return (
    <Animated.View
      className={clsx(
        'rounded-2xl border-l-4 border-l-rose-400 bg-rose-50/80 p-4',
        className
      )}
      style={containerAnimatedStyle}
    >
      {/* Header */}
      <View className='mb-4 flex-row items-center gap-3'>
        <View className='h-10 w-10 items-center justify-center rounded-xl bg-rose-100'>
          <AlertTriangle className='text-rose-600' size={20} />
        </View>
        <View className='flex-1'>
          <Text className='text-base font-semibold text-rose-800'>
            If You Skip Today...
          </Text>
          <Text className='text-xs text-rose-500'>
            Feel the weight of not doing this
          </Text>
        </View>
      </View>

      {/* Visualization content */}
      {hasAnyField ? (
        <View className='gap-1'>
          {visualization?.failureBody && (
            <VizField
              icon={<User className='text-rose-500' size={16} />}
              index={0}
              label='Body'
              reduceMotion={reduceMotion}
              value={visualization.failureBody}
            />
          )}
          {visualization?.failureMind && (
            <VizField
              icon={<Brain className='text-rose-500' size={16} />}
              index={1}
              label='Mind'
              reduceMotion={reduceMotion}
              value={visualization.failureMind}
            />
          )}
          {visualization?.failureEmotion && (
            <VizField
              icon={<Heart className='text-rose-500' size={16} />}
              index={2}
              label='Emotion'
              reduceMotion={reduceMotion}
              value={visualization.failureEmotion}
            />
          )}
        </View>
      ) : (
        <EmptyVizState />
      )}

      {/* Streak loss preview */}
      {streakCount !== undefined && streakCount > 0 && (
        <StreakLossPreview
          reduceMotion={reduceMotion}
          streakCount={streakCount}
        />
      )}

      {/* Science tip */}
      <View className='mt-3 rounded-lg bg-rose-100/50 px-3 py-2'>
        <Text className='text-center text-xs text-rose-600'>
          💡 Loss aversion: This feeling moves you 2x more effectively than
          rewards
        </Text>
      </View>
    </Animated.View>
  );
}

export default FailureViz;
