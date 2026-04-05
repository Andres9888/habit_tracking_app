import { View, Text } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';
import { StreakBadge } from './StreakBadge';
import { ActionButtons } from './ActionButtons';

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
  const { colors } = useThemeColors();

  return (
    <View className='mt-2'>
      <View
        className='rounded-3xl p-5'
        style={{
          backgroundColor: colors.card,
          shadowColor: colors.text.primary,
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        }}
      >
        <View className='flex-row gap-4'>
          <View className='items-center'>
            <View className='h-16 w-16 items-center justify-center rounded-2xl' style={{ backgroundColor: colors.status.infoLight }}>
              <Text className='text-4xl'>{emoji}</Text>
            </View>
          </View>

          <View className='flex-1'>
            <View className='flex-row items-start justify-between'>
              <View className='flex-1 pr-4'>
                <Text className='text-xl font-semibold' style={{ color: colors.text.primary }}>
                  {name}
                </Text>
                {scheduleLabel ? (
                  <Text className='mt-1 text-sm' style={{ color: colors.text.secondary }}>
                    {scheduleLabel}
                  </Text>
                ) : null}
                {notes ? (
                  <Text
                    className='mt-2 text-sm'
                    style={{ color: colors.text.secondary }}
                    numberOfLines={2}
                  >
                    {notes}
                  </Text>
                ) : null}
              </View>
              <StreakBadge bestStreak={bestStreak} streak={streak} />
            </View>

            {recentMissBadge ? (
              <View className='mt-3 flex-row items-center gap-1.5 rounded-full px-3 py-1' style={{ backgroundColor: colors.status.warningLight }}>
                <AlertTriangle color={colors.status.warning} size={iconSizes.small} />
                <Text className='text-xs font-medium' style={{ color: colors.status.warningText }}>
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
