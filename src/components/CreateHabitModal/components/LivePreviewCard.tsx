import { memo, useMemo } from 'react';
import { Text, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { TimeOfDay } from './TimeOfDaySelector';

interface LivePreviewCardProps {
  habitName: string;
  emoji: string | null;
  color: string;
  timeOfDay: TimeOfDay;
  selectedDays: boolean[];
  reminderEnabled?: boolean;
  reminderTime?: string;
}

const LivePreviewCardComponent = ({
  habitName,
  emoji,
  color,
  timeOfDay,
  selectedDays,
  reminderEnabled = false,
  reminderTime = '12:00 PM',
}: LivePreviewCardProps) => {
  const timeEmoji = timeOfDay === 'morning' ? '🌅' : timeOfDay === 'afternoon' ? '☀️' : '🌙';
  const timeLabel = timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1);

  const frequencyText = useMemo(() => {
    const selectedCount = selectedDays.filter(Boolean).length;
    if (selectedCount === 7) return 'Daily';
    if (selectedCount === 0) return 'No days';
    return `${selectedCount} day${selectedCount > 1 ? 's' : ''}/week`;
  }, [selectedDays]);

  const displayName = habitName.trim() || 'New Habit';

  return (
    <View
      className='mb-5 rounded-2xl border-2 border-stone-200 p-4 shadow-sm'
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F9FAFB']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          borderRadius: 16,
        }}
      />

      {/* Preview Label + Live Badge */}
      <View className='mb-2 flex-row items-center justify-between'>
        <Text className='text-xs font-bold uppercase tracking-wide text-stone-500'>
          Preview
        </Text>
        <View className='flex-row items-center gap-1'>
          <Sparkles color='#f59e0b' size={12} strokeWidth={2} />
          <Text className='text-xs font-medium text-amber-600'>Live</Text>
        </View>
      </View>
      <View className='flex-row items-center gap-3'>
        {/* Gradient background icon */}
        <View
          className='h-12 w-12 items-center justify-center rounded-xl shadow-sm'
          style={{
            backgroundColor: color,
          }}
        >
          <Text className='text-2xl'>{emoji || '✨'}</Text>
        </View>

        {/* Habit details */}
        <View className='flex-1'>
          <Text
            className='text-base font-semibold text-stone-900'
            numberOfLines={1}
          >
            {displayName}
          </Text>
          <View className='mt-0.5 flex-row items-center gap-1.5'>
            <Text className='rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700'>
              {frequencyText}
            </Text>
            <Text className='text-stone-300'>•</Text>
            <Text className='text-xs text-stone-500'>
              {timeEmoji} {timeLabel}
            </Text>
            {reminderEnabled && (
              <>
                <Text className='text-stone-300'>•</Text>
                <Text className='text-xs text-stone-500'>
                  🔔 {reminderTime}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export const LivePreviewCard = memo(LivePreviewCardComponent);

export default LivePreviewCard;
