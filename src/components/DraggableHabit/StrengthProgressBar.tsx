/**
 * StrengthProgressBar — Visualises habit strength as an animated segmented bar.
 *
 * Layout (same 5-column grid as CardHeader via {@link HabitCardGridRow}):
 * - Column 1: Animated tier emoji
 * - Columns 2–4: Progress bar track
 * - Column 5: Demoted percentage text (bar is the primary signal)
 */

import React from 'react';
import { Text, View } from 'react-native';
import ReAnimated, { type AnimatedStyle } from 'react-native-reanimated';
import { getStrengthEmoji } from './strengthUtils';
import { colors } from '@/theme';
import { getMaterialTier } from '../HabitChainVisualizer/materialTier';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography, fontFamilies } from '../../theme/typography';
import type { ProgressEmojiSet } from '../../utils/progressEmojis';
import { HabitCardGridRow } from './HabitCardGridRow';
import { CARD_ICON_SIZE } from './cardLayout.constants';
import { StrengthProgressBarTrack } from './StrengthProgressBarTrack';

interface StrengthProgressBarProps {
  strengthPercent: number;
  strengthEmojiAnimatedStyle: AnimatedStyle;
  progressAnimatedStyle: AnimatedStyle;
  emojis?: ProgressEmojiSet;
  accentColor?: string;
}

export function StrengthProgressBar({
  strengthPercent,
  strengthEmojiAnimatedStyle,
  progressAnimatedStyle,
  emojis,
  accentColor,
}: StrengthProgressBarProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const tier = getMaterialTier(strengthPercent);
  const tierFillColor =
    tier.useAccent && accentColor
      ? accentColor
      : tier.tierColor || (isDark ? '#A3E635' : colors.strength.starting);

  return (
    <HabitCardGridRow
      className='mb-3'
      col1={
        <View
          className='items-center justify-center'
          style={{ height: CARD_ICON_SIZE, width: CARD_ICON_SIZE }}
        >
          <ReAnimated.Text
            style={[
              { fontFamily: fontFamilies.primary.text },
              { fontSize: typography.heading2.fontSize, textAlign: 'center' },
              strengthEmojiAnimatedStyle,
            ]}
          >
            {getStrengthEmoji(strengthPercent, emojis)}
          </ReAnimated.Text>
        </View>
      }
      col5={
        // Bar is the primary progress signal, so the percent is demoted:
        // small + muted, and static (no counting animation) to cut list noise.
        <Text
          className='text-xs font-semibold'
          style={{ color: themeColors.gray[500] }}
        >
          {Math.round(strengthPercent)}%
        </Text>
      }
      overlay={
        <StrengthProgressBarTrack
          progressAnimatedStyle={progressAnimatedStyle}
          tierFillColor={tierFillColor}
        />
      }
    />
  );
}
