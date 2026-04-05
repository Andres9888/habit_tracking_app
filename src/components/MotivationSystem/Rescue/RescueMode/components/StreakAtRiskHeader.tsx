import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { AlertTriangle, Flame, Timer } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../../../theme/ThemeContext';

interface StreakAtRiskHeaderProps {
  streak: number;
  hoursRemaining?: number;
  reduceMotion?: boolean;
}

/**
 * StreakAtRiskHeader - Urgent header showing streak is at risk
 */
export function StreakAtRiskHeader({
  streak,
  hoursRemaining,
  reduceMotion,
}: StreakAtRiskHeaderProps) {
  const { colors } = useThemeColors();
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;

    // Continuous pulse animation for urgency
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1, // Infinite
      true
    );
  }, [reduceMotion, pulseScale]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View className='items-center rounded-2xl p-4' style={{ backgroundColor: colors.status.errorLight }}>
      {/* Emergency icon */}
      <Animated.View
        className='mb-3 h-16 w-16 items-center justify-center rounded-full'
        style={[pulseStyle, { backgroundColor: colors.status.errorLight }]}
      >
        <AlertTriangle color={colors.status.error} size={iconSizes.xl} />
      </Animated.View>

      {/* Streak at risk badge */}
      <View className='mb-2 flex-row items-center gap-2 rounded-full px-4 py-2' style={{ backgroundColor: colors.status.error }}>
        <Flame className='text-white' size={iconSizes.medium} />
        <Text className='text-base font-bold text-white'>
          {streak} Day Streak at Risk!
        </Text>
      </View>

      {/* Time remaining */}
      {hoursRemaining === undefined ? null : <View className='mt-2 flex-row items-center gap-1'>
          <Timer color={colors.status.error} size={iconSizes.small} />
          <Text className='text-sm font-medium' style={{ color: colors.status.error }}>
            {hoursRemaining <= 1
              ? 'Less than 1 hour left'
              : `${hoursRemaining} hours remaining`}
          </Text>
        </View>}
    </View>
  );
}
