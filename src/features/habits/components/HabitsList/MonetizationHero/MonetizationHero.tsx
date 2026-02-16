/**
 * MonetizationHero Component
 * Premium upgrade card with animated progress and CTA — dark mode aware
 */

import { Animated, Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';
import { useMonetizationAnimations } from './useMonetizationAnimations';
import type { MonetizationHeroProps } from './MonetizationHero.types';
import { SHADOW_OPACITY, OPACITY } from '../../../../../constants';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MonetizationHero({
  freeHabitLimit,
  habitSlotsUsed,
  hasReachedHabitLimit,
  onUpgradePress,
  reduceMotion = false,
}: MonetizationHeroProps) {
  const { isDark } = useThemeColors();
  const { progress, ctaPulse, shimmer, trackWidth, handleTrackLayout } =
    useMonetizationAnimations({
      freeHabitLimit,
      habitSlotsUsed,
      hasReachedHabitLimit,
      reduceMotion,
    });

  // The hero is intentionally dark-themed (dark card on light bg, stays dark on dark bg)
  // Adjust border/shadow for dark mode context
  const containerBg = isDark ? '#0f172a' : '#1c1917';
  const shadowColor = isDark ? '#000000' : '#1c1917';

  return (
    <View
      className='overflow-hidden rounded-3xl p-6'
      style={{
        backgroundColor: containerBg,
        borderColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
        borderWidth: isDark ? 1 : 0,
        elevation: 4,
        shadowColor,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: SHADOW_OPACITY.minimal,
        shadowRadius: 16,
      }}
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
          style={({ pressed }: { pressed: boolean }) => ({
            elevation: 6,
            opacity: pressed ? OPACITY.strong : OPACITY.full,
            shadowColor: '#312e81',
            shadowOffset: { height: 8, width: 0 },
            shadowOpacity: SHADOW_OPACITY.strong,
            shadowRadius: 16,
            transform: [{ scale: ctaPulse }],
          })}
          onPress={onUpgradePress}
        >
          <Text className='text-[17px] font-semibold leading-[22px] tracking-wide text-white'>
            Start Free Trial →
          </Text>
        </AnimatedPressable>
        <View
          className='flex-1 rounded-full border px-4 py-3'
          style={{ borderColor: 'rgba(255, 255, 255, 0.14)' }}
        >
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
          <Text className='text-[13px] font-medium uppercase tracking-[1px] text-[#a8a29e]'>
            Habit slots used
          </Text>
          <Text className='text-[13px] font-bold tabular-nums text-white'>
            {habitSlotsUsed}/{freeHabitLimit}
          </Text>
        </View>
        <View
          className='h-2 w-full overflow-hidden rounded-full'
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
          onLayout={handleTrackLayout}
        >
          <Animated.View
            className='h-2 rounded-full bg-[#fbbf24]'
            style={{ maxWidth: trackWidth, width: progress }}
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
}
