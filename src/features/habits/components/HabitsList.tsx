import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

import { HabitsEmptyState } from './HabitsEmptyState';
import type { HabitsListState } from '../hooks/useHabitsApp';
import { useHabitRenderItem } from '../hooks/useHabitRenderItem';
import { HabitsModalsState } from '../hooks/types';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import { HabitsHeader } from './HabitsHeader';
import { CalendarTimeline, type DayCompletionStatus } from '../../../components/CalendarTimeline';
import { WeeklySummaryCard } from '../../../components/WeeklySummaryCard';

const PREMIUM_BENEFITS = [
  {
    description: 'Expand beyond the three core routines and organize every area of life.',
    title: 'Unlimited habits',
  },
  {
    description: 'Flexible reminder schedules keep momentum without overwhelming you.',
    title: 'Smart reminders',
  },
  {
    description: 'Detailed insights reveal streak trends and habit pairings that stick.',
    title: 'Deep insights',
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SOCIAL_PROOF = {
  attribution: 'Maya - 42-day streak',
  quote:
    'Upgrading unlocked the structure I needed. I finally track every routine and stay consistent.',
};

interface MonetizationHeroProps {
  freeHabitLimit: number;
  habitSlotsUsed: number;
  hasReachedHabitLimit: boolean;
  onUpgradePress: () => void;
  reduceMotion?: boolean;
}

function MonetizationHero({
  freeHabitLimit,
  habitSlotsUsed,
  hasReachedHabitLimit,
  onUpgradePress,
  reduceMotion = false,
}: MonetizationHeroProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const ctaPulse = useRef(new Animated.Value(1)).current;
  const shimmer = useRef(new Animated.Value(0.4)).current;
  const [trackWidth, setTrackWidth] = useState(0);

  const usageRatio = useMemo(() => {
    if (freeHabitLimit === 0) {
      return 0;
    }
    return Math.min(habitSlotsUsed / freeHabitLimit, 1);
  }, [freeHabitLimit, habitSlotsUsed]);

  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(trackWidth * usageRatio);
      return;
    }
    const handle = Animated.timing(progress, {
      duration: 420,
      easing: Easing.out(Easing.cubic),
      toValue: trackWidth * usageRatio,
      useNativeDriver: false,
    });
    handle.start();
    return () => {
      handle.stop();
    };
  }, [progress, trackWidth, usageRatio, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !hasReachedHabitLimit) {
      ctaPulse.stopAnimation();
      ctaPulse.setValue(1);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ctaPulse, {
          duration: 720,
          easing: Easing.inOut(Easing.ease),
          toValue: 1.04,
          useNativeDriver: true,
        }),
        Animated.timing(ctaPulse, {
          duration: 720,
          easing: Easing.inOut(Easing.ease),
          toValue: 1,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [ctaPulse, hasReachedHabitLimit, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      shimmer.setValue(1);
      return;
    }
    const wave = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          duration: 960,
          easing: Easing.inOut(Easing.ease),
          toValue: 0.9,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          duration: 960,
          easing: Easing.inOut(Easing.ease),
          toValue: 0.4,
          useNativeDriver: true,
        }),
      ])
    );
    wave.start();
    return () => wave.stop();
  }, [shimmer, reduceMotion]);

  const handleTrackLayout = useCallback((event: { nativeEvent: { layout: { width: number } } }) => {
    setTrackWidth(event.nativeEvent.layout.width);
  }, []);

  return (
    <View
      className='overflow-hidden rounded-3xl p-6'
      style={{ backgroundColor: '#1c1917', shadowColor: '#78350f', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.18, shadowRadius: 28, elevation: 12 }}
    >
      <View className='gap-2'>
        <Text className='text-[11px] font-bold uppercase tracking-[4px] text-[#a5b4fc]'>
          Level up
        </Text>
        <Text className='text-[26px] font-bold leading-[32px] tracking-tight text-white'>
          Ready to build more?
        </Text>
        <Text className='text-[15px] font-normal leading-[22px] text-[#cbd5f5]'>
          Track unlimited habits, get smart reminders, and unlock insights to guide your growth.
        </Text>
      </View>

      <View className='flex-row items-center gap-3'>
        <AnimatedPressable
          accessibilityLabel='Upgrade to premium for unlimited habits'
          accessibilityRole='button'
          className='flex-1 items-center rounded-full bg-[#6d28d9] px-5 py-3'
          onPress={onUpgradePress}
          style={{
            transform: [{ scale: ctaPulse }],
            shadowColor: '#312e81',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.32,
            shadowRadius: 16,
            elevation: 6,
          }}
        >
          <Text className='text-[15px] font-bold leading-[20px] tracking-wide text-white'>
            Go Premium
          </Text>
        </AnimatedPressable>
        <View className='flex-1 rounded-full border border-white/22 px-4 py-3'>
          <Animated.Text
            className='text-center text-[13px] font-semibold text-[#cbd5f5]'
            style={{ opacity: shimmer }}
          >
            Keep 3 habits free
          </Animated.Text>
        </View>
      </View>

      <View className='gap-2 pt-2'>
        <View className='flex-row items-center justify-between'>
          <Text className='text-[11px] font-bold uppercase tracking-[1px] text-[#94a3b8]'>
            Habit slots used
          </Text>
          <Text className='text-[13px] font-bold tabular-nums text-white'>
            {habitSlotsUsed}/{freeHabitLimit}
          </Text>
        </View>

        <View
          className='h-2 w-full overflow-hidden rounded-full bg-white/12'
          onLayout={handleTrackLayout}
        >
          <Animated.View
            className='h-2 rounded-full bg-[#fbbf24]'
            style={{ width: progress, maxWidth: trackWidth }}
          />
        </View>

        <Text className='text-[12px] font-medium text-[#fbbf24]'>
          {hasReachedHabitLimit
            ? 'You\'re making great progress! Upgrade to track every area of your life.'
            : `${freeHabitLimit - habitSlotsUsed} free ${freeHabitLimit - habitSlotsUsed === 1 ? 'slot' : 'slots'} remaining. Premium unlocks unlimited habits.`}
        </Text>
      </View>
    </View>
  );
}

