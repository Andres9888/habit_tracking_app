/**
 * ConsistencyIndexCard Component
 * Shows a rolling average consistency score that's more forgiving than streaks
 *
 * Unlike streaks which reset to zero on a single miss, consistency index
 * uses weighted rolling averages (30/60/90 days) to show true long-term progress.
 * Recent days are weighted slightly higher (0.98 decay factor).
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Activity, Info } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

import type { ConsistencyIndexCardProps } from './types';
import { getScoreColor, getFeedbackMessage } from './helpers';
import { ProgressRing } from './ProgressRing';
import { BreakdownSection } from './BreakdownSection';
import { ChangeIndicator } from './ChangeIndicator';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '@/theme/ThemeContext';

export function ConsistencyIndexCard({
  consistencyIndex,
  previousOverall,
  onInfoPress,
}: ConsistencyIndexCardProps) {
  const { colors } = useThemeColors();
  const { overall, day30, day60, day90 } = consistencyIndex;

  const change = useMemo(() => {
    if (previousOverall === undefined) return null;
    return overall - previousOverall;
  }, [overall, previousOverall]);

  const scoreColor = getScoreColor(overall, colors.status.success);
  const feedbackMessage = getFeedbackMessage(overall);

  const handleInfoPress = () => {
    triggerHaptic('selection');
    onInfoPress?.();
  };

  return (
    <Animated.View
      accessibilityLabel={`Consistency Index: ${overall} percent overall`}
      accessibilityRole='summary'
      className='rounded-2xl border p-4 shadow-sm'
      style={{ borderColor: colors.border, backgroundColor: colors.card }}
      entering={FadeInDown.delay(150).springify().damping(18)}
    >
      {/* Header */}
      <View className='mb-3 flex-row items-center justify-between'>
        <View className='flex-row items-center gap-2'>
          <View className='h-8 w-8 items-center justify-center rounded-lg' style={{ backgroundColor: colors.status.premiumLight }}>
            <Activity color={colors.status.premiumText} size={iconSizes.small} />
          </View>
          <Text className='font-semibold' style={{ color: colors.text.primary }}>
            Consistency Index
          </Text>
        </View>

        <Pressable
          accessibilityHint='Opens explanation of how consistency is calculated'
          accessibilityLabel='Learn more about consistency index'
          accessibilityRole='button'
          className='rounded-full p-1'
          onPress={handleInfoPress}
        >
          <Info color={colors.text.tertiary} size={iconSizes.small} />
        </Pressable>
      </View>

      {/* Main Content */}
      <View className='flex-row items-center gap-4'>
        <View className='relative h-20 w-20 items-center justify-center'>
          <ProgressRing color={scoreColor} progress={overall} />
          <View className='absolute inset-0 items-center justify-center'>
            <Text className='text-xl font-bold' style={{ color: colors.text.primary }}>{overall}%</Text>
          </View>
        </View>

        <BreakdownSection day30={day30} day60={day60} day90={day90} />
      </View>

      <ChangeIndicator change={change} />

      {/* Feedback Tip */}
      <View className='mt-3 rounded-lg p-2' style={{ backgroundColor: colors.gray[50] }}>
        <Text className='text-xs' style={{ color: colors.text.secondary }}>💡 {feedbackMessage}</Text>
      </View>
    </Animated.View>
  );
}

export default ConsistencyIndexCard;
