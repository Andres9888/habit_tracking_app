/**
 * UpgradePrompt Component
 * Modal overlay for upgrade CTA — optimized for trial conversion
 */

import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

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
      entering={FadeIn.duration(280)}
      className='absolute inset-0 z-20 items-center justify-end bg-stone-900/50'
    >
      <Pressable
        accessibilityLabel='Close upgrade prompt'
        accessibilityRole='button'
        className='absolute inset-0'
        onPress={onClose}
      />
      <Animated.View
        entering={SlideInDown.duration(280).damping(18)}
        className='w-full rounded-t-3xl bg-gradient-to-b from-white to-amber-50/30 px-6 py-8'
      >
        <View className='gap-4'>
          <View className='items-center pb-2'>
            <Text className='text-[32px]'>🚀</Text>
          </View>
          <Text className='text-center text-[24px] font-bold tracking-tight text-stone-900'>
            You're on a roll! Ready for more?
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
            accessibilityLabel='Start 7-day free trial for premium'
            accessibilityRole='button'
            className='items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 shadow-[0px_8px_16px_rgba(109,40,217,0.25)]'
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            onPress={onUpgradePress}
          >
            <Text className='text-[17px] font-semibold text-white'>
              Start Free Trial →
            </Text>
          </Pressable>
          <Pressable
            accessibilityLabel='Dismiss upgrade prompt'
            accessibilityRole='button'
            className='items-center rounded-full border-2 border-stone-200 bg-white/80 px-5 py-3'
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
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
