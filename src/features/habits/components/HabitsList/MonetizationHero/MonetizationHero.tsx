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
  const { colors } = useThemeColors();
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
        backgroundColor: colors.gray[900],
        elevation: 4,
        shadowColor: colors.gray[900],
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: SHADOW_OPACITY.minimal,
        shadowRadius: 16,
      }}
    >
      <View className='gap-2'>
        <Text
          className='text-[13px] font-medium uppercase tracking-[4px]'
          style={{ color: colors.secondary[100] + 'E6' }}
        >
          ✨ Try Premium Free
        </Text>
        <Text
          className='text-[22px] font-semibold leading-[28px] tracking-tight'
          style={{ color: colors.white }}
        >
          Ready for unlimited habits?
        </Text>
        <Text
          className='text-[17px] font-normal leading-[22px]'
          style={{ color: colors.secondary[100] + 'F0' }}
        >
          Start a 7-day free trial to track every area of your life, get smart

          reminders, and unlock AI-powered insights.
        </Text>
      </View>
      <View className='flex-row items-center gap-3'>
        <AnimatedPressable
          accessibilityHint='Start your 7-day free trial'
          accessibilityLabel='Upgrade to premium for unlimited habits'
          accessibilityRole='button'
          className='flex-1 items-center rounded-full px-5 py-3'
          style={({ pressed }: { pressed: boolean }) => ({
            backgroundColor: colors.premium[600],
            elevation: 6,
            opacity: pressed ? 0.8 : 1,
            shadowColor: colors.premium[700],

            shadowOffset: { height: 8, width: 0 },
            shadowOpacity: SHADOW_OPACITY.strong,
            shadowRadius: 16,
            transform: [{ scale: ctaPulse }],
          })}
          onPress={onUpgradePress}
        >
          <Text
            className='text-[17px] font-semibold leading-[22px] tracking-wide'
            style={{ color: colors.white }}
          >
            Start Free Trial →
          </Text>
        </AnimatedPressable>
        <View
          className='flex-1 rounded-full border px-4 py-3'
          style={{ borderColor: colors.white + '38' }}
        >
          <Animated.Text
            className='text-center text-[13px] font-semibold'
            style={{
              color: colors.secondary[100] + 'F0',
              opacity: shimmer,
            }}
          >
            Keep 3 habits free
          </Animated.Text>
        </View>
      </View>
      <View className='gap-2 pt-2'>
        <View className='flex-row items-center justify-between'>
          <Text
            className='text-[13px] font-medium uppercase tracking-[1px]'
            style={{ color: colors.gray[400] }}
          >
            Habit slots used
          </Text>
          <Text
            className='text-[13px] font-bold tabular-nums'
            style={{ color: colors.white }}
          >
            {habitSlotsUsed}/{freeHabitLimit}
          </Text>
        </View>
        <View
          className='h-2 w-full overflow-hidden rounded-full'
          onLayout={handleTrackLayout}
          style={{ backgroundColor: colors.white + '1F' }}
        >
          <Animated.View
            className='h-2 rounded-full'
            style={{
              backgroundColor: colors.streak[500],
              maxWidth: trackWidth,
              width: progress,
            }}
          />
        </View>
        <Text
          className='text-[13px] font-medium'
          style={{ color: colors.streak[500] }}
        >
          {hasReachedHabitLimit
            ? "You're making great progress! Go unlimited to track every area of your life."
            : `${freeHabitLimit - habitSlotsUsed} free ${freeHabitLimit - habitSlotsUsed === 1 ? 'slot' : 'slots'} remaining. Premium unlocks unlimited habits.`}
        </Text>
      </View>
    </View>
  );
}
