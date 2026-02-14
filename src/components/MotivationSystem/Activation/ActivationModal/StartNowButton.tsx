import { triggerHaptic } from '@/utils/haptics';
import React, { useCallback, useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Play } from 'lucide-react-native';
import { SPRING_BUTTON } from './constants';

interface StartNowButtonProps {
  onPress: () => void;
  reduceMotion?: boolean;
}

/**
 * StartNowButton - Primary CTA with glow animation
 */
export function StartNowButton({
  onPress,
  reduceMotion = false,
}: StartNowButtonProps) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);

  // Pulsing glow effect
  useEffect(() => {
    if (reduceMotion) {
      glowOpacity.value = 0.5;
      return;
    }

    const pulseGlow = () => {
      glowOpacity.value = withTiming(0.8, { duration: 800 }, (finished) => {
        if (finished) {
          glowOpacity.value = withTiming(
            0.5,
            { duration: 800 },
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
      {/* Glow effect */}
      <Animated.View
        className='absolute -inset-2 rounded-2xl bg-emerald-400/30 blur-xl'
        style={glowAnimatedStyle}
      />
      <Pressable
        accessibilityLabel='Start habit now'
        accessibilityRole='button'
        className='flex-row items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-4'
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Play className='text-white' fill='white' size={20} />
        <Text className='text-lg font-bold text-white'>Start Now</Text>
      </Pressable>
    </Animated.View>
  );
}
