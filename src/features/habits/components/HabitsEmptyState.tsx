import clsx from 'clsx';
import { Check, Plus } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View, ViewStyle } from 'react-native';
import Animated, {
  FadeInDown,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
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

// Time-of-day based habit suggestions
const MORNING_HABITS = [
  { emoji: '💪', name: 'Morning Boost', fullName: '💪 Morning Boost', duration: '~5 min', timeHint: 'Perfect for now' },
  { emoji: '🍋', name: 'Hydrate First', fullName: '🍋 Hydrate First', duration: '~2 min', timeHint: 'Start fresh' },
  { emoji: '🧘', name: 'Mindful Minute', fullName: '🧘 Mindful Minute', duration: '~3 min', timeHint: 'Set your intention' },
  { emoji: '📝', name: 'Morning Pages', fullName: '📝 Morning Pages', duration: '~10 min', timeHint: 'Clear your mind' },
];

const AFTERNOON_HABITS = [
  { emoji: '🚶', name: 'Walk Break', fullName: '🚶 Walk Break', duration: '~8 min', timeHint: 'Recharge now' },
  { emoji: '📚', name: 'Read 10 Min', fullName: '📚 Read 10 Min', duration: '~10 min', timeHint: 'Afternoon wisdom' },
  { emoji: '💧', name: 'Hydrate Check', fullName: '💧 Hydrate Check', duration: '~1 min', timeHint: 'Stay sharp' },
  { emoji: '🧘', name: 'Desk Stretch', fullName: '🧘 Desk Stretch', duration: '~5 min', timeHint: 'Release tension' },
];

const EVENING_HABITS = [
  { emoji: '📝', name: 'Daily Gratitude', fullName: '📝 Daily Gratitude', duration: '~5 min', timeHint: 'End on a high' },
  { emoji: '🧘', name: 'Wind Down', fullName: '🧘 Wind Down', duration: '~10 min', timeHint: 'Prepare for rest' },
  { emoji: '📵', name: 'Screen Break', fullName: '📵 Screen Break', duration: '~30 min', timeHint: 'Better sleep' },
  { emoji: '📚', name: 'Bedtime Read', fullName: '📚 Bedtime Read', duration: '~15 min', timeHint: 'Unwind gently' },
];

// Get habits based on current time of day
function getTimeBasedHabits() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { habits: MORNING_HABITS, greeting: 'Good morning', period: 'morning' };
  if (hour >= 12 && hour < 17) return { habits: AFTERNOON_HABITS, greeting: 'Good afternoon', period: 'afternoon' };
  return { habits: EVENING_HABITS, greeting: 'Good evening', period: 'evening' };
}

// Fallback for shuffle (all habits combined)
const ALL_HABITS = [...MORNING_HABITS, ...AFTERNOON_HABITS, ...EVENING_HABITS];

const TEMPLATE_PREVIEWS = [
  { title: 'Morning Momentum', tagline: 'Prime your AM energy' },
  { title: 'Focus Flow', tagline: 'Deep work ritual' },
];

// Design System Constants
const COLORS = {
  // Text
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#64748b',
    muted: '#94a3b8',
  },
  // Accents
  accent: {
    amber: '#d97706',
    amberLight: '#fef3c7',
    purple: '#7c3aed',
    purpleLight: '#ede9fe',
    indigo: '#4f46e5',
    indigoLight: '#e0e7ff',
  },
  // Surfaces
  surface: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    warm: '#fffbeb',
  },
  // Borders
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
  },
};

