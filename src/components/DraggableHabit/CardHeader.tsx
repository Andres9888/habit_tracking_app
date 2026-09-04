/**
 * CardHeader — Top row of a habit card: icon (with pulse), title, phase tag, chevron.
 *
 * Uses {@link HabitCardGridRow} (5-column grid). Title centerline aligns with emoji center.
 */

import React from 'react';
import { View, Text } from 'react-native';
import ReAnimated, { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { getIconBackground } from './colorUtils';
import type { CardColors, Habit } from './types';
import { HabitCardGridRow } from './HabitCardGridRow';
import { CardHeaderTitleBlock } from './CardHeaderTitleBlock';
import { getCardIconSize } from './cardLayout.constants';
import {
  getChevronColor,
  getEmojiTextStyle,
  getIconContainerStyle,
} from './CardHeader.styles';
import { iconSizes } from '@/theme/iconSizes';

interface CardHeaderProps {
  accentColor: string;
  bestStreak: number;
  colors: CardColors;
  emoji: string;
  habit: Habit;
  iconPulse: SharedValue<number>;
  isCompactMode?: boolean;
  isPaused: boolean;
  name: string;
  showHabitStrengthPercentage: boolean;
  streak: number;
}

function CardHeaderComponent({
  accentColor,
  bestStreak,
  colors,
  emoji,
  habit,
  iconPulse,
  isCompactMode,
  isPaused,
  name,
  showHabitStrengthPercentage,
  streak,
}: CardHeaderProps) {
  const iconPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconPulse.value }],
  }));
  const { colors: themeColors } = useThemeColors();
  const iconBg = getIconBackground(accentColor);
  const iconSize = getCardIconSize(isCompactMode);
  const showBestStreak =
    !isCompactMode &&
    bestStreak > 0 &&
    bestStreak > streak &&
    !showHabitStrengthPercentage;

  return (
    <HabitCardGridRow
      className={isCompactMode ? 'mb-2' : 'mb-3'}
      col1={
        <ReAnimated.View style={iconPulseStyle}>
          <View
            className='items-center justify-center rounded-xl'
            style={[
              getIconContainerStyle(iconBg, accentColor),
              { height: iconSize, width: iconSize },
            ]}
          >
            <Text style={getEmojiTextStyle(isCompactMode)}>{emoji}</Text>
          </View>
        </ReAnimated.View>
      }
      middle={
        <CardHeaderTitleBlock
          bestStreak={bestStreak}
          colors={colors}
          habit={habit}
          isCompactMode={isCompactMode}
          isPaused={isPaused}
          name={name}
          showBestStreak={showBestStreak}
          tertiaryTextColor={themeColors.text.tertiary}
        />
      }
      col5={
        <ChevronRight
          color={getChevronColor()}
          size={isCompactMode ? iconSizes.small : iconSizes.medium}
          strokeWidth={2}
        />
      }
    />
  );
}

export const CardHeader = React.memo(CardHeaderComponent);
