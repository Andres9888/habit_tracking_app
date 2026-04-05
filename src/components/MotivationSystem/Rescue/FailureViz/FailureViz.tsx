/**
 * FailureViz Component
 * Dedicated failure visualization for Rescue Mode.
 * Uses loss aversion psychology to motivate habit completion.
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { AlertTriangle } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { clsx } from 'clsx';

import type { FailureVizProps } from './FailureViz.types';
import { VizFieldsList } from './VizFieldsList';
import { StreakLossPreview } from './StreakLossPreview';
import { useFailureVizAnimation } from './useFailureVizAnimation';
import { useThemeColors } from '../../../../theme/ThemeContext';

export function FailureViz({
  visualization,
  streakCount,
  reduceMotion = false,
  className,
}: FailureVizProps) {
  const { colors } = useThemeColors();
  const containerAnimatedStyle = useFailureVizAnimation(reduceMotion);

  return (
    <Animated.View
      className={clsx(
        'rounded-2xl border-l-4 p-4',
        className
      )}
      style={[containerAnimatedStyle, { borderLeftColor: colors.status.error, backgroundColor: colors.status.errorLight }]}
    >
      <View className='mb-4 flex-row items-center gap-3'>
        <View className='h-10 w-10 items-center justify-center rounded-xl' style={{ backgroundColor: colors.status.errorLight }}>
          <AlertTriangle color={colors.status.error} size={iconSizes.medium} />
        </View>
        <View className='flex-1'>
          <Text className='text-base font-semibold' style={{ color: colors.status.errorText }}>
            If You Skip Today...
          </Text>
          <Text className='text-xs' style={{ color: colors.status.error }}>
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

      {streakCount !== undefined && streakCount > 0 ? <StreakLossPreview
          reduceMotion={reduceMotion}
          streakCount={streakCount}
        /> : null}

      <View className='mt-3 rounded-lg px-3 py-2' style={{ backgroundColor: colors.status.errorLight }}>
        <Text className='text-center text-xs' style={{ color: colors.status.error }}>
          Loss aversion: This feeling moves you 2x more effectively than rewards
        </Text>
      </View>
    </Animated.View>
  );
}

export default FailureViz;
