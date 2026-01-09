/**
 * CTAButton - Primary call-to-action button with glow effect
 */

import React from 'react';
import { Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { useGlowAnimation, useButtonAnimation } from './usePaywallAnimations';

interface CTAButtonProps {
  visible: boolean;
  reduceMotion: boolean;
  isProcessing: boolean;
  onPress: () => void;
}

export function CTAButton({
  visible,
  reduceMotion,
  isProcessing,
  onPress,
}: CTAButtonProps) {
  const { glowAnimatedStyle } = useGlowAnimation(visible, reduceMotion);
  const { buttonAnimatedStyle, handlePressIn, handlePressOut } =
    useButtonAnimation(reduceMotion);

  return (
    <Pressable
      accessibilityHint='Opens subscription purchase flow'
      accessibilityLabel='Start 7-Day Free Trial'
      accessibilityRole='button'
      disabled={isProcessing}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Glow effect */}
      <Animated.View
        className='absolute inset-0 rounded-xl bg-violet-500'
        style={[
          reduceMotion ? undefined : glowAnimatedStyle,
          { transform: [{ scale: 1.05 }] },
        ]}
      />

      <Animated.View style={reduceMotion ? undefined : buttonAnimatedStyle}>
        <LinearGradient
          className='flex-row items-center justify-center gap-2 rounded-xl py-4'
          colors={['#8b5cf6', '#7c3aed']}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
        >
          <Text className='text-lg font-bold text-white'>
            {isProcessing ? 'Processing...' : 'Start 7-Day Free Trial'}
          </Text>
          {!isProcessing && <ChevronRight color='#ffffff' size={20} />}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}
