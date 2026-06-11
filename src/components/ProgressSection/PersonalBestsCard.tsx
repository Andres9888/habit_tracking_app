/**
 * PersonalBestsCard Component
 *
 * @deprecated Use `ProgressSectionConsolidated` instead.
 * See `../ProgressSectionConsolidated` for the unified replacement.
 *
 * Section 2: Combines Streak Records + Best/Worst Days.
 * Features:
 * - Top 3 streak medals (compact horizontal layout)
 * - Current streak highlighted with pulse animation + "NOW 🔥" badge
 * - Best day card (emerald theme)
 * - "Focus On" card for worst day (amber theme, tappable for tips)
 * - Amber/orange gradient theme
 */

import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { shadows } from '@/theme/spacing';

import type { PersonalBestsCardProps } from './types';
import { usePulseAnimation } from './PersonalBestsCard.hooks';
import { MedalRow } from './MedalRow';
import { BestWorstDayCards } from './BestWorstDayCards';

export function PersonalBestsCard({
  streakRecords,
  currentStreak,
  bestDay,
  worstDay,
  onWorstDayPress,
}: PersonalBestsCardProps) {
  const { colors: themeColors } = useThemeColors();
  const pulseAnimatedStyle = usePulseAnimation(currentStreak);

  const top3Records = streakRecords.slice(0, 3);
  const hasRecords = top3Records.length > 0;
  const showBestWorst = bestDay !== null && worstDay !== null;

  return (
    <View
      accessible
      accessibilityLabel={`Personal bests${currentStreak > 0 ? `, current streak ${currentStreak} days` : ''}`}
      className='overflow-hidden rounded-2xl'
      style={shadows.card}
    >
      <LinearGradient
        className='absolute inset-0'
        colors={['rgba(255, 251, 235, 0.3)', themeColors.card, 'rgba(255, 237, 213, 0.3)']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      />
      <View className='absolute inset-0 rounded-2xl border' style={{ borderColor: themeColors.status.warningLight }} />

      <View className='p-4'>
        <View className='mb-3 flex-row items-center gap-2'>
          <View className='h-8 w-8 items-center justify-center rounded-lg' style={{ backgroundColor: themeColors.status.warningLight }}>
            <Trophy color={themeColors.status.warning} size={iconSizes.small} />
          </View>
          <Text className='text-base font-semibold' style={{ color: themeColors.text.primary }}>
            Personal Bests
          </Text>
        </View>

        {hasRecords ? <MedalRow
            currentStreak={currentStreak}
            pulseAnimatedStyle={pulseAnimatedStyle}
            records={top3Records}
          /> : null}

        {showBestWorst ? <BestWorstDayCards
            bestDay={bestDay}
            worstDay={worstDay}
            onWorstDayPress={onWorstDayPress}
          /> : null}

        {!hasRecords && currentStreak === 0 ? <View className='items-center py-4'>
            <Text className='text-sm' style={{ color: themeColors.text.secondary }}>
              Complete 2+ consecutive days to start tracking streaks
            </Text>
          </View> : null}
      </View>
    </View>
  );
}

export default PersonalBestsCard;
