import { Plus, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';

interface HabitsEmptyStateProps {
  isLoading: boolean;
  openCreateHabitScreen: () => void;
  openTemplatesScreen?: () => void;
  onQuickCreateHabit?: (habitName: string) => Promise<void>;
}

const QUICK_START_HABITS = [
  { emoji: '💪', name: 'Morning Exercise', fullName: '💪 Morning Exercise' },
  { emoji: '📚', name: 'Read 10 Minutes', fullName: '📚 Read 10 Minutes' },
  { emoji: '🧘', name: 'Meditate', fullName: '🧘 Meditate' },
];

const POPULAR_HABITS = [
  { emoji: '💪', name: 'Exercise' },
  { emoji: '📚', name: 'Reading' },
  { emoji: '🧘', name: 'Meditation' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HabitsEmptyState({ isLoading, openCreateHabitScreen, openTemplatesScreen, onQuickCreateHabit }: HabitsEmptyStateProps) {
  const [creatingHabit, setCreatingHabit] = useState<string | null>(null);
  const { triggerSuccess } = useHapticFeedback();
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

      {/* Quick Start Suggestions */}
      {onQuickCreateHabit && (
        <View className='w-full gap-3'>
          <Text className='text-center text-[13px] font-semibold uppercase tracking-wider text-[#6b7280]'>
            Quick Start
          </Text>
          <View className='flex-row justify-center gap-3'>
            {QUICK_START_HABITS.map((habit) => {
              const isCreating = creatingHabit === habit.fullName;

              return (
                <QuickStartButton
                  key={habit.fullName}
                  habit={habit}
                  isCreating={isCreating}
                  onPress={async () => {
                    setCreatingHabit(habit.fullName);
                    triggerSuccess();
                    try {
                      await onQuickCreateHabit(habit.fullName);
                    } finally {
                      setCreatingHabit(null);
                    }
                  }}
                />
              );
            })}
          </View>
          <Text className='text-center text-[11px] text-[#9ca3af]'>
            Tap to instantly add a habit
          </Text>
        </View>
      )}

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

// Quick Start Button Component with animations
interface QuickStartButtonProps {
  habit: { emoji: string; name: string; fullName: string };
  isCreating: boolean;
  onPress: () => Promise<void>;
}

function QuickStartButton({ habit, isCreating, onPress }: QuickStartButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityLabel={`Add ${habit.name} habit`}
      accessibilityRole='button'
      className='items-center gap-2 rounded-2xl border-2 border-[#e5e7eb] bg-white px-4 py-3'
      disabled={isCreating}
      style={[
        animatedStyle,
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
          minWidth: 90,
        },
      ]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
    >
      {isCreating ? (
        <ActivityIndicator color='#6366f1' size='small' />
      ) : (
        <>
          <Text className='text-[28px]'>{habit.emoji}</Text>
          <Text className='text-center text-[12px] font-semibold text-[#1a1a1a]'>
            {habit.name}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}
