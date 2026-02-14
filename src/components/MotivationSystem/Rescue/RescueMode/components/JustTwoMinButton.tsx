import { triggerHaptic } from '@/utils/haptics';
import React, { useCallback, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap } from 'lucide-react-native';

import { SPRING_BUTTON } from '../RescueMode.constants';

interface JustTwoMinButtonProps {
  onPress: () => void;
  reduceMotion?: boolean;
}

/**
 * JustTwoMinButton - Primary CTA with urgent styling and glow
 */
export function JustTwoMinButton({
  onPress,
  reduceMotion = false,
}: JustTwoMinButtonProps) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);

  // Pulsing glow effect
  useEffect(() => {
    if (reduceMotion) {
      glowOpacity.value = 0.5;
      return;
    }

    const pulseGlow = () => {
      glowOpacity.value = withTiming(0.9, { duration: 700 }, (finished) => {
        if (finished) {
          glowOpacity.value = withTiming(
            0.5,
            { duration: 700 },
            (finished2) => {
              if (finished2) {
                runOnJS(pulseGlow)();
              }
            }
          );
        }
      });
    };

    pulseGlow();
  }, [reduceMotion, glowOpacity]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, SPRING_BUTTON);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BUTTON);
  }, [scale]);

  const handlePress = useCallback(() => {
    triggerHaptic('toggle');
    onPress();
  }, [onPress]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View className='relative' style={buttonAnimatedStyle}>
      {/* Glow effect - amber for urgency */}
      <Animated.View
        className='absolute -inset-2 rounded-2xl bg-amber-400/40 blur-xl'
        style={glowAnimatedStyle}
      />
      <Pressable
        accessibilityHint='Start with a tiny commitment to save your streak'
        accessibilityLabel='Just do 2 minutes'
        accessibilityRole='button'
        className='flex-row items-center justify-center gap-3 rounded-xl px-8 py-5'
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient
          className='absolute inset-0 rounded-xl'
          colors={['#f59e0b', '#f97316']}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
        />
        <Zap className='text-white' fill='white' size={24} />
        <View>
          <Text className='text-xl font-bold text-white'>
            Just Do 2 Minutes
          </Text>
          <Text className='text-center text-sm text-amber-100'>
            That's all it takes to save your streak
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
