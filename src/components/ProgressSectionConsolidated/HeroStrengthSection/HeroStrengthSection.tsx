/**
 * HeroStrengthSection Component
 *
 * Hero section displaying the main habit strength progress ring
 * with level information and trend indicator.
 * Memoized to prevent re-renders when parent updates unrelated props.
 *
 * @see docs/specs/habit-details-screen/progress-consolidated-redesign.md
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';

import type { HeroStrengthSectionProps } from '../types';
import { getProgressToNextLevel } from '../types';
import { useHeroAnimations } from './useHeroAnimations';
import { StrengthRing } from './StrengthRing';
import { LevelInfo } from './LevelInfo';

export const HeroStrengthSection = React.memo(function HeroStrengthSection({
  strength,
  weeklyChange = 0,
}: HeroStrengthSectionProps) {
  const clampedStrength = useMemo(
    () => Math.max(0, Math.min(100, strength)),
    [strength]
  );

  const { currentLevel, nextLevel, progressPercent, pointsToNext } = useMemo(
    () => getProgressToNextLevel(clampedStrength),
    [clampedStrength]
  );

  const {
    animatedStrength,
    animatedCircleProps,
    emojiAnimatedStyle,
    progressBarAnimatedStyle,
  } = useHeroAnimations({ clampedStrength, progressPercent });

  const accessLabel = `Habit strength at ${Math.round(clampedStrength)} percent, ${currentLevel.label} level${weeklyChange === 0 ? '' : `, ${weeklyChange > 0 ? 'up' : 'down'} ${Math.abs(weeklyChange)} percent this week`}`;

  return (
    <View
      accessibilityLabel={accessLabel}
      accessibilityRole='summary'
      className='mb-5 flex-row items-center gap-4'
    >
      <StrengthRing
        animatedCircleProps={animatedCircleProps}
        animatedStrength={animatedStrength}
        currentLevelColor={currentLevel.color}
        currentLevelEmoji={currentLevel.emoji}
        emojiAnimatedStyle={emojiAnimatedStyle}
      />
      <LevelInfo
        currentLevel={currentLevel}
        nextLevel={nextLevel}
        pointsToNext={pointsToNext}
        progressBarAnimatedStyle={progressBarAnimatedStyle}
        weeklyChange={weeklyChange}
      />
    </View>
  );
});

export default HeroStrengthSection;
