import clsx from 'clsx';
import { Check, ChevronDown, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View, ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  FadeInDown,
  FadeOut,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
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
  'w-full rounded-2xl border border-stone-200 bg-white px-5 py-5';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Scroll hint component to indicate more content below the fold
function ScrollHint({ visible }: { visible: boolean }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Fade in
      opacity.value = withDelay(600, withTiming(1, { duration: 400 }));

      // Bounce animation
      translateY.value = withDelay(
        800,
        withRepeat(
          withSequence(
            withTiming(6, { duration: 600 }),
            withTiming(0, { duration: 600 })
          ),
          -1,
          true
        )
      );
    } else {
      opacity.value = withTiming(0, { duration: 200 });
    }

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
    };
  }, [visible, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeInDown.delay(800).springify()}
      exiting={FadeOut.duration(200)}
      className='items-center gap-1 pb-2 pt-4'
      style={animatedStyle}
    >
      <Text className='text-[12px] font-medium text-stone-400'>
        More options below
      </Text>
      <ChevronDown color='#94a3b8' size={18} strokeWidth={2} />
    </Animated.View>
  );
}

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
  const [showScrollHint, setShowScrollHint] = useState(true);
  const { triggerMediumImpact, triggerSuccess, triggerLightImpact } = useHapticFeedback();

  // Auto-dismiss scroll hint after 4 seconds
  useEffect(() => {
    if (!isLoading && showScrollHint) {
      const timer = setTimeout(() => {
        setShowScrollHint(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, showScrollHint]);

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

      {/* Scroll hint indicator - shows users there's more content below */}
      <ScrollHint visible={showScrollHint} />

      {openTemplatesScreen && <TemplatesPeekCard onPress={openTemplatesScreen} />}

      <CustomHabitCard onPress={openCreateHabitScreen} onNeedHelpQuiz={onNeedHelpQuiz} />

      {(onNeedHelpQuiz || onScheduleReminder) && (
        <CompactHelperRow onNeedHelpQuiz={onNeedHelpQuiz} onScheduleReminder={onScheduleReminder} />
      )}
    </View>
  );
}

// Floating particle component for visual delight
function FloatingParticle({ delay, emoji, duration = 3000 }: { delay: number; emoji: string; duration?: number }) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    // Fade in
    opacity.value = withDelay(delay, withTiming(0.6, { duration: 500 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 12 }));

    // Float animation
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-12, { duration: duration / 2 }),
          withTiming(0, { duration: duration / 2 })
        ),
        -1,
        true
      )
    );

    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(6, { duration: duration / 3 }),
          withTiming(-6, { duration: duration / 3 }),
          withTiming(0, { duration: duration / 3 })
        ),
        -1,
        true
      )
    );

    // Cleanup: cancel all animations on unmount or dependency change
    return () => {
      cancelAnimation(translateY);
      cancelAnimation(translateX);
      cancelAnimation(opacity);
      cancelAnimation(scale);
    };
  }, [delay, duration, translateY, translateX, opacity, scale]);

  const particleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={particleStyle} className='text-lg'>
      {emoji}
    </Animated.Text>
  );
}

