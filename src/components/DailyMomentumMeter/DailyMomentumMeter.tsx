/**
 * DailyMomentumMeter Component
 *
 * A beautiful animated progress indicator showing today's habit completion.
 * Features animated fill, celebratory state at 100%, and motivational messaging.
 */

import React from 'react';
import type { DailyMomentumMeterProps } from './types';
import { getProgressColors, getMessage } from './helpers';
import { useAnimations } from './useAnimations';
import { CompactMeter } from './CompactMeter';
import { StandardMeter } from './StandardMeter';

export function DailyMomentumMeter({
  completedToday,
  totalHabits,
  reduceMotion = false,
  size = 'standard',
}: DailyMomentumMeterProps) {
  const percentage =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const { celebrationScale, flameScale, glowOpacity, progressWidth } =
    useAnimations(percentage, reduceMotion);

  const colors = getProgressColors(percentage);
  const message = getMessage(percentage);

  if (size === 'compact') {
    return (
      <CompactMeter
        colors={colors}
        percentage={percentage}
        progressWidth={progressWidth}
      />
    );
  }

  return (
    <StandardMeter
      celebrationScale={celebrationScale}
      colors={colors}
      completedToday={completedToday}
      flameScale={flameScale}
      glowOpacity={glowOpacity}
      message={message}
      percentage={percentage}
      progressWidth={progressWidth}
      totalHabits={totalHabits}
    />
  );
}

export default DailyMomentumMeter;
