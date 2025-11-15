import clsx from 'clsx';
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
  onNeedHelpQuiz?: () => void;
  onScheduleReminder?: () => void;
}

const QUICK_START_HABITS = [
  { emoji: '💪', name: 'Morning Boost', fullName: '💪 Morning Boost', duration: '~5 min' },
  { emoji: '📚', name: 'Read 10 Minutes', fullName: '📚 Read 10 Minutes', duration: '~10 min' },
  { emoji: '🧘', name: 'Mindful Pause', fullName: '🧘 Mindful Pause', duration: '~3 min' },
  { emoji: '🍋', name: 'Hydrate Break', fullName: '🍋 Hydrate Break', duration: '~2 min' },
  { emoji: '📝', name: 'Daily Gratitude', fullName: '📝 Daily Gratitude', duration: '~5 min' },
  { emoji: '🚶', name: 'Walk & Stretch', fullName: '🚶 Walk & Stretch', duration: '~8 min' },
];

const TEMPLATE_PREVIEWS = [
  { title: 'Morning Momentum', tagline: 'Prime your AM energy' },
  { title: 'Focus Flow', tagline: 'Deep work ritual' },
];

const BASE_CARD_CLASS = 'w-full rounded-[22px] border border-[#e6e9f2] bg-white px-5 py-5 shadow-[0px_10px_24px_rgba(15,23,42,0.07)]';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HabitsEmptyState({
  isLoading,
  openCreateHabitScreen,
  openTemplatesScreen,
  onQuickCreateHabit,
  onNeedHelpQuiz,
  onScheduleReminder,
}: HabitsEmptyStateProps) {
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

      <CustomHabitCard onPress={openCreateHabitScreen} onNeedHelpQuiz={onNeedHelpQuiz} />

      {openTemplatesScreen && (
        <TemplatesPeekCard onPress={openTemplatesScreen} />
      )}

      <HelperRow onNeedHelpQuiz={onNeedHelpQuiz} onScheduleReminder={onScheduleReminder} />
    </View>
  );
}

interface QuickStartButtonProps {
  habit: { emoji: string; name: string; fullName: string; duration: string };
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
          <View className='items-center'>
            <Text className='text-center text-[12px] font-semibold text-[#263040]'>{habit.name}</Text>
            <Text className='text-[10px] font-medium text-[#7b8196]'>{habit.duration}</Text>
          </View>
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
  const [suggestions, setSuggestions] = useState(() => QUICK_START_HABITS.slice(0, 4));
  const { triggerSelection } = useHapticFeedback();

  const shuffleSuggestions = () => {
    triggerSelection();
    const shuffled = [...QUICK_START_HABITS].sort(() => Math.random() - 0.5);
    setSuggestions(shuffled.slice(0, 4));
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(20).springify().damping(18)}
      className={clsx(BASE_CARD_CLASS, 'border-[#f4d38c] bg-[#fffdf7]')}
    >
      <View className='gap-2 text-center'>
        <Text className='text-[18px] font-semibold text-[#0f172a]'>Start your first streak in seconds</Text>
        <Text className='text-[13px] leading-[18px] text-[#5c606f]'>Pick a habit you can try today—you can customize it anytime.</Text>
      </View>
      <View className='mt-3 flex-row flex-wrap justify-between gap-y-3'>
        {suggestions.map((habit) => (
          <QuickStartButton
            key={habit.fullName}
            habit={habit}
            isCreating={creatingHabit === habit.fullName}
            containerStyle={{ width: '48%' }}
            onPress={async () => onQuickCreateHabit(habit.fullName)}
          />
        ))}
      </View>
      <Pressable
        accessibilityLabel='Shuffle quick start habit suggestions'
        className='mt-3 self-center'
        onPress={shuffleSuggestions}
      >
        <Text className='text-[12px] font-semibold text-[#b35309]'>Shuffle suggestions ↻</Text>
      </Pressable>
    </Animated.View>
  );
}

