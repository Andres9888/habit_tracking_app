/**
 * StreakRecordsSection Component
 * Displays top streak records with medal indicators
 */

import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy } from 'lucide-react-native';
import type { StreakRecordsSectionProps } from '../InsightsSection.types';
import { TOP_STREAK_MEDAL_COUNT } from '../InsightsSection.constants';
import { useThemeColors } from '@/theme/ThemeContext';
import { shadows } from '@/theme/spacing';
import { iconSizes } from '@/theme/iconSizes';

const MEDAL_EMOJIS = ['🥇', '🥈', '🥉'];

// Medal styles are now resolved at render time from theme tokens
const MEDAL_STYLES_STATIC = [
  { useTheme: 'warning' as const },
  { useTheme: 'silver' as const },
  { useTheme: 'streak' as const },
];

export function StreakRecordsSection({
  streakRecords,
}: StreakRecordsSectionProps) {
  const { colors } = useThemeColors();

  if (streakRecords.length === 0) return null;

  const topRecords = streakRecords.slice(0, TOP_STREAK_MEDAL_COUNT);

  return (
    <View className='overflow-hidden rounded-2xl' style={shadows.card}>
      <LinearGradient
        className='absolute inset-0'
        colors={['rgba(245, 243, 255, 0.3)', colors.card, 'rgba(239, 246, 255, 0.3)']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      />
      <View className='p-5'>
        <View className='mb-4 flex-row items-center justify-center gap-2'>
          <View className='h-8 w-8 items-center justify-center rounded-lg' style={{ backgroundColor: colors.status.premiumLight }}>
            <Trophy color={colors.status.premium} size={iconSizes.small} />
          </View>
          <Text className='text-lg font-bold' style={{ color: colors.text.primary }}>
            Streak Records
          </Text>
        </View>
        <Text className='mb-3 text-center text-[10px] font-bold uppercase tracking-widest' style={{ color: colors.status.premium }}>
          Top Performances
        </Text>

        {/* Compact Top 3 Medals */}
        <View className='flex-row gap-2'>
          {topRecords.map((record, i) => {
            const medalConfig = MEDAL_STYLES_STATIC[i];
            const isSilver = medalConfig.useTheme === 'silver';
            const medalBg = isSilver ? colors.gray[50] : medalConfig.useTheme === 'warning' ? colors.status.warningLight : colors.status.streakLight;
            const medalBorder = isSilver ? colors.border : medalConfig.useTheme === 'warning' ? colors.status.warning : colors.status.streak;
            const medalText = isSilver ? colors.text.primary : medalConfig.useTheme === 'warning' ? colors.status.warningText : colors.status.streakText;
            const medalSubtext = isSilver ? colors.text.secondary : medalConfig.useTheme === 'warning' ? colors.status.warning : colors.status.streak;

            return (
              <View
                key={`${record.startDate}-${record.days}`}
                className='flex-1 items-center rounded-xl border p-2.5'
                style={{ backgroundColor: medalBg, borderColor: medalBorder }}
              >
                <Text className='mb-0.5 text-base'>{MEDAL_EMOJIS[i]}</Text>
                <Text
                  className='text-lg font-bold'
                  style={{ color: medalText }}
                >
                  {record.days}
                </Text>
                <Text
                  className='text-[9px]'
                  style={{ color: medalSubtext }}
                >
                  days
                </Text>
                {record.isCurrent ? <View className='mt-1 rounded-full px-1.5 py-0.5' style={{ backgroundColor: colors.status.warningLight }}>
                    <Text className='text-[8px] font-semibold' style={{ color: colors.status.warningText }}>
                      NOW
                    </Text>
                  </View> : null}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
