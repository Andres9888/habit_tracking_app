/**
 * YourProgressCard Component
 *
 * @deprecated This component is deprecated. Use `ProgressSectionConsolidated` instead.
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Info } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { shadows } from '@/theme/spacing';

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
import { triggerHaptic } from '@/utils/haptics';
import { useProgressReduceMotion } from './useProgressReduceMotion';

export function YourProgressCard({
  strength,
  weeklyChange = 0,
  actionableTip,
  onInfoPress,
}: YourProgressCardProps) {
  const { colors: themeColors } = useThemeColors();
  const clampedStrength = Math.max(0, Math.min(100, strength));
  const level = getStrengthLevel(clampedStrength);
  const nextLevel = getNextLevel(clampedStrength);
  const reduceMotion = useProgressReduceMotion();

  const { animatedStrength, emojiAnimatedStyle } = useProgressAnimations(
    clampedStrength,
    reduceMotion
  );

  const handleInfoPress = () => {
    triggerHaptic('tap');
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
      className='overflow-hidden rounded-2xl'
      style={shadows.card}
    >
      <LinearGradient
        className='absolute inset-0'
        colors={[
          'rgba(240, 253, 250, 0.3)',
          themeColors.card,
          'rgba(236, 253, 245, 0.3)',
        ]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      />
      <View
        className='absolute inset-0 rounded-2xl border'
        style={{ borderColor: themeColors.status.successLight }}
      />

      <View className='p-4'>
        <View className='mb-3 flex-row items-center justify-between'>
          <Text
            className='text-sm font-semibold'
            style={{ color: themeColors.text.primary }}
          >
            Your Progress
          </Text>
          <Pressable
            accessibilityLabel='Learn about habit strength'
            accessibilityRole='button'
            className='h-7 w-7 items-center justify-center rounded-full active:opacity-80'
            style={{ backgroundColor: themeColors.background }}
            hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
            onPress={handleInfoPress}
          >
            <Info color={themeColors.text.secondary} size={iconSizes.small} />
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
