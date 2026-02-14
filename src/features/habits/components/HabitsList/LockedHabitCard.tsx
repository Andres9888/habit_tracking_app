/**
 * LockedHabitCard Component
 * Animated upgrade prompt card for free tier limit
 */

import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const INITIAL_CARD_SCALE = 0.94;
const VISIBLE_OPACITY = 1;
const HIDDEN_OPACITY = 0;
const SPRING_DAMPING = 12;
const SPRING_STIFFNESS = 140;
const CARD_FADE_IN_DURATION_MS = 260;
const BUTTON_PRESSED_SCALE = 0.97;
const PRESS_SPRING_DAMPING = 18;
const PRESS_SPRING_STIFFNESS = 240;

interface LockedHabitCardProps {
  onUpgradePress: () => void;
  reduceMotion?: boolean;
}

export function LockedHabitCard({
  onUpgradePress,
  reduceMotion = false,
}: LockedHabitCardProps) {
  const entranceScale = useRef(new Animated.Value(INITIAL_CARD_SCALE)).current;
  const opacity = useRef(new Animated.Value(HIDDEN_OPACITY)).current;
  const pressScale = useRef(new Animated.Value(VISIBLE_OPACITY)).current;

  useEffect(() => {
    if (reduceMotion) {
      entranceScale.setValue(VISIBLE_OPACITY);
      opacity.setValue(VISIBLE_OPACITY);
      return;
    }
    Animated.parallel([
      Animated.spring(entranceScale, {
        damping: SPRING_DAMPING,
        stiffness: SPRING_STIFFNESS,
        toValue: VISIBLE_OPACITY,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        duration: CARD_FADE_IN_DURATION_MS,
        easing: Easing.out(Easing.cubic),
        toValue: VISIBLE_OPACITY,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, entranceScale, reduceMotion]);

  const handlePressIn = () => {
    if (reduceMotion) {
      pressScale.setValue(BUTTON_PRESSED_SCALE);
      return;
    }
    Animated.spring(pressScale, {
      damping: PRESS_SPRING_DAMPING,
      stiffness: PRESS_SPRING_STIFFNESS,
      toValue: BUTTON_PRESSED_SCALE,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (reduceMotion) {
      pressScale.setValue(VISIBLE_OPACITY);
      return;
    }
    Animated.spring(pressScale, {
      damping: PRESS_SPRING_DAMPING,
      stiffness: PRESS_SPRING_STIFFNESS,
      toValue: VISIBLE_OPACITY,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      accessibilityLabel='Upgrade to unlock unlimited habits'
      accessibilityRole='button'
      onPress={onUpgradePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className='gap-4 rounded-3xl border border-dashed border-violet-200 p-5'
        style={{
          opacity,
          transform: [{ scale: entranceScale }, { scale: pressScale }],
        }}
      >
        <LinearGradient
          className='absolute inset-0 rounded-3xl'
          colors={['rgba(245, 243, 255, 0.8)', 'rgba(255, 251, 235, 0.4)']}
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
        <View className='items-center rounded-full px-5 py-3 shadow-[0px_8px_16px_rgba(109,40,217,0.2)]'>
          <LinearGradient
            className='absolute inset-0 rounded-full'
            colors={['#7c3aed', '#4f46e5']}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
          />
          <Text className='text-[15px] font-semibold text-white'>
            Start Free Trial
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}
