/**
 * StrengthCard - Individual strength card with circular progress ring
 */

import React from 'react';
import { Text } from 'react-native';

import Animated, { FadeIn } from 'react-native-reanimated';

import type { StrengthCardProps } from './types';
import { DeltaBadge } from './DeltaBadge';
import { PerfectBadge } from './PerfectBadge';
import { ProgressRing } from './ProgressRing';
import { getLabelText } from './utils';
import { getStrengthColors, getStrengthLabel } from '../strengthUtils';

export function StrengthCard({
  strength,
  timeLabel,
  isHighlighted = false,
  delta,
  animationDelay = 0,
  showPerfectBadge = false,
}: StrengthCardProps) {
  const colors = getStrengthColors(strength);
  const label = getStrengthLabel(strength);
  const labelText = getLabelText(label);

  const containerClass = isHighlighted
    ? 'border-2 border-emerald-200 bg-white shadow-sm'
    : 'bg-stone-50';

  return (
    <Animated.View
      accessible
      accessibilityLabel={`${timeLabel}: ${Math.round(strength)}% strength, ${labelText}`}
      accessibilityRole='none'
      className={`flex-1 items-center rounded-xl p-3 ${containerClass}`}
      entering={FadeIn.delay(animationDelay).duration(400)}
    >
      <ProgressRing
        ringColor={colors.ring}
        strength={strength}
        textColor={colors.primary}
        timeLabel={timeLabel}
      />

      <Text className='mb-0.5 text-xs font-medium uppercase tracking-wide text-stone-500'>
        {timeLabel}
      </Text>
      <Text
        className='text-xs font-semibold capitalize'
        style={{ color: colors.primary }}
      >
        {labelText}
      </Text>

      {delta !== undefined && <DeltaBadge delta={delta} />}
      {showPerfectBadge && <PerfectBadge />}
    </Animated.View>
  );
}
