import clsx from 'clsx';
import { Plus } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
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

const BASE_CARD_CLASS = 'w-full rounded-[20px] border border-[#e6e9f2] bg-white px-4 py-4 shadow-[0px_8px_18px_rgba(15,23,42,0.06)]';

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
  const confettiRef = useRef<ConfettiCannon | null>(null);
  const { triggerSuccess, triggerLightImpact } = useHapticFeedback();

  if (isLoading) {
    return (
      <View className='items-center justify-center gap-3 py-20'>
        <ActivityIndicator color='#101727' size='small' />
        <Text className='text-sm font-medium text-[#475467]'>Loading your habits…</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 gap-3 bg-[#f8f9fc] px-4 py-3'>
      {onQuickCreateHabit && (
        <QuickWinCard
          confettiRef={confettiRef}
          creatingHabit={creatingHabit}
          onQuickCreateHabit={async (habitName) => {
            setCreatingHabit(habitName);
            triggerSuccess();
            triggerLightImpact();
            try {
              await onQuickCreateHabit(habitName);
              confettiRef.current?.start();
            } finally {
              setCreatingHabit(null);
            }
          }}
        />
      )}

      {openTemplatesScreen && (
        <TemplatesPeekCard onPress={openTemplatesScreen} />
      )}

      <CustomHabitCard onPress={openCreateHabitScreen} onNeedHelpQuiz={onNeedHelpQuiz} />

      {(onNeedHelpQuiz || onScheduleReminder) && (
        <CompactHelperRow onNeedHelpQuiz={onNeedHelpQuiz} onScheduleReminder={onScheduleReminder} />
      )}
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
      className='items-center gap-1.5 rounded-2xl border border-[#e3e7ef] bg-white px-3 py-3 shadow-sm'
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
  confettiRef,
}: {
  creatingHabit: string | null;
  onQuickCreateHabit: (habitName: string) => Promise<void>;
  confettiRef: React.MutableRefObject<ConfettiCannon | null>;
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
      <ConfettiCannon
        autoStart={false}
        count={25}
        fadeOut
        origin={{ x: 0, y: 0 }}
        explosionSpeed={250}
        fallSpeed={1800}
        ref={(instance) => {
          confettiRef.current = instance;
        }}
      />
      <View className='gap-2 text-center'>
        <Text className='text-[18px] font-semibold text-[#0f172a]'>Start your first streak in seconds</Text>
        <Text className='text-[13px] leading-[18px] text-[#5c606f]'>Pick a habit you can try today—you can customize it anytime.</Text>
      </View>
      <View className='mt-3 flex-row flex-wrap justify-between gap-y-2'>
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
        className='mt-2 self-center'
        onPress={shuffleSuggestions}
      >
        <Text className='text-[11px] font-semibold text-[#b35309]'>Shuffle ↻</Text>
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
      className={clsx(BASE_CARD_CLASS, 'flex-row items-center gap-3')}
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
      <View className='h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6d28d9] to-[#4338ca] shadow-[0px_8px_18px_rgba(109,40,217,0.2)]'>
        <Plus color='#ffffff' size={24} strokeWidth={2.2} />
      </View>
      <View className='flex-1 gap-1'>
        <Text className='text-[18px] font-semibold text-[#0f172a]'>Create your own habit</Text>
        <Text className='text-[13px] leading-[18px] text-[#5c606f]'>Set the name, schedule, and reminders to fit your day. Takes ~30s.</Text>
        <Text className='text-[13px] font-semibold text-[#4338ca]'>Start from scratch →</Text>
      </View>
      {onNeedHelpQuiz && (
        <Pressable accessibilityLabel='Need inspiration? Take the quiz' onPress={onNeedHelpQuiz}>
          <Text className='text-[11px] font-semibold text-[#6366f1]'>Quiz</Text>
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
      accessibilityLabel='Explore templates'
      accessibilityRole='button'
      entering={FadeInDown.delay(100).springify().damping(18)}
      className={clsx(BASE_CARD_CLASS, 'gap-2')}
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
      <View className='flex-row items-center justify-between'>
        <View className='flex-1'>
          <Text className='text-[11px] font-semibold uppercase tracking-[3px] text-[#a855f7]'>Science-backed templates</Text>
          <Text className='text-[18px] font-semibold text-[#4338ca]'>Skip the guesswork</Text>
          <Text className='text-[13px] leading-[18px] text-[#4c1d95]'>Morning Momentum, Focus Flow, and more curated journeys.</Text>
        </View>
        <View className='items-end gap-1'>
          {TEMPLATE_PREVIEWS.map((template) => (
            <Text key={template.title} className='text-[12px] font-semibold text-[#4338ca]'>• {template.title}</Text>
          ))}
        </View>
      </View>
      <View className='rounded-full border border-[#dcdff5] bg-[#f6f7ff] px-4 py-2'>
        <Text className='text-center text-[13px] font-semibold text-[#4338ca]'>Preview templates →</Text>
      </View>
    </AnimatedPressable>
  );
}

function CompactHelperRow({
  onNeedHelpQuiz,
  onScheduleReminder,
}: {
  onNeedHelpQuiz?: () => void;
  onScheduleReminder?: () => void;
}) {
  return (
    <View className='flex-row items-center justify-between rounded-[16px] border border-dashed border-[#dfe4fa] bg-white/80 px-3 py-2'>
      {onNeedHelpQuiz ? (
        <Pressable accessibilityLabel='Open habit quiz' onPress={onNeedHelpQuiz}>
          <Text className='text-[12px] font-semibold text-[#4338ca]'>Need help? Quiz →</Text>
        </Pressable>
      ) : (
        <View />
      )}
      {onScheduleReminder && (
        <Pressable
          accessibilityHint='Schedules a reminder notification to revisit habit setup later'
          accessibilityLabel='Remind me later'
          onPress={onScheduleReminder}
        >
          <Text className='text-[11px] font-semibold text-[#4c1d95]'>Remind me later</Text>
        </Pressable>
      )}
    </View>
  );
}