function PremiumBenefitsRow() {
  return (
    <View className='gap-4 rounded-3xl border border-amber-100/60 bg-white/90 p-5 shadow-[0px_16px_44px_rgba(120,90,50,0.06)]'>
      <Text className='text-[11px] font-bold uppercase tracking-[4px] text-amber-700'>
        Why members upgrade
      </Text>
      <View className='gap-3'>
        {PREMIUM_BENEFITS.map((benefit) => (
          <View className='gap-1' key={benefit.title}>
            <Text className='text-[14px] font-semibold text-stone-800'>
              {benefit.title}
            </Text>
            <Text className='text-[13px] leading-[18px] text-stone-600'>
              {benefit.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function SocialProofCard() {
  return (
    <View className='gap-3 rounded-3xl border border-stone-200 bg-stone-50/80 p-5'>
      <Text className='text-[11px] font-bold uppercase tracking-[4px] text-stone-700'>
        Proven momentum
      </Text>
      <Text className='text-[14px] font-normal leading-[22px] text-stone-800'>
        "{SOCIAL_PROOF.quote}"
      </Text>
      <Text className='text-[13px] font-semibold text-stone-500'>
        {SOCIAL_PROOF.attribution}
      </Text>
    </View>
  );
}

interface LockedHabitCardProps {
  onUpgradePress: () => void;
  reduceMotion?: boolean;
}

function LockedHabitCard({ onUpgradePress, reduceMotion = false }: LockedHabitCardProps) {
  const scale = useRef(new Animated.Value(0.94)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) {
      scale.setValue(1);
      opacity.setValue(1);
      return;
    }
    Animated.parallel([
      Animated.spring(scale, {
        damping: 12,
        stiffness: 140,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        duration: 260,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale, reduceMotion]);

  return (
    <Animated.View
      className='gap-4 rounded-3xl border border-dashed border-violet-200 bg-gradient-to-b from-violet-50/80 to-amber-50/40 p-5'
      style={{ opacity, transform: [{ scale }] }}
    >
      <View className='items-center gap-2'>
        <Text className='text-[24px]'>✨</Text>
        <View className='gap-1'>
          <Text className='text-center text-[16px] font-semibold text-stone-800'>
            Want to add more habits?
          </Text>
          <Text className='text-center text-[13px] leading-[18px] text-stone-600'>
            Track unlimited habits, get smart reminders, and unlock deeper insights to build stronger routines.
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityLabel='Upgrade to unlock unlimited habits'
        accessibilityRole='button'
        className='items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 shadow-[0px_8px_16px_rgba(109,40,217,0.2)]'
        onPress={onUpgradePress}
      >
        <Text className='text-[14px] font-semibold text-white'>✨ Upgrade to Premium</Text>
      </Pressable>
    </Animated.View>
  );
}

interface UpgradePromptProps {
  onClose: () => void;
  onUpgradePress: () => void;
  visible: boolean;
}

function UpgradePrompt({ onClose, onUpgradePress, visible }: UpgradePromptProps) {
  if (!visible) {
    return null;
  }

  return (
    <View className='absolute inset-0 z-20 items-center justify-end bg-stone-900/50'>
      <Pressable
        accessibilityLabel='Close upgrade prompt'
        accessibilityRole='button'
        className='absolute inset-0'
        onPress={onClose}
      />
      <View className='w-full rounded-t-3xl bg-gradient-to-b from-white to-amber-50/30 px-6 py-8'>
        <View className='gap-4'>
          <View className='items-center pb-2'>
            <Text className='text-[32px]'>🚀</Text>
          </View>
          <Text className='text-center text-[20px] font-bold text-stone-900'>
            You're on a roll! Ready for more?
          </Text>
          <Text className='text-center text-[15px] leading-[22px] text-stone-600'>
            Track unlimited habits across all areas of your life. Premium members build stronger routines and stay consistent 2× longer.
          </Text>
          <Pressable
            accessibilityLabel='Upgrade to premium'
            accessibilityRole='button'
            className='items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 shadow-[0px_8px_16px_rgba(109,40,217,0.25)]'
            onPress={onUpgradePress}
          >
            <Text className='text-[15px] font-semibold text-white'>✨ Unlock unlimited habits</Text>
          </Pressable>
          <Pressable
            accessibilityLabel='Continue with free plan'
            accessibilityRole='button'
            className='items-center rounded-full border-2 border-stone-200 bg-white/80 px-5 py-3'
            onPress={onClose}
          >
            <Text className='text-[14px] font-semibold text-stone-500'>Keep 3 habits free</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

interface HabitsListProps {
  list: HabitsListState;
  modals: HabitsModalsState;
  canNavigateForward: boolean;
  onCreateHabitRequest: () => void;
  onUpgradeConfirm: () => void;
  onUpgradeDismiss: () => void;
  onUpgradeIntent: () => void;
  upgradePromptVisible: boolean;
  weekDates: string[];
  onNextWeek: () => void;
  onPreviousWeek: () => void;
}

export function HabitsList({
  list,
  modals,
  canNavigateForward,
  onCreateHabitRequest,
  onUpgradeConfirm,
  onUpgradeDismiss,
  onUpgradeIntent,
  upgradePromptVisible,
  weekDates,
  onNextWeek,
  onPreviousWeek,
}: HabitsListProps) {
  const {
    celebrationsEnabled,
    freeHabitLimit,
    habits,
    habitCompletionIcon,
    isHabitsLoading,
    hasReachedHabitLimit,
    weekDateStrings,
    showHabitStrengthPercentage,
    showWeekCompletionBar,
    contentPadding,
    handleDragEnd,
    handleArchive,
    handleHabitPress,
    getHabitStatus,
    getStreak,
    toggleHabit,
    notifyWeekCompletion,
    reduceMotionPreference,
    habitSlotsUsed,
    isPremiumUser,
  } = list;

  const { openSettings, openTemplatesScreen, openQuickActions } = modals;

  // Quick-create habit mutation for instant habit creation
  const createHabit = useMutation(api.habits.create);
  const [justCreatedHabitId, setJustCreatedHabitId] = useState<Id<'habits'> | null>(null);

  const handleQuickCreateHabit = useCallback(
    async (habitName: string) => {
      // Check if user has reached habit limit (free users only)
      if (!isPremiumUser && hasReachedHabitLimit) {
        onCreateHabitRequest(); // Trigger paywall
        return;
      }

      try {
        const newHabitId = (await createHabit({
          name: habitName,
          notes: '',
          remindersEnabled: false,
        })) as Id<'habits'>;
        if (newHabitId) {
          setJustCreatedHabitId(newHabitId);
        }
      } catch (error) {
        console.error('Failed to create habit:', error);
      }
    },
    [createHabit, hasReachedHabitLimit, isPremiumUser, onCreateHabitRequest]
  );

  useEffect(() => {
    if (!justCreatedHabitId) {
      return;
    }
    const timeout = setTimeout(() => setJustCreatedHabitId(null), 2000);
    return () => clearTimeout(timeout);
  }, [justCreatedHabitId]);

  const renderItem = useHabitRenderItem({
    celebrationsEnabled,
    getHabitStatus,
    getStreak,
    handleArchive,
    handleHabitPress,
    handleMorePress: openQuickActions,
    habitCompletionIcon,
    notifyWeekCompletion,
    reduceMotionPreference,
    weekDateStrings,
    showHabitStrengthPercentage,
    toggleHabit,
    highlightHabitId: justCreatedHabitId,
  });

  const { triggerSelection } = useHapticFeedback({
    isEnabled: celebrationsEnabled,
    preference: reduceMotionPreference,
  });

  const handleAddHabitPress = useCallback(() => {
    onCreateHabitRequest();
  }, [onCreateHabitRequest]);

  const handleDragBegin = useCallback(() => {
    triggerSelection();
  }, [triggerSelection]);

  const keyExtractor = useCallback(
    (habit: (typeof habits)[number], index: number) =>
      habit._id ?? `habit-${index}`,
    []
  );

  const renderHeader = useCallback(
    () => {
      // Calculate today's completion stats
      const todayString = new Date().toISOString().split('T')[0];
      const completedToday = habits.filter(
        (habit) => getHabitStatus(habit._id, todayString) === 'done'
      ).length;
      const totalHabits = habits.length;

      // Calculate completion status for each day in the week
      const completionByDay: Record<string, DayCompletionStatus> = {};
      weekDateStrings.forEach((dateString) => {
        const completed = habits.filter(
          (habit) => getHabitStatus(habit._id, dateString) === 'done'
        ).length;
        completionByDay[dateString] = {
          completed,
          total: totalHabits,
        };
      });

      const shouldShowTimeline = totalHabits > 0;

      return (
        <View className='gap-3 pb-2.5 pt-16'>
          <HabitsHeader
            completedToday={completedToday}
            openCreateHabitScreen={handleAddHabitPress}
            openSettings={openSettings}
            openTemplatesScreen={openTemplatesScreen}
            reduceMotion={reduceMotionPreference}
            showCompletionSummary={showWeekCompletionBar}
            totalHabits={totalHabits}
          />

          {shouldShowTimeline && (
            <CalendarTimeline
              showSeparator
              canNavigateForward={canNavigateForward}
              completionByDay={completionByDay}
              dates={weekDates}
              reduceMotion={reduceMotionPreference}
              onNextWeek={onNextWeek}
              onPreviousWeek={onPreviousWeek}
            />
          )}
        </View>
      );
    },
    [
      handleAddHabitPress,
      openSettings,
      openTemplatesScreen,
      showWeekCompletionBar,
      canNavigateForward,
      weekDates,
      weekDateStrings,
      onNextWeek,
      onPreviousWeek,
      habits,
      getHabitStatus,
      isHabitsLoading,
      reduceMotionPreference,
    ]
  );

  // Calculate week stats for WeeklySummaryCard
  const weekStats = useMemo(() => {
    return weekDateStrings.map((dateString) => {
      const completed = habits.filter(
        (habit) => getHabitStatus(habit._id, dateString) === 'done'
      ).length;
      return {
        date: dateString,
        completed,
        total: habits.length,
      };
    });
  }, [weekDateStrings, habits, getHabitStatus]);

  // Check if viewing a past week (not the current week)
  const isViewingPastWeek = useMemo(() => {
    if (weekDates.length === 0) return false;
    const today = new Date();
    const lastDayOfWeek = weekDates[weekDates.length - 1];
    // If the last day of the viewed week is before today, it's a past week
    return lastDayOfWeek < today && !weekDates.some(date =>
      date.toDateString() === today.toDateString()
    );
  }, [weekDates]);

  // Calculate average streak for display
  const averageStreak = useMemo(() => {
    if (habits.length === 0) return 0;
    // This is a simplified calculation - in a real app you'd want to calculate actual streaks
    const totalCompleted = weekStats.reduce((sum, day) => sum + day.completed, 0);
    return Math.round(totalCompleted / 7);
  }, [weekStats, habits.length]);

  // Show weekly summary for past weeks or when there are habits
  const showWeeklySummary = habits.length > 0 && isViewingPastWeek;

  const renderFooter = useCallback(() => {
    const showLockedCard = !isPremiumUser && hasReachedHabitLimit;
    // Compute inside callback to avoid stale closure issues with derived state
    const shouldShowWeeklySummary = habits.length > 0 && isViewingPastWeek;

    // Return null when neither condition is met to avoid unnecessary padding
    if (!shouldShowWeeklySummary && !showLockedCard) {
      return null;
    }

    return (
      <View className='gap-4'>
        {/* Weekly Summary Card - shown for past weeks */}
        {shouldShowWeeklySummary && (
          <View className='mt-4'>
            <WeeklySummaryCard
              currentStreak={averageStreak}
              reduceMotion={reduceMotionPreference}
              visible={shouldShowWeeklySummary}
              weekStats={weekStats}
            />
          </View>
        )}

        {/* Locked Habit Card - for free users at limit */}
        {showLockedCard && (
          <View className='mt-2'>
            <LockedHabitCard
              onUpgradePress={onUpgradeIntent}
              reduceMotion={reduceMotionPreference}
            />
          </View>
        )}
      </View>
    );
  }, [
    // Source values instead of derived state to prevent stale closures
    habits.length,
    isViewingPastWeek,
    weekStats,
    averageStreak,
    reduceMotionPreference,
    isPremiumUser,
    hasReachedHabitLimit,
    onUpgradeIntent,
  ]);

  return (
    <View className='flex-1 bg-transparent'>
      <DraggableFlatList
        data={habits}
        keyExtractor={keyExtractor}
        onDragBegin={handleDragBegin}
        renderItem={renderItem}
        onDragEnd={handleDragEnd}
        activationDistance={12}
        contentContainerStyle={{
          paddingBottom: contentPadding.paddingBottom,
          paddingHorizontal: contentPadding.paddingHorizontal,
          paddingTop: 0,
        }}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <HabitsEmptyState
            isLoading={isHabitsLoading}
            openCreateHabitScreen={handleAddHabitPress}
            openTemplatesScreen={openTemplatesScreen}
            onQuickCreateHabit={handleQuickCreateHabit}
          />
        }
        showsVerticalScrollIndicator={false}
      />
      <UpgradePrompt
        visible={upgradePromptVisible}
        onClose={onUpgradeDismiss}
        onUpgradePress={onUpgradeConfirm}
      />
    </View>
  );
}

export default HabitsList;
