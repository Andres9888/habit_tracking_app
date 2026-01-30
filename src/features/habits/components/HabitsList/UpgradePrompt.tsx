/**
 * UpgradePrompt Component
 * Modal overlay for upgrade CTA
 */

import { Pressable, Text, View } from 'react-native';

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
    <View className='absolute inset-0 z-20 items-center justify-end bg-stone-900/50'>
      <Pressable
        accessibilityLabel='Close upgrade prompt'
        accessibilityRole='button'
        className='absolute inset-0'
        onPress={onClose}
      />
      <View className='w-full rounded-t-3xl bg-gradient-to-b from-white to-amber-50/30 px-6 py-8'>
        <View className='gap-4'>
          <View className='items-center pb-2'>
            <Text className='text-[32px]'>🚀</Text>
          </View>
          <Text className='text-center text-[24px] font-bold tracking-tight text-stone-900'>
            You're on a roll! Ready for more?
          </Text>
          <Text className='text-center text-[13px] font-normal leading-[18px] text-stone-500'>
            Track unlimited habits across all areas of your life. Premium
            members build stronger routines and stay consistent 2× longer.
          </Text>
          <Pressable
            accessibilityLabel='Upgrade to premium'
            accessibilityRole='button'
            className='items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 shadow-[0px_8px_16px_rgba(109,40,217,0.25)]'
            onPress={onUpgradePress}
          >
            <Text className='text-[15px] font-semibold text-white'>
              ✨ Unlock unlimited habits
            </Text>
          </Pressable>
          <Pressable
            accessibilityLabel='Continue with free plan'
            accessibilityRole='button'
            className='items-center rounded-full border-2 border-stone-200 bg-white/80 px-5 py-3'
            onPress={onClose}
          >
            <Text className='text-[13px] font-normal text-stone-500'>
              Keep 3 habits free
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
