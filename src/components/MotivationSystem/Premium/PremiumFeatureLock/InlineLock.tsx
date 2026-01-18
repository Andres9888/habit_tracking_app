/**
 * InlineLock Component
 * Minimal PRO badge shown next to feature titles
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';

interface InlineLockProps {
  onUpgrade: () => void;
  reduceMotion?: boolean;
  testID?: string;
}

export function InlineLock({
  onUpgrade,
  reduceMotion = false,
  testID,
}: InlineLockProps) {
  const { triggerLightImpact } = useHapticFeedback({});
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    triggerLightImpact();
    onUpgrade();
  }, [onUpgrade, triggerLightImpact]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.95, { duration: 100 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 100 });
  }, [scale]);

  return (
    <Pressable
      accessibilityHint='Tap to upgrade to premium'
      accessibilityLabel='Premium feature'
      accessibilityRole='button'
      testID={testID}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={reduceMotion ? undefined : animatedStyle}>
        <LinearGradient
          className='flex-row items-center gap-1 rounded-full px-2 py-0.5'
          colors={['#8b5cf6', '#7c3aed']}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
        >
          <Lock color='#ffffff' size={10} strokeWidth={2.5} />
          <Text className='text-[10px] font-bold uppercase tracking-wide text-white'>
            PRO
          </Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}
