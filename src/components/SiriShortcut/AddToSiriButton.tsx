/**
 * AddToSiriButton - Native-feeling "Add to Siri" button for habit detail screens.
 *
 * Matches ChainDay's design system: 16px radius, springify animation,
 * emerald accent, SF Pro typography.
 */
import React, { useCallback } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { presentAddToSiri, isSiriAvailable } from '../../services/siri';

interface AddToSiriButtonProps {
  habitId: string;
  habitName: string;
  habitEmoji?: string;
  /** Animation delay in ms (for staggered entry) */
  delay?: number;
}

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

/**
 * Renders an "Add to Siri" button that presents the native Siri voice
 * shortcut configuration sheet. Only renders on iOS when the native
 * module is available.
 */
export function AddToSiriButton({
  habitId,
  habitName,
  habitEmoji,
  delay = 480,
}: AddToSiriButtonProps) {
  const handlePress = useCallback(() => {
    presentAddToSiri(habitId, habitName, habitEmoji);
  }, [habitId, habitName, habitEmoji]);

  // Only show on iOS with Siri support
  if (Platform.OS !== 'ios' || !isSiriAvailable()) {
    return null;
  }

  return (
    <Animated.View className='mt-6' entering={anim(delay)}>
      <TouchableOpacity
        activeOpacity={0.7}
        className='flex-row items-center justify-center rounded-xl bg-stone-900 px-6 py-3.5'
        style={{
          elevation: 4,
          shadowColor: '#1c1917',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
        }}
        onPress={handlePress}
      >
        <View className='mr-2.5'>
          <Text className='text-[18px]'>🗣️</Text>
        </View>
        <View>
          <Text className='text-[15px] font-semibold text-white'>
            Add to Siri
          </Text>
          <Text className='text-[11px] text-stone-400'>
            &ldquo;Hey Siri, I did my {habitName.toLowerCase()}&rdquo;
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
