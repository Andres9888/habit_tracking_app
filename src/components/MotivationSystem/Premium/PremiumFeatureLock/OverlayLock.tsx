/**
 * OverlayLock Component
 * Full overlay on locked content area with upgrade CTA
 */

import React, { useCallback, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Crown, ChevronRight, Sparkles } from 'lucide-react-native';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import type { MotivationPremiumFeature } from './PremiumFeatureLock.types';
import { FEATURE_META } from './featureMetadata';

interface OverlayLockProps {
  feature: MotivationPremiumFeature;
  onUpgrade: () => void;
  showScience?: boolean;
  reduceMotion?: boolean;
  testID?: string;
}

export function OverlayLock({
  feature,
  onUpgrade,
  showScience = false,
  reduceMotion = false,
  testID,
}: OverlayLockProps) {
  const { triggerSelection } = useHapticFeedback({});
  const meta = FEATURE_META[feature];
  const shimmerPosition = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    shimmerPosition.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [shimmerPosition, reduceMotion]);

  const handlePress = useCallback(() => {
    triggerSelection();
    onUpgrade();
  }, [onUpgrade, triggerSelection]);

  return (
    <View
      className='absolute inset-0 items-center justify-center rounded-xl bg-stone-900/60 px-4 py-6'
      testID={testID}
    >
      <View className='mb-4 items-center'>
        <View className='absolute h-16 w-16 rounded-full bg-violet-500/30' />
        <View className='h-14 w-14 items-center justify-center rounded-full bg-violet-100'>
          <Lock className='text-violet-600' size={28} />
        </View>
      </View>

      <Text className='mb-1 text-center text-lg font-bold text-white'>
        {meta.title}
      </Text>
      <Text className='mb-4 text-center text-sm text-stone-200'>
        {meta.description}
      </Text>

      {showScience && (
        <View className='mb-4 flex-row items-start gap-2 rounded-lg bg-white/10 px-3 py-2'>
          <Sparkles className='mt-0.5 text-amber-300' size={14} />
          <Text className='flex-1 text-xs italic text-stone-200'>
            {meta.scienceBasis}
          </Text>
        </View>
      )}

      <Pressable
        accessibilityHint='Opens premium subscription options'
        accessibilityLabel='Unlock with Premium'
        accessibilityRole='button'
        className='w-full'
        onPress={handlePress}
      >
        <LinearGradient
          className='flex-row items-center justify-center gap-2 rounded-xl px-6 py-3'
          colors={['#8b5cf6', '#7c3aed']}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
        >
          <Crown color='#ffffff' size={18} />
          <Text className='text-base font-semibold text-white'>
            Unlock with Premium
          </Text>
          <ChevronRight color='#ffffff' size={18} />
        </LinearGradient>
      </Pressable>

      {meta.freeLimit && (
        <Text className='mt-2 text-center text-xs text-stone-300'>
          Free tier: {meta.freeLimit}
        </Text>
      )}
    </View>
  );
}
