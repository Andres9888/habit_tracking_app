import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

import { HabitsEmptyStateMinimal } from './HabitsEmptyStateMinimal';
import type { HabitsListState } from '../hooks/useHabitsApp';
import { useHabitRenderItem } from '../hooks/useHabitRenderItem';
import { HabitsModalsState } from '../hooks/types';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import { HabitsHeader } from './HabitsHeader';
import { SortBottomSheet } from './SortBottomSheet';
import {
  CalendarTimeline,
  type DayCompletionStatus,
} from '../../../components/CalendarTimeline';

const PREMIUM_BENEFITS = [
  {
    description:
      'Expand beyond the three core routines and organize every area of life.',
    title: 'Unlimited habits',
  },
  {
    description:
      'Flexible reminder schedules keep momentum without overwhelming you.',
    title: 'Smart reminders',
  },
  {
    description:
      'Detailed insights reveal streak trends and habit pairings that stick.',
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

  const handleTrackLayout = useCallback(
    (event: { nativeEvent: { layout: { width: number } } }) => {
      setTrackWidth(event.nativeEvent.layout.width);
    },
    []
  );

  return (
    <View
      className='overflow-hidden rounded-3xl p-6'
      style={{
        backgroundColor: '#1c1917',
        elevation: 12,
        shadowColor: '#78350f',
        shadowOffset: { height: 14, width: 0 },
        shadowOpacity: 0.18,
        shadowRadius: 28,
      }}
    >
      <View className='gap-2'>
        <Text className='text-[10px] font-medium uppercase tracking-[4px] text-[#a5b4fc]'>
          Level up
        </Text>
        <Text className='text-[24px] font-bold leading-[32px] tracking-tight text-white'>
          Ready to build more?
        </Text>
        <Text className='text-[15px] font-normal leading-[22px] text-[#cbd5f5]'>
          Track unlimited habits, get smart reminders, and unlock insights to
          guide your growth.
        </Text>
      </View>

      <View className='flex-row items-center gap-3'>
        <AnimatedPressable
          accessibilityLabel='Upgrade to premium for unlimited habits'
          accessibilityRole='button'
          className='flex-1 items-center rounded-full bg-[#6d28d9] px-5 py-3'
          style={{
            elevation: 6,
            shadowColor: '#312e81',
            shadowOffset: { height: 8, width: 0 },
            shadowOpacity: 0.32,
            shadowRadius: 16,
            transform: [{ scale: ctaPulse }],
          }}
          onPress={onUpgradePress}
        >
          <Text className='text-[15px] font-bold leading-[20px] tracking-wide text-white'>
            Go Premium
          </Text>
        </AnimatedPressable>
        <View className='border-white/22 flex-1 rounded-full border px-4 py-3'>
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
          <Text className='text-[10px] font-medium uppercase tracking-[1px] text-[#a8a29e]'>
            Habit slots used
          </Text>
          <Text className='text-[13px] font-bold tabular-nums text-white'>
            {habitSlotsUsed}/{freeHabitLimit}
          </Text>
        </View>

        <View
          className='bg-white/12 h-2 w-full overflow-hidden rounded-full'
          onLayout={handleTrackLayout}
        >
          <Animated.View
            className='h-2 rounded-full bg-[#fbbf24]'
            style={{ maxWidth: trackWidth, width: progress }}
          />
        </View>

        <Text className='text-[13px] font-medium text-[#fbbf24]'>
          {hasReachedHabitLimit
            ? "You're making great progress! Upgrade to track every area of your life."
            : `${freeHabitLimit - habitSlotsUsed} free ${freeHabitLimit - habitSlotsUsed === 1 ? 'slot' : 'slots'} remaining. Premium unlocks unlimited habits.`}
        </Text>
      </View>
    </View>
  );
}

function PremiumBenefitsRow() {
  return (
    <View className='gap-4 rounded-3xl border border-amber-100/60 bg-white/90 p-5 shadow-[0px_16px_44px_rgba(120,90,50,0.06)]'>
      <Text className='text-[10px] font-medium uppercase tracking-[4px] text-amber-700'>
        Why members upgrade
      </Text>
      <View className='gap-3'>
        {PREMIUM_BENEFITS.map((benefit) => (
          <View key={benefit.title} className='gap-1'>
            <Text className='text-[15px] font-semibold text-stone-800'>
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
      <Text className='text-[10px] font-medium uppercase tracking-[4px] text-stone-700'>
        Proven momentum
      </Text>
      <Text className='text-[15px] font-normal leading-[22px] text-stone-800'>
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

function LockedHabitCard({
  onUpgradePress,
  reduceMotion = false,
}: LockedHabitCardProps) {
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
          <Text className='text-center text-[17px] font-semibold text-stone-800'>
            Want to add more habits?
          </Text>
          <Text className='text-center text-[13px] leading-[18px] text-stone-600'>
            Track unlimited habits, get smart reminders, and unlock deeper
            insights to build stronger routines.
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityLabel='Upgrade to unlock unlimited habits'
        accessibilityRole='button'
        className='items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 shadow-[0px_8px_16px_rgba(109,40,217,0.2)]'
        onPress={onUpgradePress}
      >
        <Text className='text-[15px] font-semibold text-white'>
          ✨ Upgrade to Premium
        </Text>
      </Pressable>
    </Animated.View>
  );
}

interface UpgradePromptProps {
  onClose: () => void;
  onUpgradePress: () => void;
  visible: boolean;
}

function UpgradePrompt({
  onClose,
  onUpgradePress,
  visible,
}: UpgradePromptProps) {
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
          <Text className='text-center text-[24px] font-bold text-stone-900'>
            You're on a roll! Ready for more?
          </Text>
          <Text className='text-center text-[15px] leading-[22px] text-stone-600'>
            Track unlimited habits across all areas of your life. Premium
            members build stronger routines and stay consistent 2× longer.
          </Text>
          <Pressable
            accessibilityLabel='Upgrade to premium'
            accessibilityRole='button'
            className='items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 shadow-[0px_8px_16px_rgba(109,40,217,0.25)]'
            onPress={onUpgradePress}
          >
            <Text className='text-[15px] font-semibold text-white'>
              ✨ Unlock unlimited habits
            </Text>
          </Pressable>
          <Pressable
            accessibilityLabel='Continue with free plan'
            accessibilityRole='button'
            className='items-center rounded-full border-2 border-stone-200 bg-white/80 px-5 py-3'
            onPress={onClose}
          >
            <Text className='text-[15px] font-semibold text-stone-500'>
              Keep 3 habits free
            </Text>
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
  weekDates: Date[];
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
    dayShape,
    freeHabitLimit,
    habits,
    habitSortMode,
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

  const {
    onSettingsChange,
    openQuickActions,
    openSettings,
    openTemplatesScreen,
  } = modals;
  const isReorderingEnabled = habitSortMode === 'manual';

  // State for SortBottomSheet visibility
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);

  const handleOpenSortSheet = useCallback(() => {
    setIsSortSheetOpen(true);
  }, []);

  const handleCloseSortSheet = useCallback(() => {
    setIsSortSheetOpen(false);
  }, []);

  const handleChangeHabitSortMode = useCallback(
    (value: typeof habitSortMode) => {
      void onSettingsChange({
        habitSortMode: value,
      });
    },
    [onSettingsChange]
  );

  // Quick-create habit mutation for instant habit creation
  const createHabit = useMutation(api.habits.create);
  const [justCreatedHabitId, setJustCreatedHabitId] =
    useState<Id<'habits'> | null>(null);
  // Track if we're in the success celebration phase (before transition)
  const [isInSuccessCelebration, setIsInSuccessCelebration] = useState(false);

  // Staggered entrance animation for header elements
  // Start visible (1, 0) - will be reset to hidden before animating when coming from success state
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const calendarOpacity = useRef(new Animated.Value(1)).current;
  const calendarTranslateY = useRef(new Animated.Value(0)).current;
  const habitRowOpacity = useRef(new Animated.Value(1)).current;
  const habitRowTranslateY = useRef(new Animated.Value(0)).current;

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
          // Mark that we're in celebration phase
          setIsInSuccessCelebration(true);
          // Note: We no longer hide the header here because it causes issues
          // where the header doesn't reappear after the success animation.
          // The header will naturally be hidden during the success state
          // because ListEmptyComponent (SuccessState) is shown instead.
        }
      } catch (error) {
        console.error('Failed to create habit:', error);
      }
    },
    [createHabit, hasReachedHabitLimit, isPremiumUser, onCreateHabitRequest]
  );

  // Callback when success animation completes - transition to list
  const handleSuccessTransitionComplete = useCallback(() => {
    console.log(
      '[HabitsList] handleSuccessTransitionComplete called - triggering entrance animations'
    );
    setIsInSuccessCelebration(false);

    // Trigger staggered entrance animations for header, calendar, and habit row
    const animationConfig = {
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    };

    // Reset to initial hidden state before animating
    headerOpacity.setValue(0);
    headerTranslateY.setValue(20);
    calendarOpacity.setValue(0);
    calendarTranslateY.setValue(20);
    habitRowOpacity.setValue(0);
    habitRowTranslateY.setValue(20);

    // Staggered entrance: header first, then calendar, then habit row
    Animated.stagger(100, [
      // Header entrance
      Animated.parallel([
        Animated.timing(headerOpacity, { ...animationConfig, toValue: 1 }),
        Animated.timing(headerTranslateY, { ...animationConfig, toValue: 0 }),
      ]),
      // Calendar entrance
      Animated.parallel([
        Animated.timing(calendarOpacity, { ...animationConfig, toValue: 1 }),
        Animated.timing(calendarTranslateY, { ...animationConfig, toValue: 0 }),
      ]),
      // Habit row entrance
      Animated.parallel([
        Animated.timing(habitRowOpacity, { ...animationConfig, toValue: 1 }),
        Animated.timing(habitRowTranslateY, { ...animationConfig, toValue: 0 }),
      ]),
    ]).start();
  }, [
    headerOpacity,
    headerTranslateY,
    calendarOpacity,
    calendarTranslateY,
    habitRowOpacity,
    habitRowTranslateY,
  ]);

  useEffect(() => {
    if (!justCreatedHabitId) {
      return;
    }
    // Longer timeout to accommodate the shared element transition (3s total)
    const timeout = setTimeout(() => setJustCreatedHabitId(null), 3000);
    return () => clearTimeout(timeout);
  }, [justCreatedHabitId]);

  const renderItem = useHabitRenderItem({
    celebrationsEnabled,
    completionIcon: habitCompletionIcon,
    dayShape,
    getHabitStatus,
    getStreak,
    handleArchive,
    handleHabitPress,
    highlightHabitId: justCreatedHabitId,
    isReorderingEnabled,
    notifyWeekCompletion,
    reduceMotionPreference,
    showHabitStrengthPercentage,
    toggleHabit,
    weekDateStrings,
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

  const renderHeader = useCallback(() => {
    // Calculate today's completion stats
    const todayString = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(
      (habit) => getHabitStatus(habit._id, todayString) === 'done'
    ).length;
    const totalHabits = habits.length;

    // Calculate completion status for each day in the week
    const completionByDay: Record<string, DayCompletionStatus> = {};
    for (const dateString of weekDateStrings) {
      const completed = habits.filter(
        (habit) => getHabitStatus(habit._id, dateString) === 'done'
      ).length;
      completionByDay[dateString] = {
        completed,
        total: totalHabits,
      };
    }

    // Show timeline/header when we have habits OR when transitioning from empty state
    const shouldShowTimeline = totalHabits > 0 || justCreatedHabitId !== null;

    return (
      <View className='gap-3 pb-2.5 pt-16'>
        <Animated.View
          style={{
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          }}
        >
          <HabitsHeader
            completedToday={completedToday}
            forceShow={justCreatedHabitId !== null}
            openCreateHabitScreen={handleAddHabitPress}
            openSettings={openSettings}
            openSortSheet={handleOpenSortSheet}
            openTemplatesScreen={openTemplatesScreen}
            reduceMotion={reduceMotionPreference}
            showCompletionSummary={showWeekCompletionBar}
            totalHabits={totalHabits}
          />
        </Animated.View>

        {shouldShowTimeline && (
          <Animated.View
            style={{
              opacity: calendarOpacity,
              transform: [{ translateY: calendarTranslateY }],
            }}
          >
            <CalendarTimeline
              showSeparator
              canNavigateForward={canNavigateForward}
              completionByDay={completionByDay}
              dates={weekDates}
              reduceMotion={reduceMotionPreference}
              onNextWeek={onNextWeek}
              onPreviousWeek={onPreviousWeek}
            />
          </Animated.View>
        )}
      </View>
    );
  }, [
    handleAddHabitPress,
    handleOpenSortSheet,
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
    headerOpacity,
    headerTranslateY,
    calendarOpacity,
    calendarTranslateY,
    justCreatedHabitId,
  ]);

  const renderFooter = useCallback(() => {
    const showLockedCard = !isPremiumUser && hasReachedHabitLimit;

    // Return null when condition is not met to avoid unnecessary padding
    if (!showLockedCard) {
      return null;
    }

    return (
      <View className='gap-4'>
        {/* Locked Habit Card - for free users at limit */}
        {showLockedCard && (
          <View className='mt-2'>
            <LockedHabitCard
              reduceMotion={reduceMotionPreference}
              onUpgradePress={onUpgradeIntent}
            />
          </View>
        )}
      </View>
    );
  }, [
    isPremiumUser,
    hasReachedHabitLimit,
    onUpgradeIntent,
    reduceMotionPreference,
  ]);

  return (
    <View className='flex-1 bg-transparent'>
      <DraggableFlatList
        activationDistance={isReorderingEnabled ? 12 : 9999}
        contentContainerStyle={{
          paddingBottom: contentPadding.paddingBottom,
          paddingHorizontal: contentPadding.paddingHorizontal,
          paddingTop: 0,
        }}
        data={habits}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          <HabitsEmptyStateMinimal
            isLoading={isHabitsLoading}
            openCreateHabitScreen={handleAddHabitPress}
            openTemplatesScreen={openTemplatesScreen}
            onQuickCreateHabit={handleQuickCreateHabit}
            onSuccessTransitionComplete={handleSuccessTransitionComplete}
          />
        }
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderHeader}
        renderItem={(props) => (
          <Animated.View
            style={
              props.item._id === justCreatedHabitId
                ? {
                    opacity: habitRowOpacity,
                    transform: [{ translateY: habitRowTranslateY }],
                  }
                : undefined
            }
          >
            {renderItem(props)}
          </Animated.View>
        )}
        showsVerticalScrollIndicator={false}
        onDragBegin={handleDragBegin}
        onDragEnd={handleDragEnd}
      />
      <UpgradePrompt
        visible={upgradePromptVisible}
        onClose={onUpgradeDismiss}
        onUpgradePress={onUpgradeConfirm}
      />
      <SortBottomSheet
        reduceMotion={reduceMotionPreference}
        sortMode={habitSortMode}
        visible={isSortSheetOpen}
        onClose={handleCloseSortSheet}
        onSelectSortMode={handleChangeHabitSortMode}
      />
    </View>
  );
}

export default HabitsList;
