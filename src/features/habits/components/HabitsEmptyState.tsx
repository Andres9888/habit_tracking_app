import { Plus } from 'lucide-react-native';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
    <View className='items-center justify-center gap-5 px-8 py-32'>
      {/* Premium illustration placeholder */}
      <View className='mb-2 h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-orange-50' style={{ backgroundColor: '#dbeafe' }}>
        <Text className='text-5xl'>✨</Text>
      </View>

      <View className='gap-2'>
        <Text className='text-center text-[20px] font-bold leading-[28px] text-[#101727]'>
          Start Building Better Habits
        </Text>
        <Text className='text-center text-[15px] leading-[22px] text-[#6b7280]'>
          Create your first habit in 30 seconds.{'\n'}
          Track progress, build streaks, achieve goals.
        </Text>
      </View>

      {/* Premium gradient CTA */}
      <Pressable
        accessibilityHint='Open create habit modal'
        accessibilityLabel='Create your first habit'
        accessibilityRole='button'
        onPress={openCreateHabitScreen}
      >
        <LinearGradient
          colors={['#2563eb', '#7c3aed']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className='h-12 flex-row items-center gap-2 rounded-full px-6'
          style={{
            shadowColor: '#2563eb',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Plus color='#ffffff' size={20} strokeWidth={2.5} />
          <Text className='text-[16px] font-semibold leading-[22px] tracking-tight text-white'>
            Create First Habit
          </Text>
        </LinearGradient>
      </Pressable>

      {/* Value prop */}
      <Text className='mt-2 text-center text-[13px] leading-[18px] text-[#9ca3af]'>
        Join thousands building lasting habits
      </Text>
    </View>
  );
}
