import { Plus } from 'lucide-react-native';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

interface HabitsEmptyStateProps {
  isLoading: boolean;
  openCreateHabitScreen: () => void;
  openTemplatesScreen?: () => void;
}

export function HabitsEmptyState({ isLoading, openCreateHabitScreen, openTemplatesScreen }: HabitsEmptyStateProps) {
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
    <View className='items-center justify-center gap-6 py-24'>
      <View className='items-center gap-4'>
        <Text className='text-center text-[22px] font-semibold text-[#101727]'>
          Create your first habit
        </Text>
        <Text className='text-center text-[14px] leading-[20px] text-[#6b7280]'>
          Capture the routines that matter and start your momentum.
        </Text>
      </View>

      <Pressable
        accessibilityHint='Add your first habit'
        accessibilityLabel='Add habit'
        accessibilityRole='button'
        onPress={openCreateHabitScreen}
      >
        <View
          className='h-32 w-32 items-center justify-center rounded-3xl border-2 border-dashed'
          style={{ borderColor: '#cbd5f5', backgroundColor: '#f8f9ff' }}
        >
          <View className='h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-[0px_12px_24px_rgba(99,102,241,0.15)]'>
            <Plus color='#6d28d9' size={34} strokeWidth={2.5} />
          </View>
        </View>
      </Pressable>

      {openTemplatesScreen && (
        <Pressable
          accessibilityHint='Explore expert-built habit templates'
          accessibilityLabel='Browse templates'
          accessibilityRole='button'
          onPress={openTemplatesScreen}
        >
          <Text className='text-[14px] font-medium text-[#6366f1]'>
            Browse templates instead →
          </Text>
        </Pressable>
      )}
    </View>
  );
}
