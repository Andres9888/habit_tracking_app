import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { ArchivedHabit, StrengthInfo } from '../types';

interface HabitStatsBadgesProps {
  habit: ArchivedHabit;
  strength: number;
  strengthInfo: StrengthInfo;
}

export function HabitStatsBadges({
  habit,
  strength,
  strengthInfo,
}: HabitStatsBadgesProps) {
  const { isDark } = useThemeColors();

  return (
    <View className='mb-3 flex-row flex-wrap gap-2'>
      {/* Strength Badge */}
      <View
        className={`flex-row items-center gap-1.5 rounded-lg px-2.5 py-1 ${strengthInfo.bgColor}`}
        style={strengthInfo.bgStyle ? { backgroundColor: strengthInfo.bgStyle } : undefined}
      >
        <Text className='text-sm'>{strengthInfo.emoji}</Text>
        <Text
          className={`text-xs font-semibold ${strengthInfo.textColor}`}
          style={strengthInfo.textStyle ? { color: strengthInfo.textStyle } : undefined}
        >
          {Math.round(strength)}% {strengthInfo.label}
        </Text>
      </View>

      {/* Streak Badge */}
      {(habit.currentStreak ?? 0) > 0 ? (
        <View
          className='flex-row items-center gap-1.5 rounded-lg px-2.5 py-1'
          style={{
            backgroundColor: isDark ? '#78350f' : '#fef3c7',
          }}
        >
          <Text className='text-sm'>🔥</Text>
          <Text
            className='text-xs font-semibold'
            style={{ color: isDark ? '#fde68a' : '#b45309' }}
          >
            {habit.currentStreak} day streak
          </Text>
        </View>
      ) : (
        <View
          className='flex-row items-center gap-1.5 rounded-lg px-2.5 py-1'
          style={{
            backgroundColor: isDark ? '#374151' : '#f5f5f4',
          }}
        >
          <Text className='text-sm'>🔥</Text>
          <Text
            className='text-xs font-semibold'
            style={{ color: isDark ? '#9ca3af' : '#78716c' }}
          >
            No streak
          </Text>
        </View>
      )}

      {/* Total Completions Badge */}
      {(habit.totalCompletions ?? 0) > 0 ? <View
          className='flex-row items-center gap-1.5 rounded-lg px-2.5 py-1'
          style={{
            backgroundColor: isDark ? '#1e3a8a' : '#dbeafe',
          }}
        >
          <Text
            className='text-xs font-bold'
            style={{ color: isDark ? '#93c5fd' : '#2563eb' }}
          >
            ✓
          </Text>
          <Text
            className='text-xs font-semibold'
            style={{ color: isDark ? '#93c5fd' : '#1d4ed8' }}
          >
            {habit.totalCompletions} total
          </Text>
        </View> : null}
    </View>
  );
}
