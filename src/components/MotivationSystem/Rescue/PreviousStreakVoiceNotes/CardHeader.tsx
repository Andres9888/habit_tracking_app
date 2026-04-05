/**
 * CardHeader for StreakVoiceNoteCard
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Flame, ChevronDown, ChevronUp, Mic } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface CardHeaderProps {
  streakAtRecording: number;
  bestStreak: number;
  daysAgoText: string;
  isExpanded: boolean;
}

export function CardHeader({
  streakAtRecording,
  bestStreak,
  daysAgoText,
  isExpanded,
}: CardHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <>
      <View className='flex-1 flex-row items-center gap-3'>
        <View className='relative'>
          <View className='h-10 w-10 items-center justify-center rounded-full' style={{ backgroundColor: colors.status.warningLight }}>
            <Mic color={colors.status.warning} size={iconSizes.medium} />
          </View>
          <View className='absolute -bottom-1 -right-1 flex-row items-center gap-0.5 rounded-full px-1.5 py-0.5' style={{ backgroundColor: colors.status.streak }}>
            <Flame className='text-white' size={iconSizes.micro} />
            <Text className='text-[10px] font-bold text-white'>
              {streakAtRecording}
            </Text>
          </View>
        </View>
        <View className='flex-1'>
          <Text className='text-sm font-semibold' style={{ color: colors.status.warningText }}>
            Day {streakAtRecording} of your {bestStreak}-day streak
          </Text>
          <Text className='text-xs' style={{ color: colors.status.warning }}>{daysAgoText}</Text>
        </View>
      </View>
      <View className='ml-2 h-8 w-8 items-center justify-center rounded-full' style={{ backgroundColor: colors.status.warningLight }}>
        {isExpanded ? (
          <ChevronUp color={colors.status.warning} size={iconSizes.small} />
        ) : (
          <ChevronDown color={colors.status.warning} size={iconSizes.small} />
        )}
      </View>
    </>
  );
}
