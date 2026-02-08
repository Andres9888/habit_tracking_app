/**
 * LockedHabitCard Component
 * Animated upgrade prompt card for free tier limit
 */

import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

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
        <Text className='text-[22px]'>✨</Text>
        <View className='gap-1'>
          <Text className='text-center text-[17px] font-semibold text-stone-800'>
            Ready to unlock more?
          </Text>
          <Text className='text-center text-[13px] font-normal leading-[18px] text-stone-500'>
            Start a 7-day free trial to track unlimited habits and get
            AI-powered insights. No credit card required.
          </Text>
        </View>
      </View>
      <AnimatedPressable
        accessibilityLabel='Upgrade to unlock unlimited habits'
        accessibilityRole='button'
        className='items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 shadow-[0px_8px_16px_rgba(109,40,217,0.2)]'
        onPress={onUpgradePress}
      >
        <Text className='text-[17px] font-semibold text-white'>
          Start Free Trial
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
}
