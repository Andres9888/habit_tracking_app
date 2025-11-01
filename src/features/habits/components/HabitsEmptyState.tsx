import { Plus } from 'lucide-react-native';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

interface HabitsEmptyStateProps {
  isLoading: boolean;
  openCreateHabitScreen: () => void;
}

export function HabitsEmptyState({ isLoading, openCreateHabitScreen }: HabitsEmptyStateProps) {
  if (isLoading) {
    return (
      <View className='items-center justify-center gap-3 py-20'>
        <ActivityIndicator color='#101727' size='small' />
        <Text className='text-sm font-medium text-[#475467]'>
          Loading your habits…
        </Text>
      </View>
    );
  }

  return (
    <View className='items-center justify-center gap-4 px-8 py-24'>
      <Text className='text-center text-lg font-semibold text-[#101727]'>
        Create your first habit
      </Text>
      <Text className='text-center text-sm text-[#475467]'>
        Add a habit to start tracking your progress and building streaks.
      </Text>
      <Pressable
        accessibilityHint='Open create habit modal'
        accessibilityLabel='Add habit'
        accessibilityRole='button'
        className='h-11 flex-row items-center gap-2 rounded-full bg-[#101828] px-5'
        onPress={openCreateHabitScreen}
      >
        <Plus color='#ffffff' size={18} strokeWidth={2.25} />
        <Text className='text-base font-medium tracking-tight text-white'>
          New Habit
        </Text>
      </Pressable>
    </View>
  );
}
