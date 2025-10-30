import { Plus, Settings } from 'lucide-react-native';
import { View, Pressable, Text } from 'react-native';
import { CalendarTimeline } from '../../../components/CalendarTimeline';
import HabitsAtRiskWidget from '../../../components/HabitsAtRiskWidget';

interface HabitsHeaderProps {
  canNavigateForward: boolean;
  dates: Date[];
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  onOpenCreateHabit: () => void;
  onOpenSettings: () => void;
  onSelectHabitById: (habitId: string) => void;
}

export function HabitsHeader({
  canNavigateForward,
  dates,
  onNextWeek,
  onPreviousWeek,
  onOpenCreateHabit,
  onOpenSettings,
  onSelectHabitById,
}: HabitsHeaderProps) {
  return (
    <View className='gap-4'>
      <View className='mt-3 flex-row items-center justify-between'>
        <Pressable
          accessibilityHint='Open create habit modal'
          accessibilityLabel='Add habit'
          accessibilityRole='button'
          className='h-12 flex-row items-center gap-2 rounded-full bg-[#101828] px-5'
          onPress={onOpenCreateHabit}
        >
          <Plus color='#ffffff' size={18} strokeWidth={2.25} />
          <Text className='text-base font-normal tracking-tight text-white'>
            Habits
          </Text>
        </Pressable>
        <View className='flex-row gap-3'>
          <Pressable
            accessibilityLabel='Open settings'
            accessibilityRole='button'
            className='h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6]'
            onPress={onOpenSettings}
          >
            <Settings color='#101727' size={20} strokeWidth={2.25} />
          </Pressable>
        </View>
      </View>

      <CalendarTimeline
        showSeparator
        canNavigateForward={canNavigateForward}
        dates={dates}
        onNextWeek={onNextWeek}
        onPreviousWeek={onPreviousWeek}
      />

      <HabitsAtRiskWidget
        onHabitPress={(habitId) => {
          onSelectHabitById(habitId);
        }}
      />
    </View>
  );
}
