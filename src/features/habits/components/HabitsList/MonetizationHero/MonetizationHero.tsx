/**
 * MonetizationHero Component
 * Premium upgrade card with animated progress and CTA
 */

import { Animated, Pressable, Text, View } from 'react-native';
import { useMonetizationAnimations } from './useMonetizationAnimations';
import type { MonetizationHeroProps } from './MonetizationHero.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MonetizationHero({
  freeHabitLimit,
  habitSlotsUsed,
  hasReachedHabitLimit,
  onUpgradePress,
  reduceMotion = false,
}: MonetizationHeroProps) {
  const { progress, ctaPulse, shimmer, trackWidth, handleTrackLayout } =
    useMonetizationAnimations({
      freeHabitLimit,
      habitSlotsUsed,
      hasReachedHabitLimit,
      reduceMotion,
    });

  return (
    <View
      className='overflow-hidden rounded-3xl bg-stone-900 p-6 dark:bg-stone-800'
      style={{
        elevation: 12,
        shadowColor: '#78350f',
        shadowOffset: { height: 14, width: 0 },
        shadowOpacity: 0.18,
        shadowRadius: 28,
      }}
    >
      <View className='gap-2'>
        <Text className='text-[10px] font-medium uppercase tracking-[4px] text-indigo-300 dark:text-indigo-400'>
          Level up
        </Text>
        <Text className='text-[24px] font-bold leading-[32px] tracking-tight text-white dark:text-stone-100'>
          Ready to build more?
        </Text>
        <Text className='text-[15px] font-normal leading-[22px] text-indigo-200 dark:text-indigo-300'>
          Track unlimited habits, get smart reminders, and unlock insights to
          guide your growth.
        </Text>
      </View>
      <View className='flex-row items-center gap-3'>
        <AnimatedPressable
          accessibilityLabel='Upgrade to premium for unlimited habits'
          accessibilityRole='button'
          className='flex-1 items-center rounded-full bg-violet-700 px-5 py-3 dark:bg-violet-600'
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
          <Text className='text-[15px] font-semibold leading-[20px] tracking-wide text-white'>
            Go Premium
          </Text>
        </AnimatedPressable>
        <View className='flex-1 rounded-full border border-white/20 px-4 py-3 dark:border-stone-600'>
          <Animated.Text
            className='text-center text-[13px] font-semibold text-indigo-200 dark:text-indigo-300'
            style={{ opacity: shimmer }}
          >
            Keep 3 habits free
          </Animated.Text>
        </View>
      </View>
      <View className='gap-2 pt-2'>
        <View className='flex-row items-center justify-between'>
          <Text className='text-[10px] font-medium uppercase tracking-[1px] text-stone-400 dark:text-stone-500'>
            Habit slots used
          </Text>
          <Text className='text-[13px] font-bold tabular-nums text-white dark:text-stone-100'>
            {habitSlotsUsed}/{freeHabitLimit}
          </Text>
        </View>
        <View
          className='h-2 w-full overflow-hidden rounded-full bg-white/10 dark:bg-stone-700'
          onLayout={handleTrackLayout}
        >
          <Animated.View
            className='h-2 rounded-full bg-amber-400 dark:bg-amber-500'
            style={{ maxWidth: trackWidth, width: progress }}
          />
        </View>
        <Text className='text-[13px] font-medium text-amber-400 dark:text-amber-500'>
          {hasReachedHabitLimit
            ? "You're making great progress! Upgrade to track every area of your life."
            : `${freeHabitLimit - habitSlotsUsed} free ${freeHabitLimit - habitSlotsUsed === 1 ? 'slot' : 'slots'} remaining. Premium unlocks unlimited habits.`}
        </Text>
      </View>
    </View>
  );
}
