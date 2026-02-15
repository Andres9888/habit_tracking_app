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

import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Activity, Info, TrendingUp, TrendingDown } from 'lucide-react-native';

import type { ConsistencyIndexCardProps } from './types';
import { BreakdownSection } from './BreakdownSection';
import { ChangeIndicator } from './ChangeIndicator';
import { ProgressRing } from './ProgressRing';
import { getScoreColor, getFeedbackMessage } from './helpers';

export function ConsistencyIndexCard({
  consistencyIndex,
  previousOverall,
  onInfoPress,
}: ConsistencyIndexCardProps) {
  const { overall, day30, day60, day90 } = consistencyIndex;

  const change = useMemo(() => {
    if (previousOverall === undefined) return null;
    return overall - previousOverall;
  }, [overall, previousOverall]);

  const scoreColor = getScoreColor(overall);
  const feedbackMessage = getFeedbackMessage(overall);

  const handleInfoPress = () => {
    Haptics.selectionAsync();
    onInfoPress?.();
  };

  return (
    <Animated.View
      accessibilityLabel={`Consistency Index: ${overall} percent overall`}
      accessibilityRole='summary'
      className='rounded-2xl border border-stone-200 bg-white p-4 shadow-sm'
      entering={FadeInDown.delay(150).springify().damping(18)}
    >
      {/* Header */}
      <View className='mb-3 flex-row items-center justify-between'>
        <View className='flex-row items-center gap-2'>
          <View className='h-8 w-8 items-center justify-center rounded-lg bg-violet-100'>
            <Activity className='text-violet-600' size={16} />
          </View>
          <Text className='font-semibold text-stone-800'>
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
          <Info className='text-stone-400' size={16} />
        </Pressable>
      </View>

      {/* Main Content */}
      <View className='flex-row items-center gap-4'>
        <View className='relative h-20 w-20 items-center justify-center'>
          <ProgressRing color={scoreColor} progress={overall} />
          <View className='absolute inset-0 items-center justify-center'>
            <Text className='text-xl font-bold text-stone-800'>{overall}%</Text>
          </View>
        </View>

        <BreakdownSection day30={day30} day60={day60} day90={day90} />
      </View>

      <ChangeIndicator change={change} />

      {/* Feedback Tip */}
      <View className='mt-3 rounded-lg bg-stone-50 p-2'>
        <Text className='text-xs text-stone-500'>💡 {feedbackMessage}</Text>
      </View>
    </Animated.View>
  );
}

export default ConsistencyIndexCard;
