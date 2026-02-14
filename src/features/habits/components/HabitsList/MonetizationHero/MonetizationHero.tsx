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
      className='overflow-hidden rounded-3xl p-6'
      style={{
        backgroundColor: '#1c1917',
        elevation: 4,
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <View className='gap-2'>
        <Text className='text-[13px] font-medium uppercase tracking-[4px] text-[#6ee7b7]'>
          ✨ Try Premium Free
        </Text>
        <Text className='text-[22px] font-semibold leading-[28px] tracking-tight text-white'>
          Ready for unlimited habits?
        </Text>
        <Text className='text-[17px] font-normal leading-[22px] text-stone-400'>
          Start a 7-day free trial to track every area of your life, get smart
          reminders, and unlock AI-powered insights.
        </Text>
      </View>
      <View className='flex-row items-center gap-3'>
        <AnimatedPressable
          accessibilityLabel='Upgrade to premium for unlimited habits'
          accessibilityRole='button'
          className='flex-1 items-center rounded-full bg-[#059669] px-5 py-3'
          style={({ pressed }: { pressed: boolean }) => ({
            elevation: 6,
            opacity: pressed ? 0.8 : 1,
            shadowColor: '#047857',
            shadowOffset: { height: 8, width: 0 },
            shadowOpacity: 0.32,
            shadowRadius: 16,
            transform: [{ scale: ctaPulse }],
          })}
          onPress={onUpgradePress}
        >
          <Text className='text-[17px] font-semibold leading-[22px] tracking-wide text-white'>
            Start Free Trial →
          </Text>
        </AnimatedPressable>
        <View className='border-white/22 flex-1 rounded-full border px-4 py-3'>
          <Animated.Text
            className='text-center text-[13px] font-semibold text-stone-400'
            style={{ opacity: shimmer }}
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
