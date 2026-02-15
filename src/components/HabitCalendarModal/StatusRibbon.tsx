
import { View, Text } from 'react-native';

import { AlertTriangle } from 'lucide-react-native';

import { ActionButtons } from './ActionButtons';
import { StreakBadge } from './StreakBadge';

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
  return (
    <View className='mt-2'>
      <View
        className='rounded-3xl bg-white p-5'
        style={{
          shadowColor: '#1c1917',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        }}
      >
        <View className='flex-row gap-4'>
          <View className='items-center'>
            <View className='h-16 w-16 items-center justify-center rounded-2xl bg-blue-50'>
              <Text className='text-4xl'>{emoji}</Text>
            </View>
          </View>

          <View className='flex-1'>
            <View className='flex-row items-start justify-between'>
              <View className='flex-1 pr-4'>
                <Text className='text-xl font-semibold text-stone-900'>
                  {name}
                </Text>
                {scheduleLabel ? (
                  <Text className='mt-1 text-sm text-stone-500'>
                    {scheduleLabel}
                  </Text>
                ) : null}
                {notes ? (
                  <Text
                    className='mt-2 text-sm text-stone-500'
                    numberOfLines={2}
                  >
                    {notes}
                  </Text>
                ) : null}
              </View>
              <StreakBadge bestStreak={bestStreak} streak={streak} />
            </View>

            {recentMissBadge ? (
              <View className='mt-3 flex-row items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1'>
                <AlertTriangle color='#b45309' size={14} />
                <Text className='text-xs font-medium text-amber-700'>
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
