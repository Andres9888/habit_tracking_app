/**
 * SectionHeader for PreviousStreakVoiceNotes
 */

import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Sparkles } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface SectionHeaderProps {
  bestStreak: number;
}

export function SectionHeader({ bestStreak }: SectionHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View className='mb-3 flex-row items-center gap-2'>
      <View className='h-10 w-10 items-center justify-center rounded-xl' style={{ backgroundColor: colors.status.warningLight }}>
        <Flame color={colors.status.warning} size={20} />
      </View>
      <View className='flex-1'>
        <Text className='text-lg font-bold' style={{ color: colors.status.warningText }}>
          Your Best Streak Self
        </Text>
        <Text className='text-xs' style={{ color: colors.status.warning }}>
          Voice notes from your {bestStreak}-day streak
        </Text>
      </View>
      <View className='flex-row items-center gap-1 rounded-full px-2 py-1' style={{ backgroundColor: colors.status.warningLight }}>
        <Sparkles color={colors.status.warning} size={12} />
        <Text className='text-xs font-medium' style={{ color: colors.status.warningText }}>
          Peak Motivation
        </Text>
      </View>
    </View>
  );
}
