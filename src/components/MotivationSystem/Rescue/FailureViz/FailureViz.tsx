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
  withTiming,
} from 'react-native-reanimated';
import { AlertTriangle, Brain, Heart, User } from 'lucide-react-native';
import { clsx } from 'clsx';

import type { FailureVizProps } from './FailureViz.types';
import { SPRING_GENTLE } from './FailureViz.constants';
import { VizField } from './VizField';
import { StreakLossPreview } from './StreakLossPreview';
import { EmptyVizState } from './EmptyVizState';

export function FailureViz({
  visualization,
  streakCount,
  reduceMotion = false,
  className,
}: FailureVizProps) {
  const scale = useSharedValue(reduceMotion ? 1 : 0.95);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1;
      opacity.value = 1;
      return;
    }

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

      {streakCount !== undefined && streakCount > 0 && (
        <StreakLossPreview
          reduceMotion={reduceMotion}
          streakCount={streakCount}
        />
      )}

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
