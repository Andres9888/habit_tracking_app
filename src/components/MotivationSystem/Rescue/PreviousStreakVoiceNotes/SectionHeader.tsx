/**
 * SectionHeader for PreviousStreakVoiceNotes
 */

import { View, Text } from 'react-native';
import { Flame, Sparkles } from 'lucide-react-native';

interface SectionHeaderProps {
  bestStreak: number;
}

export function SectionHeader({ bestStreak }: SectionHeaderProps) {
  return (
    <View className='mb-3 flex-row items-center gap-2'>
      <View className='h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100'>
        <Flame className='text-amber-600' size={20} />
      </View>
      <View className='flex-1'>
        <Text className='text-lg font-bold text-amber-800'>
          Your Best Streak Self
        </Text>
        <Text className='text-xs text-amber-600'>
          Voice notes from your {bestStreak}-day streak
        </Text>
      </View>
      <View className='flex-row items-center gap-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-2 py-1'>
        <Sparkles className='text-amber-600' size={12} />
        <Text className='text-xs font-medium text-amber-700'>
          Peak Motivation
        </Text>
      </View>
    </View>
  );
}
