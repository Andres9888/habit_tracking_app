import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HabitsEmptyState({ isLoading, openCreateHabitScreen, openTemplatesScreen, onQuickCreateHabit }: HabitsEmptyStateProps) {
  const [creatingHabit, setCreatingHabit] = useState<string | null>(null);
  const { triggerSuccess } = useHapticFeedback();

  if (isLoading) {
    return (
      <View className='items-center justify-center gap-3 py-20'>
        <ActivityIndicator color='#101727' size='small' />
        <Text className='text-sm font-medium text-[#475467]'>Loading your habits…</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 gap-4 bg-[#f6f7fb] px-6 py-4'>
      {onQuickCreateHabit && (
        <QuickWinCard
          creatingHabit={creatingHabit}
          onQuickCreateHabit={async (habitName) => {
            setCreatingHabit(habitName);
            triggerSuccess();
            try {
              await onQuickCreateHabit(habitName);
            } finally {
              setCreatingHabit(null);
            }
          }}
        />
      )}

      <CustomHabitCard onPress={openCreateHabitScreen} />

      {openTemplatesScreen && (
        <TemplatesPeekCard onPress={openTemplatesScreen} />
      )}
    </View>
  );
}

interface QuickStartButtonProps {
  habit: { emoji: string; name: string; fullName: string };
  isCreating: boolean;
  onPress: () => Promise<void>;
  containerStyle?: ViewStyle;
}

function QuickStartButton({ habit, isCreating, onPress, containerStyle }: QuickStartButtonProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const { triggerLightImpact, triggerSelection } = useHapticFeedback();

  const handlePress = async () => {
    triggerSelection();
    await onPress();
  };

  return (
    <AnimatedPressable
      accessibilityLabel={`Add ${habit.name} habit`}
      accessibilityRole='button'
      className='items-center gap-2 rounded-2xl border border-[#e3e7ef] bg-white px-4 py-3 shadow-sm'
      disabled={isCreating}
      style={[animatedStyle, containerStyle]}
      onPress={handlePress}
      onPressIn={() => {
        triggerLightImpact();
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
          <Text className='text-[26px]'>{habit.emoji}</Text>
          <Text className='text-center text-[12px] font-semibold text-[#263040]'>{habit.name}</Text>
        </>
      )}
    </AnimatedPressable>
  );
}

function QuickWinCard({
  creatingHabit,
  onQuickCreateHabit,
}: {
  creatingHabit: string | null;
  onQuickCreateHabit: (habitName: string) => Promise<void>;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(20).springify().damping(18)}
      className='rounded-[28px] border border-[#f4d38c] bg-white p-5 shadow-[0px_14px_32px_rgba(247,171,60,0.18)]'
    >
      <View className='gap-2 text-center'>
        <View className='self-center rounded-full bg-[#fff4df] px-4 py-1'>
          <Text className='text-[11px] font-semibold uppercase tracking-[3px] text-[#b35309]'>Instant start</Text>
        </View>
        <Text className='text-[18px] font-semibold text-[#0f172a]'>Start your first streak in seconds</Text>
        <Text className='text-[13px] leading-[18px] text-[#5c606f]'>Pick a popular habit to begin your journey—you can customize it later.</Text>
      </View>
      <View className='mt-3 flex-row flex-wrap justify-center gap-2'>
        {QUICK_START_HABITS.map((habit) => (
          <QuickStartButton
            key={habit.fullName}
            habit={habit}
            isCreating={creatingHabit === habit.fullName}
            containerStyle={{ flexBasis: '30%' }}
            onPress={async () => onQuickCreateHabit(habit.fullName)}
          />
        ))}
      </View>
    </Animated.View>
  );
}

function CustomHabitCard({ onPress }: { onPress: () => void }) {
  const pressScale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: pressScale.value }] }));
  const { triggerSelection, triggerLightImpact } = useHapticFeedback();

  return (
    <AnimatedPressable
      accessibilityHint='Create a habit from scratch'
      accessibilityLabel='Create custom habit'
      accessibilityRole='button'
      entering={FadeInDown.delay(60).springify().damping(18)}
      className='rounded-[28px] border border-[#e4e7ef] bg-white p-5 shadow-[0px_14px_30px_rgba(15,23,42,0.12)]'
      style={animatedStyle}
      onPress={() => {
        triggerSelection();
        onPress();
      }}
      onPressIn={() => {
        triggerLightImpact();
        pressScale.value = withSpring(0.97, { damping: 16, stiffness: 260 });
      }}
      onPressOut={() => {
        pressScale.value = withSpring(1, { damping: 16, stiffness: 260 });
      }}
    >
      <View className='gap-2 text-center'>
        <View className='self-center rounded-full bg-[#f0f1ff] px-4 py-1'>
          <Text className='text-[11px] font-semibold uppercase tracking-[3px] text-[#4c3bdc]'>Custom flow</Text>
        </View>
        <Text className='text-[18px] font-semibold text-[#0f172a]'>Create your own habit</Text>
        <Text className='text-[13px] leading-[18px] text-[#5c606f]'>Design a habit that fits your unique goals and schedule.</Text>
      </View>
      <View className='mt-4 flex-row items-center justify-center'>
        <View className='h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6d28d9] to-[#4338ca] shadow-[0px_12px_24px_rgba(109,40,217,0.25)]'>
          <Plus color='#ffffff' size={28} strokeWidth={2.5} />
        </View>
      </View>
      <View className='mt-3 rounded-full border border-[#dcdff5] bg-[#f6f7ff] px-4 py-2'>
        <Text className='text-center text-[13px] font-semibold text-[#4338ca]'>Start from scratch →</Text>
      </View>
    </AnimatedPressable>
  );
}

