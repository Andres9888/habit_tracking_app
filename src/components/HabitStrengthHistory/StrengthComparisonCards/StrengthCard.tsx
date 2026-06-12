/**
 * StrengthCard - Individual strength card with circular progress ring
 */

import React from 'react';
import { Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import { shadows } from '@/theme/spacing';

import { getStrengthColors, getStrengthLabel } from '../strengthUtils';
import { getLabelText } from './utils';
import { DeltaBadge } from './DeltaBadge';
import { PerfectBadge } from './PerfectBadge';
import { ProgressRing } from './ProgressRing';
import type { StrengthCardProps } from './types';

export function StrengthCard({
  strength,
  timeLabel,
  isHighlighted = false,
  delta,
  animationDelay = 0,
  showPerfectBadge = false,
}: StrengthCardProps) {
  const { colors: themeColors } = useThemeColors();
  const colors = getStrengthColors(strength);
  const label = getStrengthLabel(strength);
  const labelText = getLabelText(label);

  const containerClass = isHighlighted
    ? 'border-2'
    : '';

  return (
    <Animated.View
      accessible
      accessibilityLabel={`${timeLabel}: ${Math.round(strength)}% strength, ${labelText}`}
      accessibilityRole='none'
      className={`flex-1 items-center rounded-xl p-3 ${containerClass}`}
      entering={FadeIn.delay(animationDelay).duration(400)}
      style={[{ backgroundColor: isHighlighted ? themeColors.card : themeColors.background, borderColor: isHighlighted ? themeColors.status.success : undefined }, isHighlighted ? shadows.card : undefined]}
    >
      <ProgressRing
        ringColor={colors.ring}
        strength={strength}
        textColor={colors.primary}
        timeLabel={timeLabel}
      />

      <Text className='mb-0.5 text-xs font-medium uppercase tracking-wide' style={{ color: themeColors.text.secondary }}>
        {timeLabel}
      </Text>
      <Text
        className='text-xs font-semibold capitalize'
        style={{ color: colors.primary }}
      >
        {labelText}
      </Text>

      {delta === undefined ? null : <DeltaBadge delta={delta} />}
      {showPerfectBadge ? <PerfectBadge /> : null}
    </Animated.View>
  );
}
