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
      <View className='items-center justify-center gap-4 py-24'>
        <ActivityIndicator color='#64748b' size='small' />
        <Text className='text-[15px] font-medium text-[#64748b]'>Loading your habits…</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 gap-4 bg-[#f8fafc] px-4 py-4'>
      {onQuickCreateHabit && (
        <QuickWinCard
          confettiRef={confettiRef}
          creatingHabit={creatingHabit}
          successHabit={successHabit}
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

interface QuickStartButtonProps {
  habit: { emoji: string; name: string; fullName: string; duration: string };
  isCreating: boolean;
  isSuccess: boolean;
  onPress: () => Promise<void>;
  containerStyle?: ViewStyle;
  index: number;
  isShuffling?: boolean;
  shuffleCount: number;
}

function QuickStartButton({
  habit,
  isCreating,
  isSuccess,
  onPress,
  containerStyle,
  index,
  isShuffling = false,
  shuffleCount,
}: QuickStartButtonProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const bgProgress = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const { triggerLightImpact, triggerSelection } = useHapticFeedback();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
      { translateY: translateY.value }
    ],
    backgroundColor: interpolateColor(bgProgress.value, [0, 1, 2], ['#ffffff', '#f0f9ff', '#dcfce7']),
    borderColor: interpolateColor(bgProgress.value, [0, 1, 2], ['#e3e7ef', '#bfdbfe', '#86efac']),
    opacity: opacity.value,
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: isSuccess ? 0 : 1,
  }));

  // Shuffle animation effect
  useEffect(() => {
    if (isShuffling) {
      // Exit animation: fade out, rotate slightly, and slide down
      opacity.value = withTiming(0, { duration: 250 });
      rotation.value = withTiming(-15, { duration: 250 });
      translateY.value = withTiming(20, { duration: 250 });
      scale.value = withTiming(0.9, { duration: 250 });
    }
  }, [isShuffling, opacity, rotation, translateY, scale]);

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
      entering={FadeInDown.delay(shuffleCount === 0 ? 120 + index * 50 : 450 + index * 80)
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
            <Text className='text-center text-[13px] font-semibold text-[#111827]'>{habit.name}</Text>
            <Text className='text-[11px] font-medium text-[#64748b]'>{habit.duration}</Text>
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
}: {
  creatingHabit: string | null;
  successHabit: string | null;
  onQuickCreateHabit: (habitName: string) => Promise<void>;
  confettiRef: React.MutableRefObject<ConfettiCannon | null>;
}) {
  const [suggestions, setSuggestions] = useState(() => QUICK_START_HABITS.slice(0, 4));
  const [shuffleCount, setShuffleCount] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const shuffleScale = useSharedValue(1);
  const shuffleRotation = useSharedValue(0);
  const shuffleOpacity = useSharedValue(1);
  const { triggerSelection } = useHapticFeedback();

  const shuffleButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: shuffleScale.value },
      { rotate: `${shuffleRotation.value}deg` }
    ],
    opacity: shuffleOpacity.value,
  }));

  const shuffleSuggestions = () => {
    if (isShuffling) return;

    triggerSelection();
    setIsShuffling(true);

    // Enhanced shuffle animation sequence
    shuffleScale.value = withSequence(
      withTiming(0.8, { duration: 120 }),
      withSpring(1.2, { damping: 8, stiffness: 300 }),
      withTiming(1, { duration: 200 })
    );

    shuffleRotation.value = withSequence(
      withTiming(180, { duration: 300 }),
      withTiming(360, { duration: 300 })
    );

    shuffleOpacity.value = withSequence(
      withTiming(0.7, { duration: 150 }),
      withTiming(1, { duration: 300 })
    );

    // Delay the actual shuffle to sync with animation
    setTimeout(() => {
      const shuffled = [...QUICK_START_HABITS].sort(() => Math.random() - 0.5);
      setSuggestions(shuffled.slice(0, 4));
      setShuffleCount((c) => c + 1);
      setIsShuffling(false);
    }, 400);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(20).springify().damping(18)}
      className={clsx(BASE_CARD_CLASS, 'border-[#fcd34d]/40 bg-[#fffbeb]')}
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
        <Text className='text-[20px] font-bold leading-[26px] text-[#0f172a]'>
          Start your first streak in seconds
        </Text>
        <Text className='text-[14px] leading-[20px] text-[#475569]'>
          Pick a habit you can try today—you can customize it anytime.
        </Text>
      </View>
      <View className='mt-4 flex-row flex-wrap justify-between gap-y-3'>
        {suggestions.map((habit, index) => (
          <QuickStartButton
            key={`${shuffleCount}-${index}`}
            habit={habit}
            index={index}
            isCreating={creatingHabit === habit.fullName}
            isSuccess={successHabit === habit.fullName}
            isShuffling={isShuffling}
            shuffleCount={shuffleCount}
            containerStyle={{ width: '48%' }}
            onPress={async () => onQuickCreateHabit(habit.fullName)}
          />
        ))}
      </View>
      <Pressable
        accessibilityLabel='Shuffle quick start habit suggestions'
        className={clsx(
          'mt-3 self-center rounded-full px-4 py-1.5 active:bg-[#fef3c7]',
          isShuffling && 'opacity-50'
        )}
        disabled={isShuffling}
        onPress={shuffleSuggestions}
      >
        <Animated.Text className='text-[12px] font-semibold text-[#d97706]' style={shuffleButtonStyle}>
          {isShuffling ? 'Shuffling...' : 'Shuffle suggestions ↻'}
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
      className={clsx(BASE_CARD_CLASS, 'flex-row items-center gap-4')}
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
      <Animated.View
        className='h-14 w-14 items-center justify-center rounded-2xl bg-[#7c3aed]'
        style={[pulseStyle, glowStyle, { shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 4 } }]}
      >
        <Plus color='#ffffff' size={26} strokeWidth={2.4} />
      </Animated.View>
      <View className='flex-1 gap-1.5'>
        <Text className='text-[18px] font-bold text-[#111827]'>Create your own habit</Text>
        <Text className='text-[14px] leading-[20px] text-[#4b5563]'>
          Set the name, schedule, and reminders to fit your day.
        </Text>
        <View className='mt-0.5 flex-row items-center gap-2'>
          <Text className='text-[13px] font-semibold text-[#6d28d9]'>Start from scratch →</Text>
          <View className='rounded-full bg-[#f3e8ff] px-2 py-0.5'>
            <Text className='text-[10px] font-semibold text-[#6d28d9]'>~30s</Text>
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
    backgroundColor: interpolateColor(bgProgress.value, [0, 1], ['#ffffff', '#faf5ff']),
  }));
  const { triggerLightImpact, triggerSelection } = useHapticFeedback();

  return (
    <AnimatedPressable
      accessibilityHint='Preview expert-designed habit journeys'
      accessibilityLabel='Explore templates'
      accessibilityRole='button'
      entering={FadeInDown.delay(340).springify().damping(18)}
      className={clsx(BASE_CARD_CLASS, 'gap-4')}
      style={animatedStyle}
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
        <Text className='text-[18px] font-bold text-[#4f46e5]'>Skip the guesswork</Text>
        <Text className='text-[14px] leading-[20px] text-[#6366f1]'>
          Science-backed routines designed by habit experts.
        </Text>
      </View>
      <View className='rounded-full bg-[#6d28d9] px-5 py-3'>
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
      className='flex-row items-center justify-center gap-6 rounded-3xl bg-[#f8fafc] px-4 py-3'
    >
      {onNeedHelpQuiz && (
        <Pressable
          accessibilityLabel='Open habit quiz'
          className='rounded-lg px-3 py-1.5 active:bg-[#e2e8f0]'
          onPress={() => {
            triggerSelection();
            onNeedHelpQuiz();
          }}
        >
          <Text className='text-[13px] font-semibold text-[#475569]'>Need help? Take quiz →</Text>
        </Pressable>
      )}
      {onScheduleReminder && (
        <Pressable
          accessibilityHint='Schedules a reminder notification to revisit habit setup later'
          accessibilityLabel='Remind me later'
          className='rounded-lg px-3 py-1.5 active:bg-[#e2e8f0]'
          onPress={() => {
            triggerSelection();
            onScheduleReminder();
          }}
        >
          <Text className='text-[13px] font-medium text-[#64748b]'>Remind me later</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}
