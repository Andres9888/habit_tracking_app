/**
 * MonetizationHero — dark-themed premium upgrade card with progress bar.
 *
 * Part of the **monetization flow**: displays the user's free-tier slot usage
 * as an animated progress bar, a pulsing "Start Free Trial" CTA, and a
 * shimmering "Keep 3 habits free" label.
 *
 * All animations are driven by {@link useMonetizationAnimations} and respect
 * the `reduceMotion` preference.
 *
 * Performance: Uses Reanimated for smooth UI-thread animations
 */

import React, { memo, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useMonetizationAnimations } from './useMonetizationAnimations';
import type { MonetizationHeroProps } from './MonetizationHero.types';
import { OPACITY } from '../../../../../constants';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const heroStyles = StyleSheet.create({
  container: {
    backgroundColor: '#1c1917',
    elevation: 4,
    shadowColor: '#1c1917',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
});

export const MonetizationHero = memo(function MonetizationHero({
  freeHabitLimit,
  habitSlotsUsed,
  hasReachedHabitLimit,
  onUpgradePress,
  reduceMotion = false,
}: MonetizationHeroProps) {
  const { progressStyle, ctaPulseStyle, shimmerStyle, trackWidth, handleTrackLayout } =
    useMonetizationAnimations({
      freeHabitLimit,
      habitSlotsUsed,
      hasReachedHabitLimit,
      reduceMotion,
    });

  return (
    <View
      className='overflow-hidden rounded-3xl p-6'
      style={heroStyles.container}
    >
      <View className='gap-2'>
        <Text className='text-[13px] font-medium uppercase tracking-[4px] text-[#a5b4fc]'>
          ✨ Try Premium Free
        </Text>
        <Text className='text-[22px] font-semibold leading-[28px] tracking-tight text-white'>
          Ready for unlimited habits?
        </Text>
        <Text className='text-[17px] font-normal leading-[22px] text-[#cbd5f5]'>
          Try free for 7 days — track every area of your life, get smart
          reminders, and unlock AI-powered insights.
        </Text>
      </View>
      <View className='flex-row items-center gap-3'>
        <AnimatedPressable
          accessibilityHint='Start your 7-day free trial'
          accessibilityLabel='Upgrade to premium for unlimited habits'
          accessibilityRole='button'
          className='flex-1 items-center rounded-full bg-[#6d28d9] px-5 py-3'
          style={({ pressed }: { pressed: boolean }) => [
            {
              elevation: 6,
              opacity: pressed ? 0.8 : 1,
              shadowColor: '#312e81',
              shadowOffset: { height: 8, width: 0 },
              shadowOpacity: 0.32,
              shadowRadius: 16,
            },
            ctaPulseStyle,
          ]}
          onPress={onUpgradePress}
        >
          <Text className='text-[17px] font-semibold leading-[22px] tracking-wide text-white'>
            Start Free Trial →
          </Text>
        </AnimatedPressable>
        <View className='border-white/22 flex-1 rounded-full border px-4 py-3'>
          <Animated.Text
            className='text-center text-[13px] font-semibold text-[#cbd5f5]'
            style={shimmerStyle}
          >
            Keep 3 habits free
          </Animated.Text>
        </View>
      </View>
      <View className='gap-2 pt-2'>
        <View className='flex-row items-center justify-between'>
          <Text className='text-[13px] font-medium uppercase tracking-[1px] text-[#a8a29e]'>
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
            style={[{ maxWidth: trackWidth }, progressStyle]}
          />
        </View>
        <Text className='text-[13px] font-medium text-[#fbbf24]'>
          {hasReachedHabitLimit
            ? "You're making great progress! Go unlimited to track every area of your life."
            : `${freeHabitLimit - habitSlotsUsed} free ${freeHabitLimit - habitSlotsUsed === 1 ? 'slot' : 'slots'} remaining. Premium unlocks unlimited habits.`}
        </Text>
      </View>
    </View>
  );
});
