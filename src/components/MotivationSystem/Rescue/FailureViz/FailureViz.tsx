/**
 * FailureViz Component
 * Dedicated failure visualization for Rescue Mode.
 * Uses loss aversion psychology to motivate habit completion.
 */

import React from 'react';
import { View, Text } from 'react-native';

import Animated from 'react-native-reanimated';
import { AlertTriangle } from 'lucide-react-native';
import { clsx } from 'clsx';

import type { FailureVizProps } from './FailureViz.types';
import { StreakLossPreview } from './StreakLossPreview';
import { VizFieldsList } from './VizFieldsList';
import { useFailureVizAnimation } from './useFailureVizAnimation';

export function FailureViz({
  visualization,
  streakCount,
  reduceMotion = false,
  className,
}: FailureVizProps) {
  const containerAnimatedStyle = useFailureVizAnimation(reduceMotion);

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

      <VizFieldsList
        failureBody={visualization?.failureBody}
        failureEmotion={visualization?.failureEmotion}
        failureMind={visualization?.failureMind}
        reduceMotion={reduceMotion}
      />

      {streakCount !== undefined && streakCount > 0 && (
        <StreakLossPreview
          reduceMotion={reduceMotion}
          streakCount={streakCount}
        />
      )}

      <View className='mt-3 rounded-lg bg-rose-100/50 px-3 py-2'>
        <Text className='text-center text-xs text-rose-600'>
          Loss aversion: This feeling moves you 2x more effectively than rewards
        </Text>
      </View>
    </Animated.View>
  );
}

export default FailureViz;
