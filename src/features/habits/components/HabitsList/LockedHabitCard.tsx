/**
 * LockedHabitCard Component
 * Animated upgrade prompt card for free tier limit
 */

import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';

interface LockedHabitCardProps {
  onUpgradePress: () => void;
  reduceMotion?: boolean;
}

export function LockedHabitCard({
  onUpgradePress,
  reduceMotion = false,
}: LockedHabitCardProps) {
  const scale = useRef(new Animated.Value(0.94)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) {
      scale.setValue(1);
      opacity.setValue(1);
      return;
    }
    Animated.parallel([
      Animated.spring(scale, {
        damping: 12,
        stiffness: 140,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        duration: 260,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale, reduceMotion]);

  return (
    <Animated.View
      className='gap-4 rounded-3xl border border-dashed border-violet-200 bg-gradient-to-b from-violet-50/80 to-amber-50/40 p-5'
      style={{ opacity, transform: [{ scale }] }}
    >
      <View className='items-center gap-2'>
        <Text className='text-[24px]'>✨</Text>
        <View className='gap-1'>
          <Text className='text-center text-[17px] font-semibold text-stone-800'>
            Want to add more habits?
          </Text>
          <Text className='text-center text-[13px] font-normal leading-[18px] text-stone-500'>
            Track unlimited habits, get smart reminders, and unlock deeper
            insights to build stronger routines.
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityLabel='Upgrade to unlock unlimited habits'
        accessibilityRole='button'
        className='items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 shadow-[0px_8px_16px_rgba(109,40,217,0.2)]'
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        onPress={onUpgradePress}
      >
        <Text className='text-[15px] font-semibold text-white'>
          ✨ Upgrade to Premium
        </Text>
      </Pressable>
    </Animated.View>
  );
}
