import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors } from '../../../../../theme/colors';
import { durations, enterEasing } from '../../../../../theme/animations';
import { useMonetizationAnimations } from './useMonetizationAnimations';
import type { MonetizationHeroProps } from './MonetizationHero.types';
import { SHADOW_OPACITY } from '../../../../../constants';

export function MonetizationHero({
  freeHabitLimit, habitSlotsUsed, hasReachedHabitLimit, onUpgradePress, reduceMotion = false,
}: MonetizationHeroProps) {
  const { progressStyle, trackWidth, handleTrackLayout } =
    useMonetizationAnimations({
      freeHabitLimit,
      habitSlotsUsed,
      reduceMotion,
    });

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeIn.duration(durations.enter).easing(enterEasing)}
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
        <Text style={{ color: colors.indigo[300] }} className='text-sm font-medium uppercase tracking-[4px]'>
          {'✨'} Try Premium Free
        </Text>
        <Text className='text-2xl font-semibold leading-[28px] tracking-tight text-white'>
          Ready for unlimited habits?
        </Text>
        <Text style={{ color: colors.indigo[200] }} className='text-base font-normal leading-[22px]'>
          Try free for 7 days — track every area of your life, get smart
          reminders, and unlock AI-powered insights.
        </Text>
      </View>
      <View className='flex-row items-center gap-3'>
        <Pressable
          accessibilityHint='Start your 7-day free trial'
          accessibilityLabel='Upgrade to premium for unlimited habits'
          accessibilityRole='button'
          className='flex-1 items-center rounded-full px-5 py-3'
          style={({ pressed }: { pressed: boolean }) => ({
            backgroundColor: colors.indigo[700],
            elevation: 6,
            opacity: pressed ? 0.8 : 1,
            shadowColor: colors.indigo[900],
            shadowOffset: { height: 8, width: 0 },
            shadowOpacity: 0.32,
            shadowRadius: 16,
          })}
          onPress={onUpgradePress}
        >
          <Text className='text-base font-semibold leading-[22px] tracking-wide text-white'>
            Start Free Trial {'→'}
          </Text>
        </Pressable>
        <View className='border-white/22 flex-1 rounded-full border px-4 py-3'>
          <Text
            style={{ color: colors.indigo[200] }}
            className='text-center text-sm font-semibold'
          >
            Keep 3 habits free
          </Text>
        </View>
      </View>
      <View className='gap-2 pt-2'>
        <View className='flex-row items-center justify-between'>
          <Text style={{ color: colors.gray[400] }} className='text-sm font-medium uppercase tracking-[1px]'>
            Habit slots used
          </Text>
          <Text className='text-sm font-bold tabular-nums text-white'>
            {habitSlotsUsed}/{freeHabitLimit}
          </Text>
        </View>
        <View className='bg-white/12 h-2 w-full overflow-hidden rounded-full' onLayout={handleTrackLayout}>
          <Animated.View
            className='h-2 rounded-full'
            style={[{ backgroundColor: colors.streak[300], maxWidth: trackWidth }, progressStyle]}
          />
        </View>
        <Text style={{ color: colors.streak[300] }} className='text-sm font-medium'>
          {hasReachedHabitLimit
            ? "You're making great progress! Go unlimited to track every area of your life."
            : `${freeHabitLimit - habitSlotsUsed} free ${freeHabitLimit - habitSlotsUsed === 1 ? 'slot' : 'slots'} remaining. Premium unlocks unlimited habits.`}
        </Text>
      </View>
    </Animated.View>
  );
}
