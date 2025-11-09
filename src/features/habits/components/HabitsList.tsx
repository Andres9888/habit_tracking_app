import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { HabitsEmptyState } from './HabitsEmptyState';
import type { HabitsListState } from '../hooks/useHabitsApp';
import { useHabitRenderItem } from '../hooks/useHabitRenderItem';
import { HabitsModalsState } from '../hooks/types';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import { HabitsHeader } from './HabitsHeader';
import { CalendarTimelineOptionB as CalendarTimeline } from '../../../components/CalendarTimeline';

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
      style={{ backgroundColor: '#141b2f', shadowColor: '#0f172a', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.22, shadowRadius: 28, elevation: 12 }}
    >
      <View className='gap-2'>
        <Text className='text-[11px] font-bold uppercase tracking-[4px] text-[#a5b4fc]'>
          Premium unlock
        </Text>
        <Text className='text-[26px] font-bold leading-[32px] tracking-tight text-white'>
          Unlock unlimited habits
        </Text>
        <Text className='text-[15px] font-normal leading-[22px] text-[#cbd5f5]'>
          Build every routine, stay accountable, and let smart insights guide your momentum.
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
            Upgrade now
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
            ? 'Power users track 6+ habits -- unlock your next routine today.'
            : 'You are close to your limit. Your next slot unlocks with Premium.'}
        </Text>
      </View>
    </View>
  );
}

function PremiumBenefitsRow() {
  return (
    <View className='gap-4 rounded-3xl border border-[#e0e7ff] bg-white p-5 shadow-[0px_16px_44px_rgba(15,23,42,0.08)]'>
      <Text className='text-[11px] font-bold uppercase tracking-[4px] text-[#4f46e5]'>
        Why members upgrade
      </Text>
      <View className='gap-3'>
        {PREMIUM_BENEFITS.map((benefit) => (
          <View className='gap-1' key={benefit.title}>
            <Text className='text-[14px] font-semibold text-[#111827]'>
              {benefit.title}
            </Text>
            <Text className='text-[13px] leading-[18px] text-[#4b5563]'>
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
    <View className='gap-3 rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] p-5'>
      <Text className='text-[11px] font-bold uppercase tracking-[4px] text-[#0f172a]'>
        Proven momentum
      </Text>
      <Text className='text-[14px] font-normal leading-[22px] text-[#0f172a]'>
        "{SOCIAL_PROOF.quote}"
      </Text>
      <Text className='text-[13px] font-semibold text-[#475569]'>
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
      className='gap-3 rounded-3xl border border-dashed border-[#c4b5fd] bg-[#f5f3ff] p-5'
      style={{ opacity, transform: [{ scale }] }}
    >
      <View className='gap-1'>
        <Text className='text-[14px] font-semibold text-[#312e81]'>
          Add your Evening Reset -- locked
        </Text>
        <Text className='text-[13px] leading-[18px] text-[#4338ca]'>
          Unlimited habits, flexible reminders, and richer insights for every routine.
        </Text>
      </View>
      <Pressable
        accessibilityLabel='Upgrade to unlock unlimited habits'
        accessibilityRole='button'
        className='items-center rounded-full bg-[#4338ca] px-5 py-3'
        onPress={onUpgradePress}
      >
        <Text className='text-[14px] font-semibold text-white'>Upgrade to unlock</Text>
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
    <View className='absolute inset-0 z-20 items-center justify-end bg-black/45'>
      <Pressable
        accessibilityLabel='Close upgrade prompt'
        accessibilityRole='button'
        className='absolute inset-0'
        onPress={onClose}
      />
      <View className='w-full rounded-t-3xl bg-white px-6 py-8'>
        <View className='gap-4'>
          <Text className='text-[18px] font-bold text-[#0f172a]'>
            Unlimited habits unlock your next big goal
          </Text>
          <Text className='text-[14px] leading-[20px] text-[#475569]'>
            Track morning, work, and wellness routines without limits. Premium members stay consistent 2× longer.
          </Text>
          <Pressable
            accessibilityLabel='Upgrade now'
            accessibilityRole='button'
            className='items-center rounded-full bg-[#6366f1] px-5 py-3'
            onPress={onUpgradePress}
          >
            <Text className='text-[15px] font-semibold text-white'>Upgrade now</Text>
          </Pressable>
          <Pressable
            accessibilityLabel='Not now'
            accessibilityRole='button'
            className='items-center rounded-full border border-[#cbd5f5] px-5 py-3'
            onPress={onClose}
          >
            <Text className='text-[14px] font-semibold text-[#6366f1]'>Maybe later</Text>
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

  const { openSettings, openTemplatesScreen } = modals;

  const renderItem = useHabitRenderItem({
    celebrationsEnabled,
    getHabitStatus,
    getStreak,
    handleArchive,
    handleHabitPress,
    notifyWeekCompletion,
    reduceMotionPreference,
    weekDateStrings,
    showHabitStrengthPercentage,
    toggleHabit,
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

      return (
        <View className='gap-3 pb-2.5 pt-16'>
          <HabitsHeader
            completedToday={completedToday}
            openCreateHabitScreen={handleAddHabitPress}
            openSettings={openSettings}
            openTemplatesScreen={openTemplatesScreen}
            showCompletionSummary={showWeekCompletionBar}
            totalHabits={totalHabits}
          />

          <CalendarTimeline
            showSeparator
            canNavigateForward={canNavigateForward}
            dates={weekDates}
            reduceMotion={reduceMotionPreference}
            onNextWeek={onNextWeek}
            onPreviousWeek={onPreviousWeek}
          />
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
      onNextWeek,
      onPreviousWeek,
      habits,
      getHabitStatus,
      isHabitsLoading,
      reduceMotionPreference,
    ]
  );

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
        ListFooterComponent={
          !isPremiumUser && hasReachedHabitLimit ? (
            <View className='mt-6'>
              <LockedHabitCard
                onUpgradePress={onUpgradeIntent}
                reduceMotion={reduceMotionPreference}
              />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <HabitsEmptyState
            isLoading={isHabitsLoading}
            openCreateHabitScreen={handleAddHabitPress}
            openTemplatesScreen={openTemplatesScreen}
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
