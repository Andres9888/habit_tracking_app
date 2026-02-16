/**
 * UpgradePrompt — full-screen modal overlay for trial conversion.
 *
 * Part of the **monetization flow**: shown by {@link HabitsListModals} when
 * `upgradePromptVisible` is true (typically after the user tries to exceed
 * the free-tier habit limit).
 *
 * Features a slide-in card with headline, value prop, pricing pill, primary
 * CTA ("Start Free Trial"), and a dismissive secondary button ("Maybe later").
 * The backdrop is tappable to dismiss.
 */

import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown, SlideInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { OPACITY, ANIMATION_DURATION, ANIMATION_VALUES } from '../../../../constants';

interface UpgradePromptProps {
  onClose: () => void;
  onUpgradePress: () => void;
  visible: boolean;
}

export function UpgradePrompt({
  onClose,
  onUpgradePress,
  visible,
}: UpgradePromptProps) {
  if (!visible) return null;

  return (
    <Animated.View
      className='absolute inset-0 z-20 items-center justify-end bg-stone-900/50'
      entering={FadeInDown.duration(280).springify().damping(18)}
    >
      <Pressable
        accessibilityHint='Tap outside to dismiss'
        accessibilityLabel='Close upgrade prompt'
        accessibilityRole='button'
        className='absolute inset-0'
        onPress={onClose}
      />
      <Animated.View
        className='w-full px-6 py-8'
        entering={SlideInDown.duration(ANIMATION_DURATION.medium).damping(ANIMATION_VALUES.springDamping)}
        style={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <LinearGradient
          className='absolute inset-0'
          colors={['#ffffff', 'rgba(255, 251, 235, 0.3)']}
          style={{
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        />
        <View className='gap-4'>
          <View className='items-center pb-2'>
            <Text className='text-[32px]'>🚀</Text>
          </View>
          <Text className='text-center text-[24px] font-bold tracking-tight text-stone-900'>
            Ready to build more habits?
          </Text>
          <Text className='text-center text-[15px] font-normal leading-[20px] text-stone-500'>
            Track unlimited habits across all areas of your life. Premium
            members build stronger routines and stay consistent 2× longer.
          </Text>
          <View className='items-center rounded-2xl bg-violet-50 px-4 py-3'>
            <Text className='text-center text-[13px] font-semibold text-violet-700'>
              $0 for 7 days · Cancel anytime
            </Text>
          </View>
          <Pressable
            accessibilityHint='Start your 7-day free trial'
            accessibilityLabel='Start 7-day free trial for premium'
            accessibilityRole='button'
            className='items-center px-5 py-4 shadow-[0px_8px_16px_rgba(109,40,217,0.25)]'
            style={({ pressed }) => ({ 
              opacity: pressed ? OPACITY.strong : OPACITY.full,
              borderRadius: 12,
            })}
            onPress={onUpgradePress}
          >
            <LinearGradient
              className='absolute inset-0'
              colors={['#7c3aed', '#4f46e5']}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
              style={{ borderRadius: 12 }}
            />
            <Text className='text-[17px] font-semibold text-white'>
              Start Free Trial →
            </Text>
          </Pressable>
          <Pressable
            accessibilityHint='Dismiss this upgrade prompt'
            accessibilityLabel='Dismiss upgrade prompt'
            accessibilityRole='button'
            className='items-center border-2 border-stone-200 bg-white/80 px-5 py-3'
            style={({ pressed }) => ({ 
              opacity: pressed ? OPACITY.high : OPACITY.full,
              borderRadius: 12,
            })}
            onPress={onClose}
          >
            <Text className='text-[15px] font-normal text-stone-600'>
              Maybe later
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
