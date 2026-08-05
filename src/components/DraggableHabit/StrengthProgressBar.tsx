/**
 * StrengthProgressBar — Visualises habit strength as an animated segmented bar.
 *
 * Layout (same 5-column grid as CardHeader via {@link HabitCardGridRow}):
 * - Column 1: Animated tier emoji
 * - Columns 2–4: Progress bar track
 * - Column 5: Animated counting percentage text
 */

import React from 'react';
import { Text, View, type TextStyle, type ViewStyle } from 'react-native';
import ReAnimated, { type AnimatedStyle } from 'react-native-reanimated';
import { getStrengthEmoji } from './strengthUtils';
import { useCountingPercent } from './useCountingPercent';
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
  strengthEmojiAnimatedStyle: AnimatedStyle<TextStyle>;
  progressAnimatedStyle: AnimatedStyle<ViewStyle>;
  emojis?: ProgressEmojiSet;
  accentColor?: string;
}

function StrengthProgressBarComponent({
  strengthPercent,
  strengthEmojiAnimatedStyle,
  progressAnimatedStyle,
  emojis,
  accentColor,
}: StrengthProgressBarProps) {
  const { isDark } = useThemeColors();
  const displayPercent = useCountingPercent(strengthPercent);
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
        <Text
          className='text-sm font-bold'
          style={{ color: isDark ? '#A3E635' : colors.strength.starting }}
        >
          {displayPercent}%
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

export const StrengthProgressBar = React.memo(StrengthProgressBarComponent);
