import { View, Text } from 'react-native';
import { getEmojiAndName } from '../DraggableHabit/DraggableHabit.hooks';
import { useThemeColors } from '../../theme/ThemeContext';

interface StatsCardProps {
  habitName: string;
  habitNotes?: string;
  emoji?: string;
  currentStreak: number;
  bestStreak: number;
  completionPercentage: number;
  scheduleLabel?: string;
  showHeader?: boolean;
}

export function StatsCard({
  habitName,
  habitNotes,
  emoji,
  currentStreak,
  bestStreak,
  completionPercentage,
  scheduleLabel,
  showHeader = true,
}: StatsCardProps) {
  const { colors } = useThemeColors();
  const { emoji: extractedEmoji, name } = getEmojiAndName(habitName);
  const displayEmoji = emoji || extractedEmoji;
  const scheduleText = scheduleLabel || 'Daily at 7:00 AM';

  return (
    <View className='rounded-2xl p-5' style={{ backgroundColor: colors.card }}>
      {/* Habit Header */}
      {showHeader ? <View className='mb-6 flex-row items-start gap-3'>
          {displayEmoji ? <View className='h-14 w-14 items-center justify-center rounded-xl' style={{ backgroundColor: colors.status.infoLight }}>
              <Text className='text-[30px]'>{displayEmoji}</Text>
            </View> : null}
          <View className='flex-1'>
            <Text className='text-2xl font-semibold' style={{ color: colors.text.primary }}>
              {name}
            </Text>
            <Text className='mt-1 text-base' style={{ color: colors.text.secondary }}>
              {scheduleText}
            </Text>
            {habitNotes ? (
              <Text className='mt-2 text-sm' style={{ color: colors.text.secondary }} numberOfLines={2}>
                {habitNotes}
              </Text>
            ) : null}
          </View>
        </View> : null}

      {/* Stats Row */}
      <View className='flex-row items-center justify-between'>
        {/* Current Streak */}
        <View className='items-center'>
          <Text className='text-2xl font-bold' style={{ color: colors.status.streak }}>
            {currentStreak}
          </Text>
          <Text className='mt-1 text-center text-sm font-medium leading-5' style={{ color: colors.text.secondary }}>
            Current{'\n'}Streak
          </Text>
        </View>

        {/* Best Streak */}
        <View className='items-center'>
          <Text className='text-2xl font-bold' style={{ color: colors.text.primary }}>
            {bestStreak}
          </Text>
          <Text className='mt-1 text-center text-sm font-medium leading-5' style={{ color: colors.text.secondary }}>
            Best Streak
          </Text>
        </View>

        {/* Completion Percentage */}
        <View className='items-center'>
          <Text className='text-2xl font-bold' style={{ color: colors.status.successText }}>
            {completionPercentage}%
          </Text>
          <Text className='mt-1 text-center text-sm font-medium leading-5' style={{ color: colors.text.secondary }}>
            Completion
          </Text>
        </View>
      </View>
    </View>
  );
}
