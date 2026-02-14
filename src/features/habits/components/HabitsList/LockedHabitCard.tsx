/**
 * LockedHabitCard Component
 * Animated upgrade prompt card for free tier limit
 */

import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
      className='gap-4 rounded-3xl border border-dashed border-violet-200 p-5'
      style={{ opacity, transform: [{ scale }] }}
    >
      <LinearGradient
        colors={['rgba(245, 243, 255, 0.8)', 'rgba(255, 251, 235, 0.4)']}
        className='absolute inset-0 rounded-3xl'
      />
      <View className='items-center gap-2'>
        <Text className='text-[24px]'>✨</Text>
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
      <Pressable
        accessibilityLabel='Upgrade to unlock unlimited habits'
        accessibilityRole='button'
        className='items-center rounded-full px-5 py-3 shadow-[0px_8px_16px_rgba(109,40,217,0.2)]'
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        onPress={onUpgradePress}
      >
        <LinearGradient
          colors={['#7c3aed', '#4f46e5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className='absolute inset-0 rounded-full'
        />
        <Text className='text-[15px] font-semibold text-white'>
          Start Free Trial
        </Text>
      </Pressable>
    </Animated.View>
  );
}
