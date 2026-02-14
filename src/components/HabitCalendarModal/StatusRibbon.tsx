import { View, Text } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { StreakBadge } from './StreakBadge';
import { ActionButtons } from './ActionButtons';
import { useThemeColors } from '../../theme/ThemeContext';

interface StatusRibbonProps {
  emoji: string;
  name: string;
  scheduleLabel?: string;
  notes?: string;
  streak: number;
  bestStreak: number;
  recentMissBadge: string | null;
  isTodayCompleted: boolean;
  onMarkToday: () => void;
  onEdit: () => void;
}

export function StatusRibbon({
  emoji,
  name,
  scheduleLabel,
  notes,
  streak,
  bestStreak,
  recentMissBadge,
  isTodayCompleted,
  onMarkToday,
  onEdit,
}: StatusRibbonProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <View className='mt-2'>
      <View
        className='rounded-3xl p-5'
        style={{
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          borderWidth: isDark ? 1 : 0,
          shadowColor: isDark ? '#000' : '#1c1917',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 16,
        }}
      >
        <View className='flex-row gap-4'>
          <View className='items-center'>
            <View
              className='h-16 w-16 items-center justify-center rounded-2xl'
              style={{ backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : '#EFF6FF' }}
            >
              <Text className='text-4xl'>{emoji}</Text>
            </View>
          </View>

          <View className='flex-1'>
            <View className='flex-row items-start justify-between'>
              <View className='flex-1 pr-4'>
                <Text
                  className='text-xl font-semibold'
                  style={{ color: colors.text.primary }}
                >
                  {name}
                </Text>
                {scheduleLabel ? (
                  <Text
                    className='mt-1 text-sm'
                    style={{ color: colors.text.secondary }}
                  >
                    {scheduleLabel}
                  </Text>
                ) : null}
                {notes ? (
                  <Text
                    className='mt-2 text-sm'
                    numberOfLines={2}
                    style={{ color: colors.text.secondary }}
                  >
                    {notes}
                  </Text>
                ) : null}
              </View>
              <StreakBadge bestStreak={bestStreak} streak={streak} />
            </View>

            {recentMissBadge ? (
              <View
                className='mt-3 flex-row items-center gap-1.5 rounded-full px-3 py-1'
                style={{ backgroundColor: isDark ? 'rgba(217,119,6,0.15)' : '#FFFBEB' }}
              >
                <AlertTriangle color={isDark ? '#FBBF24' : '#b45309'} size={14} />
                <Text
                  className='text-xs font-medium'
                  style={{ color: isDark ? '#FBBF24' : '#b45309' }}
                >
                  {recentMissBadge} · Tap to review
                </Text>
              </View>
            ) : null}

            <ActionButtons
              isTodayCompleted={isTodayCompleted}
              onEdit={onEdit}
              onMarkToday={onMarkToday}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
