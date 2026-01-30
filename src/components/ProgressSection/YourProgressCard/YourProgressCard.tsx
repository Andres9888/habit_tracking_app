/**
 * YourProgressCard Component
 *
 * @deprecated This component is deprecated. Use `ProgressSectionConsolidated` instead.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, AccessibilityInfo } from 'react-native';
import { Info } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import type { YourProgressCardProps } from '../types';
import {
  getStrengthLevel,
  getNextLevel,
  calculateLevelProgress,
} from './helpers';
import { ProgressRing } from './ProgressRing';
import { LevelInfo } from './LevelInfo';
import { ProgressBar } from './ProgressBar';
import { ActionableTip } from './ActionableTip';
import { useProgressAnimations } from './useProgressAnimations';

export function YourProgressCard({
  strength,
  weeklyChange = 0,
  actionableTip,
  onInfoPress,
}: YourProgressCardProps) {
  const clampedStrength = Math.max(0, Math.min(100, strength));
  const level = getStrengthLevel(clampedStrength);
  const nextLevel = getNextLevel(clampedStrength);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  const { animatedStrength, emojiAnimatedStyle } = useProgressAnimations(
    clampedStrength,
    reduceMotion
  );

  const handleInfoPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onInfoPress?.();
  };

  const levelProgress = useMemo(
    () => calculateLevelProgress(clampedStrength, level, nextLevel),
    [clampedStrength, level, nextLevel]
  );

  const label = `Habit strength at ${Math.round(clampedStrength)}%, ${level.label} level`;

  return (
    <View
      accessibilityLabel={label}
      accessibilityRole='summary'
      className='overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50'
    >
      <View className='absolute inset-0 bg-gradient-to-br from-teal-50/30 via-white to-emerald-50/30' />
      <View className='absolute inset-0 rounded-2xl border border-teal-500/20' />

      <View className='p-4'>
        <View className='mb-3 flex-row items-center justify-between'>
          <Text className='text-sm font-semibold text-stone-600'>
            Your Progress
          </Text>
          <Pressable
            accessibilityLabel='Learn about habit strength'
            accessibilityRole='button'
            className='h-7 w-7 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200'
            onPress={handleInfoPress}
          >
            <Info className='text-stone-500' size={16} />
          </Pressable>
        </View>

        <View className='mb-4 flex-row items-center'>
          <ProgressRing
            animatedStrength={animatedStrength}
            emojiAnimatedStyle={emojiAnimatedStyle}
            level={level}
          />
          <LevelInfo
            clampedStrength={clampedStrength}
            level={level}
            nextLevel={nextLevel}
            weeklyChange={weeklyChange}
          />
        </View>

        <ProgressBar levelColor={level.color} levelProgress={levelProgress} />
        <ActionableTip tip={actionableTip} />
      </View>
    </View>
  );
}

export default YourProgressCard;
