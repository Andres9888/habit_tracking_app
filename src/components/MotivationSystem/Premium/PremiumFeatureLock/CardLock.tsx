/**
 * CardLock Component
 * Standalone feature explanation card with upgrade CTA
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, ChevronRight, Sparkles } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import type { MotivationPremiumFeature } from './PremiumFeatureLock.types';
import { FEATURE_META } from './featureMetadata';

interface CardLockProps {
  feature: MotivationPremiumFeature;
  onUpgrade: () => void;
  showScience?: boolean;
  reduceMotion?: boolean;
  testID?: string;
}

export function CardLock({
  feature,
  onUpgrade,
  showScience = true,
  reduceMotion = false,
  testID,
}: CardLockProps) {
  const { triggerSelection } = useHapticFeedback({});
  const meta = FEATURE_META[feature];
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    triggerSelection();
    onUpgrade();
  }, [onUpgrade, triggerSelection]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.98, { duration: 100 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 100 });
  }, [scale]);

  return (
    <Pressable
      accessibilityHint='Tap to learn more about this premium feature'
      accessibilityLabel={`${meta.title} - Premium feature`}
      accessibilityRole='button'
      testID={testID}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className='overflow-hidden rounded-2xl border-2 border-violet-200'
        style={reduceMotion ? undefined : animatedStyle}
      >
        <LinearGradient
          className='absolute inset-0'
          colors={['#f5f3ff', '#ffffff']}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
        />
        <LinearGradient
          className='flex-row items-center gap-3 px-4 py-3'
          colors={['#8b5cf6', '#7c3aed']}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
        >
          <View className='h-10 w-10 items-center justify-center rounded-full bg-white/20'>
            <Crown color='#ffffff' size={20} />
          </View>
          <View className='flex-1'>
            <Text className='text-base font-bold text-white'>{meta.title}</Text>
            {meta.freeLimit && (
              <Text className='text-xs text-violet-100'>
                Free: {meta.freeLimit}
              </Text>
            )}
          </View>
          <View className='flex-row items-center gap-1'>
            <Text className='text-sm font-medium text-white'>Upgrade</Text>
            <ChevronRight color='#ffffff' size={16} />
          </View>
        </LinearGradient>

        <View className='px-4 py-3'>
          <Text className='mb-2 text-sm text-stone-600'>
            {meta.description}
          </Text>
          {showScience && (
            <View className='flex-row items-start gap-2 rounded-lg bg-amber-50 px-3 py-2'>
              <Sparkles className='mt-0.5 text-amber-500' size={14} />
              <Text className='flex-1 text-xs italic text-amber-700'>
                {meta.scienceBasis}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}
