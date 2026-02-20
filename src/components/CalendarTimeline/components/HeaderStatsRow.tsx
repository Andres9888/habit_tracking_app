import React from 'react';
import { View } from 'react-native';

import { CompletionRing } from './CompletionRing';
import { StreakPill } from './StreakPill';

interface HeaderStatsRowProps {
  bestStreak: number;
  completedToday: number;
  totalHabits: number;
  reduceMotion: boolean;
}

/** Row showing streak pill and completion ring between nav header and day cells */
export const HeaderStatsRow: React.FC<HeaderStatsRowProps> = ({
  bestStreak,
  completedToday,
  totalHabits,
  reduceMotion,
}) => {
  const hasStats = bestStreak > 0 || totalHabits > 0;
  if (!hasStats) return null;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 8,
      }}
    >
      <StreakPill reduceMotion={reduceMotion} streak={bestStreak} />
      <CompletionRing
        completed={completedToday}
        reduceMotion={reduceMotion}
        total={totalHabits}
      />
    </View>
  );
};
