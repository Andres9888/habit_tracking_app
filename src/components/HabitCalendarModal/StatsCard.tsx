import { View, Text } from 'react-native';
import { getEmojiAndName } from '../DraggableHabit/DraggableHabit.hooks';

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
  const { emoji: extractedEmoji, name } = getEmojiAndName(habitName);
  const displayEmoji = emoji || extractedEmoji;
  const scheduleText = scheduleLabel || 'Daily at 7:00 AM';

  return (
    <View className='rounded-2xl bg-white p-5'>
      {/* Habit Header */}
      {showHeader && (
        <View className='mb-6 flex-row items-start gap-3'>
          {displayEmoji && (
            <View className='h-14 w-14 items-center justify-center rounded-xl bg-blue-100'>
              <Text className='text-[30px]'>{displayEmoji}</Text>
            </View>
          )}
          <View className='flex-1'>
            <Text className='text-2xl font-semibold text-stone-900'>
              {name}
            </Text>
            <Text className='mt-1 text-base text-stone-500'>
              {scheduleText}
            </Text>
            {habitNotes ? (
              <Text className='mt-2 text-sm text-stone-500' numberOfLines={2}>
                {habitNotes}
              </Text>
            ) : null}
          </View>
        </View>
      )}

      {/* Stats Row */}
      <View className='flex-row items-center justify-between'>
        {/* Current Streak */}
        <View className='items-center'>
          <Text className='text-[30px] font-extrabold text-orange-500'>
            {currentStreak}
          </Text>
          <Text className='mt-1 text-center text-sm font-medium leading-5 text-stone-500'>
            Current{'\n'}Streak
          </Text>
        </View>

        {/* Best Streak */}
        <View className='items-center'>
          <Text className='text-[30px] font-extrabold text-stone-900'>
            {bestStreak}
          </Text>
          <Text className='mt-1 text-center text-sm font-medium leading-5 text-stone-500'>
            Best Streak
          </Text>
        </View>

        {/* Completion Percentage */}
        <View className='items-center'>
          <Text className='text-[30px] font-extrabold text-emerald-700'>
            {completionPercentage}%
          </Text>
          <Text className='mt-1 text-center text-sm font-medium leading-5 text-stone-500'>
            Completion
          </Text>
        </View>
      </View>
    </View>
  );
}