const BASE_CARD_CLASS =
  'w-full rounded-3xl border border-[#e0e7ff] bg-white px-5 py-5 shadow-[0px_16px_44px_rgba(15,23,42,0.08)]';

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
  const [successHabit, setSuccessHabit] = useState<string | null>(null);
  const confettiRef = useRef<ConfettiCannon | null>(null);
  const { triggerMediumImpact, triggerSuccess, triggerLightImpact } = useHapticFeedback();

  if (isLoading) {
    return (
      <View className='items-center justify-center gap-5 py-24'>
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className='h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100'
        >
          <Text className='text-3xl'>🌱</Text>
        </Animated.View>
        <View className='items-center gap-2'>
          <Animated.Text
            entering={FadeInDown.delay(200).springify()}
            className='text-[16px] font-semibold text-stone-700'
          >
            Preparing your habit garden
          </Animated.Text>
          <Animated.View
            entering={FadeInDown.delay(300).springify()}
            className='flex-row items-center gap-1'
          >
            <ActivityIndicator color='#d97706' size='small' />
            <Text className='text-[13px] font-medium text-stone-400 italic'>
              Good things take a moment...
            </Text>
          </Animated.View>
        </View>
      </View>
    );
  }

  const timeContext = getTimeBasedHabits();

  return (
    <View className='flex-1 gap-4 bg-transparent px-4 py-4'>
      {/* Welcome Hero */}
      <WelcomeHero greeting={timeContext.greeting} period={timeContext.period} />

      {onQuickCreateHabit && (
        <QuickWinCard
          confettiRef={confettiRef}
          creatingHabit={creatingHabit}
          successHabit={successHabit}
          timeContext={timeContext}
          onQuickCreateHabit={async (habitName) => {
            setCreatingHabit(habitName);
            triggerMediumImpact(); // Immediate tactile confirmation

            try {
              await onQuickCreateHabit(habitName);

              // Success celebration sequence
              setSuccessHabit(habitName);
              triggerSuccess();
              confettiRef.current?.start();

              // Delayed echo haptic for satisfaction
              setTimeout(() => {
                triggerLightImpact();
              }, 400);

              // Keep success state visible briefly
              setTimeout(() => {
                setSuccessHabit(null);
              }, 1500);
            } finally {
              setCreatingHabit(null);
            }
          }}
        />
      )}

      {openTemplatesScreen && <TemplatesPeekCard onPress={openTemplatesScreen} />}

      <CustomHabitCard onPress={openCreateHabitScreen} onNeedHelpQuiz={onNeedHelpQuiz} />

      {(onNeedHelpQuiz || onScheduleReminder) && (
        <CompactHelperRow onNeedHelpQuiz={onNeedHelpQuiz} onScheduleReminder={onScheduleReminder} />
      )}
    </View>
  );
}

