import { Plus, Sparkles } from 'lucide-react-native';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

interface HabitsEmptyStateProps {
  isLoading: boolean;
  openCreateHabitScreen: () => void;
  openTemplatesScreen?: () => void;
}

const POPULAR_HABITS = [
  { emoji: '💪', name: 'Exercise' },
  { emoji: '📚', name: 'Reading' },
  { emoji: '🧘', name: 'Meditation' },
];

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
    <View className='items-center justify-center gap-8 py-20'>
      {/* Hero Section */}
      <View className='items-center gap-5'>
        {/* Emoji illustration */}
        <View className='flex-row gap-3'>
          {POPULAR_HABITS.map((habit, index) => (
            <View
              key={index}
              className='h-14 w-14 items-center justify-center rounded-2xl'
              style={{
                backgroundColor: index === 0 ? '#fef3c7' : index === 1 ? '#dbeafe' : '#dcfce7',
                transform: [{ rotate: index === 0 ? '-8deg' : index === 2 ? '8deg' : '0deg' }],
              }}
            >
              <Text className='text-[28px]'>{habit.emoji}</Text>
            </View>
          ))}
        </View>

        {/* Headline & value prop */}
        <View className='items-center gap-3'>
          <Text className='text-center text-[26px] font-bold leading-[32px] text-[#101727]'>
            Build lasting habits
          </Text>
          <Text className='max-w-[280px] text-center text-[15px] leading-[22px] text-[#6b7280]'>
            Start with just one routine. Track your progress, build momentum, and watch your consistency grow.
          </Text>
        </View>

        {/* Social proof / encouragement */}
        <View className='flex-row items-center gap-2 rounded-full bg-[#f0fdf4] px-4 py-2'>
          <Sparkles color='#16a34a' size={14} strokeWidth={2} />
          <Text className='text-[12px] font-semibold text-[#16a34a]'>
            Most people start with 1-3 habits
          </Text>
        </View>
      </View>

      {/* CTA Section */}
      <View className='items-center gap-4'>
        <Pressable
          accessibilityHint='Add your first habit'
          accessibilityLabel='Create first habit'
          accessibilityRole='button'
          onPress={openCreateHabitScreen}
        >
          <View
            className='h-36 w-36 items-center justify-center rounded-3xl border-2 border-dashed'
            style={{ borderColor: '#cbd5f5', backgroundColor: '#f8f9ff' }}
          >
            <View className='h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-[0px_12px_24px_rgba(99,102,241,0.15)]'>
              <Plus color='#6d28d9' size={36} strokeWidth={2.5} />
            </View>
            <Text className='mt-3 text-[13px] font-semibold text-[#6d28d9]'>
              Create habit
            </Text>
          </View>
        </Pressable>

        {openTemplatesScreen && (
          <Pressable
            accessibilityHint='Explore expert-built habit templates and get inspired'
            accessibilityLabel='Browse habit templates'
            accessibilityRole='button'
            className='rounded-full border-2 border-[#e0e7ff] bg-white px-6 py-3'
            onPress={openTemplatesScreen}
          >
            <Text className='text-[14px] font-semibold text-[#6366f1]'>
              Browse popular templates →
            </Text>
          </Pressable>
        )}
      </View>

      {/* Simple steps hint */}
      <View className='items-center gap-2 pt-2'>
        <Text className='text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]'>
          It's easy to get started
        </Text>
        <View className='flex-row gap-8'>
          <View className='items-center gap-1'>
            <Text className='text-[20px]'>✨</Text>
            <Text className='text-[11px] font-medium text-[#6b7280]'>Choose</Text>
          </View>
          <View className='items-center gap-1'>
            <Text className='text-[20px]'>📅</Text>
            <Text className='text-[11px] font-medium text-[#6b7280]'>Track</Text>
          </View>
          <View className='items-center gap-1'>
            <Text className='text-[20px]'>🔥</Text>
            <Text className='text-[11px] font-medium text-[#6b7280]'>Grow</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