function TemplatesPeekCard({ onPress }: { onPress: () => void }) {
  const pressScale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: pressScale.value }] }));
  const { triggerLightImpact, triggerSelection } = useHapticFeedback();

  return (
    <AnimatedPressable
      accessibilityHint='Preview expert-designed habit journeys'
      accessibilityLabel='Explore premium templates'
      accessibilityRole='button'
      entering={FadeInDown.delay(100).springify().damping(18)}
      className='rounded-[28px] border border-[#e0e7ff] bg-white p-5 text-center shadow-[0px_14px_32px_rgba(99,102,241,0.12)]'
      style={animatedStyle}
      onPress={() => {
        triggerSelection();
        onPress();
      }}
      onPressIn={() => {
        triggerLightImpact();
        pressScale.value = withSpring(0.97, { damping: 18, stiffness: 260 });
      }}
      onPressOut={() => {
        pressScale.value = withSpring(1, { damping: 18, stiffness: 260 });
      }}
    >
      <View className='gap-2 text-center'>
        <View className='flex-row items-center justify-center gap-2'>
          <Text className='text-[11px] font-semibold uppercase tracking-[3px] text-[#a855f7]'>Science-backed templates</Text>
          <View className='rounded-full bg-[#fbbf24] px-2 py-0.5'>
            <Text className='text-[9px] font-bold uppercase tracking-[1px] text-white'>Premium</Text>
          </View>
        </View>
        <Text className='text-[18px] font-semibold text-[#4338ca]'>Skip the guesswork</Text>
        <Text className='text-[13px] leading-[18px] text-[#4c1d95]'>Explore expert-designed habit journeys like 'Morning Momentum' and 'Focus Flow'—backed by behavioral science.</Text>
      </View>
      <View className='mt-3 rounded-full border border-[#dcdff5] bg-[#f6f7ff] px-4 py-2'>
        <Text className='text-[13px] font-semibold text-[#4338ca]'>Preview templates →</Text>
      </View>
    </AnimatedPressable>
  );
}