// Welcome Hero Component - Enhanced with floating particles
function WelcomeHero({ greeting, period }: { greeting: string; period: string }) {
  const waveRotation = useSharedValue(0);
  const streakPulse = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    // Wave animation
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

    // Streak badge pulse
    streakPulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1200 }),
        withTiming(1, { duration: 1200 })
      ),
      -1,
      true
    );

    // Background glow pulse
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 2000 }),
        withTiming(0.3, { duration: 2000 })
      ),
      -1,
      true
    );

    // Cleanup: cancel all animations on unmount
    return () => {
      cancelAnimation(waveRotation);
      cancelAnimation(streakPulse);
      cancelAnimation(glowOpacity);
    };
  }, [waveRotation, streakPulse, glowOpacity]);

  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${waveRotation.value}deg` }],
  }));

  const streakStyle = useAnimatedStyle(() => ({
    transform: [{ scale: streakPulse.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const periodEmoji = period === 'morning' ? '🌅' : period === 'afternoon' ? '☀️' : '🌙';
  const particles = period === 'morning'
    ? ['✨', '🌟', '💫']
    : period === 'afternoon'
    ? ['⚡', '💪', '🎯']
    : ['🌙', '⭐', '💤'];

  return (
    <Animated.View
      entering={FadeInDown.delay(0).springify().damping(18)}
      className='relative items-center gap-2.5 overflow-hidden rounded-2xl border border-amber-200 px-5 py-5'
      style={{
        backgroundColor: '#fffbeb', // amber-50
        shadowColor: '#f59e0b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      {/* Animated background glow */}
      <Animated.View
        className='absolute inset-0 rounded-3xl'
        style={[
          glowStyle,
          {
            backgroundColor: '#fcd34d',
          },
        ]}
      />

      {/* Floating particles */}
      <View className='absolute inset-0' pointerEvents='none'>
        <View className='absolute left-4 top-4'>
          <FloatingParticle delay={0} duration={2500} emoji={particles[0]} />
        </View>
        <View className='absolute right-6 top-6'>
          <FloatingParticle delay={400} duration={3000} emoji={particles[1]} />
        </View>
        <View className='absolute bottom-4 left-8'>
          <FloatingParticle delay={800} duration={2800} emoji={particles[2]} />
        </View>
        <View className='absolute bottom-6 right-4'>
          <FloatingParticle delay={200} duration={3200} emoji='🌱' />
        </View>
      </View>

      {/* Main content */}
      <Animated.Text style={waveStyle} className='text-3xl'>
        👋
      </Animated.Text>
      <View className='items-center gap-1'>
        <Text className='text-[20px] font-bold text-stone-800'>
          {greeting}!
        </Text>
        <Text className='text-center text-[14px] leading-[20px] text-stone-600'>
          Your first streak starts now {periodEmoji}
        </Text>
      </View>
      <Animated.View
        className='flex-row items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5'
        style={[
          streakStyle,
          {
            shadowColor: '#f59e0b',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.18,
            shadowRadius: 6,
            elevation: 3,
          },
        ]}
      >
        <Text className='text-base'>🔥</Text>
        <Text className='text-[12px] font-semibold text-amber-700'>
          0 day streak • Let's change that
        </Text>
      </Animated.View>
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
    backgroundColor: interpolateColor(bgProgress.value, [0, 1, 2], ['#ffffff', '#fafaf9', '#dcfce7']),
    borderColor: interpolateColor(bgProgress.value, [0, 1, 2], ['#e7e5e4', '#d6d3d1', '#86efac']),
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
      entering={FadeInDown.delay(200 + index * 100)
        .springify()
        .damping(12)
        .mass(0.8)
        .stiffness(100)}
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
  timeContext,
}: {
  creatingHabit: string | null;
  successHabit: string | null;
  onQuickCreateHabit: (habitName: string) => Promise<void>;
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
      className={clsx(BASE_CARD_CLASS)}
      style={{
        shadowColor: '#78716c',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <View className='mb-1 gap-2'>
        <Text className='text-[18px] font-bold leading-[24px] text-stone-800'>
          Tap one you can do now
        </Text>
        <Text className='text-[14px] leading-[20px] text-stone-600'>
          Start small—you can always customize later.
        </Text>
        {!isShuffled && (
          <View className='mt-1 self-center rounded-full bg-amber-100/80 px-3 py-1.5'>
            <Text className='text-[12px] font-semibold text-amber-700'>{periodLabel}</Text>
          </View>
        )}
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
    backgroundColor: interpolateColor(bgProgress.value, [0, 1], ['#ffffff', '#fafaf9']),
  }));
  const { triggerLightImpact, triggerSelection } = useHapticFeedback();

  return (
    <AnimatedPressable
      accessibilityHint='Preview expert-designed habit journeys'
      accessibilityLabel='Import habits'
      accessibilityRole='button'
      entering={FadeInDown.delay(200).springify().damping(18)}
      className={clsx(BASE_CARD_CLASS, 'gap-4')}
      style={[
        animatedStyle,
        {
          shadowColor: '#78716c',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 3,
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
          <Text className='text-lg font-bold text-stone-800'>Skip the guesswork</Text>
        </View>
        <Text className='text-sm leading-5 text-stone-500'>
          Science-backed routines designed by habit researchers.
        </Text>
      </View>
      <View
        className='rounded-xl px-6 py-3.5'
        style={{
          backgroundColor: '#10b981', // emerald-500 - brand color
          shadowColor: '#10b981',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text className='text-center text-[15px] font-bold tracking-wide text-white'>Import habits →</Text>
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
