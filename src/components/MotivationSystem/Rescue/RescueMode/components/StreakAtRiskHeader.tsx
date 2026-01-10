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
    <View className='items-center rounded-2xl bg-rose-50 p-4'>
      {/* Emergency icon */}
      <Animated.View
        className='mb-3 h-16 w-16 items-center justify-center rounded-full bg-rose-100'
        style={pulseStyle}
      >
        <AlertTriangle className='text-rose-600' size={32} />
      </Animated.View>

      {/* Streak at risk badge */}
      <View className='mb-2 flex-row items-center gap-2 rounded-full bg-rose-500 px-4 py-2'>
        <Flame className='text-white' size={18} />
        <Text className='text-base font-bold text-white'>
          {streak} Day Streak at Risk!
        </Text>
      </View>

      {/* Time remaining */}
      {hoursRemaining !== undefined && (
        <View className='mt-2 flex-row items-center gap-1'>
          <Timer className='text-rose-500' size={14} />
          <Text className='text-sm font-medium text-rose-600'>
            {hoursRemaining <= 1
              ? 'Less than 1 hour left'
              : `${hoursRemaining} hours remaining`}
          </Text>
        </View>
      )}
    </View>
  );
}
