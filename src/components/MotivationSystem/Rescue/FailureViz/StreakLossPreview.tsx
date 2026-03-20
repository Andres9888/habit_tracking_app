/**
 * StreakLossPreview Component
 * Shows what user will lose if they skip - leverages loss aversion
 */

import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { Flame } from 'lucide-react-native';
import type { StreakLossPreviewProps } from './FailureViz.types';
import { SPRING_BOUNCY } from './FailureViz.constants';
import { useThemeColors } from '../../../../theme/ThemeContext';

export function StreakLossPreview({
  streakCount,
  reduceMotion,
}: StreakLossPreviewProps) {
  const { colors } = useThemeColors();
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
      className='mt-3 flex-row items-center gap-2 rounded-xl p-3'
      style={[animatedStyle, { backgroundColor: colors.status.errorLight }]}
    >
      <Flame color={colors.status.error} size={18} />
      <Text className='flex-1 text-sm font-medium' style={{ color: colors.status.errorText }}>
        {streakCount} days gone. Starting over from zero.
      </Text>
    </Animated.View>
  );
}