function CustomHabitCard({ onPress, onNeedHelpQuiz }: { onPress: () => void; onNeedHelpQuiz?: () => void }) {
  const pressScale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: pressScale.value }] }));
  const { triggerSelection, triggerLightImpact } = useHapticFeedback();

  return (
    <AnimatedPressable
      accessibilityHint='Create a habit from scratch'
      accessibilityLabel='Create custom habit'
      accessibilityRole='button'
      entering={FadeInDown.delay(60).springify().damping(18)}
      className={clsx(BASE_CARD_CLASS, 'items-center text-center')}
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
          <Text className='text-[11px] font-semibold uppercase tracking-[3px] text-[#4c3bdc]'>Custom flow · takes ~30s</Text>
        </View>
        <Text className='text-[18px] font-semibold text-[#0f172a]'>Create your own habit</Text>
        <Text className='text-[13px] leading-[18px] text-[#5c606f]'>Set the name, schedule, and reminders—every detail is built around you.</Text>
      </View>
      <View className='mt-4 flex-row items-center justify-center'>
        <View className='h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6d28d9] to-[#4338ca] shadow-[0px_12px_24px_rgba(109,40,217,0.25)]'>
          <Plus color='#ffffff' size={28} strokeWidth={2.5} />
        </View>
      </View>
      <View className='mt-3 rounded-full border border-[#dcdff5] bg-[#f6f7ff] px-4 py-2'>
        <Text className='text-center text-[13px] font-semibold text-[#4338ca]'>Start from scratch →</Text>
      </View>
      {onNeedHelpQuiz && (
        <Pressable
          accessibilityLabel='Need inspiration? Take the quiz'
          className='mt-2'
          onPress={onNeedHelpQuiz}
        >
          <Text className='text-center text-[12px] font-semibold text-[#6366f1]'>Need inspiration? Take the 30-second quiz →</Text>
        </Pressable>
      )}
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
      className={clsx(BASE_CARD_CLASS, 'gap-3 text-center')}
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
        <View className='flex-row flex-wrap items-center justify-center gap-2'>
          <Text className='text-[11px] font-semibold uppercase tracking-[3px] text-[#a855f7]'>Science-backed templates</Text>
          <View className='rounded-full bg-[#fbbf24] px-2 py-0.5'>
            <Text className='text-[9px] font-bold uppercase tracking-[1px] text-white'>Premium · +96% completion</Text>
          </View>
        </View>
        <Text className='text-[18px] font-semibold text-[#4338ca]'>Skip the guesswork</Text>
        <Text className='text-[13px] leading-[18px] text-[#4c1d95]'>Explore guided journeys like “Morning Momentum” or “Focus Flow” with reminders and celebration moments built-in.</Text>
      </View>
      <View className='mt-3 gap-2'>
        {TEMPLATE_PREVIEWS.map((template) => (
          <View key={template.title} className='rounded-2xl border border-[#ece9ff] bg-[#f7f5ff] px-4 py-3 text-left'>
            <Text className='text-[12px] font-semibold text-[#4338ca]'>{template.title}</Text>
            <Text className='text-[11px] text-[#6b5aa6]'>{template.tagline}</Text>
          </View>
        ))}
      </View>
      <View className='mt-4 rounded-full border border-[#dcdff5] bg-[#f6f7ff] px-4 py-2'>
        <Text className='text-[13px] font-semibold text-[#4338ca]'>Preview templates →</Text>
      </View>
    </AnimatedPressable>
  );
}

function HelperRow({
  onNeedHelpQuiz,
  onScheduleReminder,
}: {
  onNeedHelpQuiz?: () => void;
  onScheduleReminder?: () => void;
}) {
  if (!onNeedHelpQuiz && !onScheduleReminder) {
    return null;
  }

  return (
    <View className={clsx(BASE_CARD_CLASS, 'items-center justify-center gap-3 border-dashed bg-[#fbfbff]')}>
      {onNeedHelpQuiz && (
        <Pressable
          accessibilityLabel='Get help choosing a habit'
          className='w-full rounded-full bg-[#eef2ff] px-5 py-2'
          onPress={onNeedHelpQuiz}
        >
          <Text className='text-center text-[13px] font-semibold text-[#4338ca]'>Need help choosing? Take the 30-second quiz →</Text>
        </Pressable>
      )}
      {onScheduleReminder && (
        <Pressable
          accessibilityHint='Schedules a reminder notification to revisit habit setup later'
          accessibilityLabel='Remind me later'
          className='w-full rounded-full border border-[#dcdff5] px-4 py-2'
          onPress={onScheduleReminder}
        >
          <Text className='text-center text-[12px] font-semibold text-[#4c1d95]'>Remind me later</Text>
        </Pressable>
      )}
    </View>
  );
}
