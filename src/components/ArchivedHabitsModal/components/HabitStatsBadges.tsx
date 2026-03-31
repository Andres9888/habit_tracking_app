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
  const { colors, isDark } = useThemeColors();

  return (
    <View className='mb-4 flex-row flex-wrap gap-2'>
      {/* Strength Badge */}
      <View
        className={`flex-row items-center gap-1.5 rounded-lg px-3 py-1.5 ${strengthInfo.bgColor}`}
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
          className='flex-row items-center gap-1.5 rounded-lg px-3 py-1.5'
          style={{
            backgroundColor: colors.status.streakLight,
          }}
        >
          <Text className='text-sm'>🔥</Text>
          <Text
            className='text-xs font-semibold'
            style={{ color: colors.status.streakText }}
          >
            {habit.currentStreak} day streak
          </Text>
        </View>
      ) : (
        <View
          className='flex-row items-center gap-1.5 rounded-lg px-3 py-1.5'
          style={{
            backgroundColor: isDark ? colors.gray[200] : colors.gray[50],
          }}
        >
          <Text className='text-sm'>🔥</Text>
          <Text
            className='text-xs font-semibold'
            style={{ color: colors.text.tertiary }}
          >
            No streak
          </Text>
        </View>
      )}

      {/* Total Completions Badge */}
      {(habit.totalCompletions ?? 0) > 0 ? <View
          className='flex-row items-center gap-1.5 rounded-lg px-3 py-1.5'
          style={{
            backgroundColor: colors.status.infoLight,
          }}
        >
          <Text
            className='text-xs font-bold'
            style={{ color: colors.status.info }}
          >
            ✓
          </Text>
          <Text
            className='text-xs font-semibold'
            style={{ color: colors.status.infoText }}
          >
            {habit.totalCompletions} total
          </Text>
        </View> : null}
    </View>
  );
}
