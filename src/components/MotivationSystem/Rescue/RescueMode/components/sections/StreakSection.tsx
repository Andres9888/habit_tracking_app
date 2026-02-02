import React from 'react';
import type { RescueHabitData } from '../../RescueMode.types';
import { AnimatedContent } from '../AnimatedContent';
import { StreakAtRiskHeader } from '../StreakAtRiskHeader';

type StreakSectionProps = {
  habit: RescueHabitData;
  visible: boolean;
  reduceMotion: boolean;
};

export function StreakSection({
  habit,
  visible,
  reduceMotion,
}: StreakSectionProps) {
  return (
    <AnimatedContent index={0} reduceMotion={reduceMotion} visible={visible}>
      <StreakAtRiskHeader
        hoursRemaining={habit.hoursRemaining}
        reduceMotion={reduceMotion}
        streak={habit.currentStreak}
      />
    </AnimatedContent>
  );
}
