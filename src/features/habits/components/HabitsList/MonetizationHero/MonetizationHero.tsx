import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { colors } from '../../../../../theme/colors';
import { useMonetizationAnimations } from './useMonetizationAnimations';
import type { MonetizationHeroProps } from './MonetizationHero.types';
import { SHADOW_OPACITY } from '../../../../../constants';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// TODO: These premium/indigo colors are not yet in the design system
const PREMIUM_INDIGO_LIGHT = '#a5b4fc'; // indigo-300
const PREMIUM_INDIGO_MUTED = '#cbd5f5'; // indigo-200
const PREMIUM_PURPLE_CTA = '#6d28d9'; // violet-700
const PREMIUM_PURPLE_SHADOW = '#312e81'; // indigo-900

export function MonetizationHero({
  freeHabitLimit, habitSlotsUsed, hasReachedHabitLimit, onUpgradePress, reduceMotion = false,
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
        <Text style={{ color: PREMIUM_INDIGO_LIGHT }} className='text-[13px] font-medium uppercase tracking-[4px]'>
          {'\u2728'} Try Premium Free
        </Text>
        <Text className='text-[22px] font-semibold leading-[28px] tracking-tight text-white'>
          Ready for unlimited habits?
        </Text>
        <Text style={{ color: PREMIUM_INDIGO_MUTED }} className='text-[17px] font-normal leading-[22px]'>
          Try free for 7 days — track every area of your life, get smart
          reminders, and unlock AI-powered insights.
        </Text>
      </View>
      <View className='flex-row items-center gap-3'>
        <AnimatedPressable
          accessibilityHint='Start your 7-day free trial'
          accessibilityLabel='Upgrade to premium for unlimited habits'
          accessibilityRole='button'
          className='flex-1 items-center rounded-full px-5 py-3'
          style={({ pressed }: { pressed: boolean }) => [
            {
              backgroundColor: PREMIUM_PURPLE_CTA,
              elevation: 6,
              opacity: pressed ? 0.8 : 1,
              shadowColor: PREMIUM_PURPLE_SHADOW,
              shadowOffset: { height: 8, width: 0 },
              shadowOpacity: 0.32,
              shadowRadius: 16,
            },
            ctaPulseStyle,
          ]}
          onPress={onUpgradePress}
        >
          <Text className='text-[17px] font-semibold leading-[22px] tracking-wide text-white'>
            Start Free Trial {'\u2192'}
          </Text>
        </AnimatedPressable>
        <View className='border-white/22 flex-1 rounded-full border px-4 py-3'>
          <Animated.Text
            style={{ color: PREMIUM_INDIGO_MUTED }}
            className='text-center text-[13px] font-semibold'
          >
            Keep 3 habits free
          </Animated.Text>
        </View>
      </View>
      <View className='gap-2 pt-2'>
        <View className='flex-row items-center justify-between'>
          <Text style={{ color: colors.gray[400] }} className='text-[13px] font-medium uppercase tracking-[1px]'>
            Habit slots used
          </Text>
          <Text className='text-[13px] font-bold tabular-nums text-white'>
            {habitSlotsUsed}/{freeHabitLimit}
          </Text>
        </View>
        <View className='bg-white/12 h-2 w-full overflow-hidden rounded-full' onLayout={handleTrackLayout}>
          <Animated.View
            className='h-2 rounded-full'
            style={[{ backgroundColor: colors.streak[300], maxWidth: trackWidth }, progressStyle]}
          />
        </View>
        <Text style={{ color: colors.streak[300] }} className='text-[13px] font-medium'>
          {hasReachedHabitLimit
            ? "You're making great progress! Go unlimited to track every area of your life."
            : `${freeHabitLimit - habitSlotsUsed} free ${freeHabitLimit - habitSlotsUsed === 1 ? 'slot' : 'slots'} remaining. Premium unlocks unlimited habits.`}
        </Text>
      </View>
    </View>
  );
}