// Welcome Hero Component
function WelcomeHero({ greeting, period }: { greeting: string; period: string }) {
  const waveRotation = useSharedValue(0);

  useEffect(() => {
    waveRotation.value = withRepeat(
      withSequence(
        withTiming(14, { duration: 300 }),
        withTiming(-8, { duration: 200 }),
        withTiming(14, { duration: 200 }),
        withTiming(-4, { duration: 200 }),
        withTiming(0, { duration: 300 }),
        withDelay(2000, withTiming(0, { duration: 0 }))
      ),
      -1,
      false
    );
  }, [waveRotation]);

  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${waveRotation.value}deg` }],
  }));

  const periodEmoji = period === 'morning' ? '🌅' : period === 'afternoon' ? '☀️' : '🌙';

  return (
    <Animated.View
      entering={FadeInDown.delay(0).springify().damping(18)}
      className='items-center gap-3 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/40 px-6 py-6'
    >
      <Animated.Text style={waveStyle} className='text-4xl'>
        👋
      </Animated.Text>
      <View className='items-center gap-1.5'>
        <Text className='text-[22px] font-bold text-stone-800'>
          {greeting}!
        </Text>
        <Text className='text-[15px] text-stone-600 text-center leading-[22px]'>
          Your first streak starts now {periodEmoji}
        </Text>
      </View>
      <View className='flex-row items-center gap-2 mt-1 rounded-full bg-white/60 px-4 py-2'>
        <Text className='text-lg'>🔥</Text>
        <Text className='text-[13px] font-semibold text-amber-700'>
          0 day streak • Let's change that
        </Text>
      </View>
    </Animated.View>
  );
}

interface QuickStartButtonProps {
  habit: { emoji: string; name: string; fullName: string; duration: string; timeHint?: string };
  isCreating: boolean;
  isSuccess: boolean;
  onPress: () => Promise<void>;
  containerStyle?: ViewStyle;
  index: number;
}

function QuickStartButton({
  habit,
  isCreating,
  isSuccess,
  onPress,
  containerStyle,
  index,
}: QuickStartButtonProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const bgProgress = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const { triggerLightImpact, triggerSelection } = useHapticFeedback();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    backgroundColor: interpolateColor(bgProgress.value, [0, 1, 2], ['#ffffff', '#f0f9ff', '#dcfce7']),
    borderColor: interpolateColor(bgProgress.value, [0, 1, 2], ['#e3e7ef', '#bfdbfe', '#86efac']),
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: isSuccess ? 0 : 1,
  }));

  // Success celebration effect
  useEffect(() => {
    if (isSuccess) {
      bgProgress.value = withSpring(2, { damping: 12 });
      checkScale.value = withSpring(1, { damping: 10, stiffness: 200 });

      // Victory bounce
      scale.value = withSequence(withSpring(1.12, { damping: 8 }), withSpring(1, { damping: 12 }));
    } else {
      bgProgress.value = withTiming(0, { duration: 300 });
      checkScale.value = withTiming(0, { duration: 200 });
    }
  }, [isSuccess, bgProgress, checkScale, scale]);

  const handlePress = async () => {
    triggerSelection();

    // Anticipation wiggle
    rotation.value = withSequence(
      withSpring(-3, { damping: 8, stiffness: 400 }),
      withSpring(3, { damping: 8, stiffness: 400 }),
      withSpring(0, { damping: 10, stiffness: 300 }),
    );

    await onPress();
  };

  return (
    <AnimatedPressable
      accessibilityLabel={`Add ${habit.name} habit`}
      accessibilityRole='button'
      className='items-center justify-center gap-2 rounded-2xl border px-3 py-4 shadow-sm'
      disabled={isCreating || isSuccess}
      entering={FadeInDown.delay(120 + index * 50)
        .springify()
        .damping(14)}
      style={[animatedStyle, containerStyle]}
      onPress={handlePress}
      onPressIn={() => {
        triggerLightImpact();
        scale.value = withSpring(0.92, { damping: 12, stiffness: 400 });
        bgProgress.value = withTiming(1, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 300 });
        if (!isCreating) {
          bgProgress.value = withTiming(0, { duration: 150 });
        }
      }}
    >
      {isSuccess ? (
        <Animated.View className='items-center justify-center' style={checkmarkStyle}>
          <View className='mb-1.5 h-9 w-9 items-center justify-center rounded-full bg-[#16a34a]'>
            <Check color='#ffffff' size={22} strokeWidth={2.8} />
          </View>
          <Text className='text-[12px] font-bold text-[#15803d]'>Added!</Text>
        </Animated.View>
      ) : isCreating ? (
        <View className='items-center justify-center gap-1.5'>
          <ActivityIndicator color='#6d28d9' size='small' />
          <Text className='text-[11px] font-semibold text-[#6d28d9]'>Creating...</Text>
        </View>
      ) : (
        <Animated.View className='items-center gap-2' style={contentStyle}>
          <Text className='text-[28px]'>{habit.emoji}</Text>
          <View className='items-center gap-0.5'>
            <Text className='text-center text-[13px] font-semibold text-stone-800'>{habit.name}</Text>
            <Text className='text-[11px] font-medium text-stone-500'>{habit.duration}</Text>
            {habit.timeHint && (
              <Text className='text-[10px] font-medium text-amber-600 mt-0.5'>{habit.timeHint}</Text>
            )}
          </View>
        </Animated.View>
      )}
    </AnimatedPressable>
  );
}

function QuickWinCard({
  creatingHabit,
  successHabit,
  onQuickCreateHabit,
  confettiRef,
  timeContext,
}: {
  creatingHabit: string | null;
  successHabit: string | null;
  onQuickCreateHabit: (habitName: string) => Promise<void>;
  confettiRef: React.MutableRefObject<ConfettiCannon | null>;
  timeContext: { habits: typeof MORNING_HABITS; greeting: string; period: string };
}) {
  const [suggestions, setSuggestions] = useState(() => timeContext.habits);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const shuffleScale = useSharedValue(1);
  const { triggerSelection } = useHapticFeedback();

  const shuffleButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shuffleScale.value }],
  }));

  const shuffleSuggestions = () => {
    triggerSelection();

    // Quick press feedback
    shuffleScale.value = withSequence(withTiming(0.85, { duration: 100 }), withSpring(1, { damping: 12 }));

    // Shuffle from all habits when user wants variety
    const shuffled = [...ALL_HABITS].sort(() => Math.random() - 0.5);
    setSuggestions(shuffled.slice(0, 4));
    setShuffleCount((c) => c + 1);
    setIsShuffled(true);
  };

  const periodLabel = timeContext.period === 'morning'
    ? '🌅 Morning picks'
    : timeContext.period === 'afternoon'
    ? '☀️ Afternoon picks'
    : '🌙 Evening picks';

  return (
    <Animated.View
      entering={FadeInDown.delay(80).springify().damping(18)}
      className={clsx(BASE_CARD_CLASS, 'border-amber-200/50 bg-gradient-to-br from-amber-50/80 to-orange-50/40')}
    >
      <ConfettiCannon
        autoStart={false}
        count={35}
        fadeOut
        origin={{ x: 180, y: 120 }}
        explosionSpeed={280}
        fallSpeed={2200}
        ref={(instance) => {
          confettiRef.current = instance;
        }}
      />
      <View className='mb-1 gap-2'>
        <View className='flex-row items-center justify-between'>
          <Text className='text-[18px] font-bold leading-[24px] text-stone-800'>
            Tap one you can do now
          </Text>
          {!isShuffled && (
            <View className='rounded-full bg-amber-100/80 px-2.5 py-1'>
              <Text className='text-[11px] font-semibold text-amber-700'>{periodLabel}</Text>
            </View>
          )}
        </View>
        <Text className='text-[14px] leading-[20px] text-stone-600'>
          Start small—you can always customize later.
        </Text>
      </View>
      <View className='mt-4 flex-row flex-wrap justify-between gap-y-3'>
        {suggestions.map((habit, index) => (
          <QuickStartButton
            key={`${shuffleCount}-${index}`}
            habit={habit}
            index={shuffleCount === 0 ? index : 0}
            isCreating={creatingHabit === habit.fullName}
            isSuccess={successHabit === habit.fullName}
            containerStyle={{ width: '48%' }}
            onPress={async () => onQuickCreateHabit(habit.fullName)}
          />
        ))}
      </View>
      <Pressable
        accessibilityLabel='Show different habit suggestions'
        className='mt-3 self-center rounded-full px-4 py-1.5 active:bg-amber-100/60'
        onPress={shuffleSuggestions}
      >
        <Animated.Text className='text-[12px] font-semibold text-amber-700' style={shuffleButtonStyle}>
          Show me different ideas ↻
        </Animated.Text>
      </Pressable>
    </Animated.View>
  );
}

function CustomHabitCard({ onPress, onNeedHelpQuiz }: { onPress: () => void; onNeedHelpQuiz?: () => void }) {
  const pressScale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const iconGlow = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: pressScale.value }] }));
  const { triggerSelection, triggerLightImpact } = useHapticFeedback();

  // Subtle breathing animation to draw attention
  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(withTiming(1.08, { duration: 1800 }), withTiming(1, { duration: 1800 })),
      -1,
      true,
    );

    iconGlow.value = withRepeat(
      withSequence(withTiming(1, { duration: 1800 }), withTiming(0, { duration: 1800 })),
      -1,
      true,
    );
  }, [pulseScale, iconGlow]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: 0.2 + iconGlow.value * 0.15,
    shadowRadius: 8 + iconGlow.value * 4,
  }));

  return (
    <AnimatedPressable
      accessibilityHint='Create a habit from scratch'
      accessibilityLabel='Create custom habit'
      accessibilityRole='button'
      entering={FadeInDown.delay(280).springify().damping(18)}
      className={clsx(BASE_CARD_CLASS, 'flex-row items-center gap-4 border-violet-200 bg-white')}
      style={[
        animatedStyle,
        {
          shadowColor: '#7c3aed',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
          elevation: 4,
        }
      ]}
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
      <Animated.View
        className='h-14 w-14 items-center justify-center rounded-2xl'
        style={[
          pulseStyle,
          glowStyle,
          {
            backgroundColor: '#7c3aed',
            shadowColor: '#7c3aed',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
          }
        ]}
      >
        <Plus color='#ffffff' size={28} strokeWidth={2.8} />
      </Animated.View>
      <View className='flex-1 gap-1.5'>
        <Text className='text-[18px] font-bold text-stone-800'>Build something just for you</Text>
        <Text className='text-[14px] leading-[20px] text-stone-600'>
          Name it, schedule it, make it yours.
        </Text>
        <View className='mt-0.5 flex-row items-center gap-2'>
          <Text className='text-[13px] font-semibold text-violet-600'>Start from scratch →</Text>
          <View className='rounded-full bg-violet-100 px-2 py-0.5'>
            <Text className='text-[10px] font-semibold text-violet-600'>~30s</Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

function TemplatesPeekCard({ onPress }: { onPress: () => void }) {
  const pressScale = useSharedValue(1);
  const bgProgress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
    backgroundColor: interpolateColor(bgProgress.value, [0, 1], ['#ffffff', '#f5f3ff']),
  }));
  const { triggerLightImpact, triggerSelection } = useHapticFeedback();

  return (
    <AnimatedPressable
      accessibilityHint='Preview expert-designed habit journeys'
      accessibilityLabel='Explore templates'
      accessibilityRole='button'
      entering={FadeInDown.delay(200).springify().damping(18)}
      className={clsx(BASE_CARD_CLASS, 'gap-4 border-indigo-200')}
      style={[
        animatedStyle,
        {
          shadowColor: '#4f46e5',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 4,
        }
      ]}
      onPress={() => {
        triggerSelection();
        onPress();
      }}
      onPressIn={() => {
        triggerLightImpact();
        pressScale.value = withSpring(0.97, { damping: 18, stiffness: 260 });
        bgProgress.value = withTiming(1, { duration: 100 });
      }}
      onPressOut={() => {
        pressScale.value = withSpring(1, { damping: 18, stiffness: 260 });
        bgProgress.value = withTiming(0, { duration: 150 });
      }}
    >
      <View className='gap-1.5'>
        <View className='flex-row items-center gap-2'>
          <Text className='text-lg'>🧪</Text>
          <Text className='text-[18px] font-bold text-indigo-700'>Skip the guesswork</Text>
        </View>
        <Text className='text-[14px] leading-[20px] text-stone-600'>
          Science-backed routines designed by habit researchers.
        </Text>
      </View>
      <View
        className='rounded-full px-6 py-3.5'
        style={{
          backgroundColor: '#4f46e5',
          shadowColor: '#4f46e5',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <Text className='text-center text-[15px] font-bold tracking-wide text-white'>Explore templates →</Text>
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
  const { triggerSelection } = useHapticFeedback();

  return (
    <Animated.View
      entering={FadeInDown.delay(400).springify().damping(18)}
      className='flex-row items-center justify-center gap-6 rounded-3xl bg-stone-100/60 px-4 py-3'
    >
      {onNeedHelpQuiz && (
        <Pressable
          accessibilityLabel='Open habit quiz'
          className='rounded-lg px-3 py-1.5 active:bg-stone-200/60'
          onPress={() => {
            triggerSelection();
            onNeedHelpQuiz();
          }}
        >
          <Text className='text-[13px] font-semibold text-stone-600'>Need help? Take quiz →</Text>
        </Pressable>
      )}
      {onScheduleReminder && (
        <Pressable
          accessibilityHint='Schedules a reminder notification to revisit habit setup later'
          accessibilityLabel='Remind me later'
          className='rounded-lg px-3 py-1.5 active:bg-stone-200/60'
          onPress={() => {
            triggerSelection();
            onScheduleReminder();
          }}
        >
          <Text className='text-[13px] font-medium text-stone-500'>Remind me later</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}
