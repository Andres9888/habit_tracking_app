/**
 * Feature row component for premium benefits list
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Check, Sparkles, Star } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import type { PremiumFeature } from './premiumFeatures';

interface FeatureRowProps {
  feature: PremiumFeature;
  isHighlighted: boolean;
  index: number;
  reduceMotion: boolean;
}

export function FeatureRow({
  feature,
  isHighlighted,
  index,
  reduceMotion,
}: FeatureRowProps) {
  const Icon = feature.icon;
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }
    const delay = index * 80;
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    }, delay);
    return () => clearTimeout(timer);
  }, [index, opacity, translateY, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      className={`mb-3 overflow-hidden rounded-xl border ${
        isHighlighted
          ? 'border-violet-300 bg-violet-50'
          : 'border-stone-200 bg-white'
      }`}
      style={reduceMotion ? undefined : animatedStyle}
    >
      {isHighlighted && (
        <View className='flex-row items-center gap-1 bg-violet-100 px-3 py-1'>
          <Star className='text-violet-600' fill='#7c3aed' size={12} />
          <Text className='text-xs font-semibold text-violet-700'>
            You tried to use this feature
          </Text>
        </View>
      )}
      <View className='flex-row items-start gap-3 p-3'>
        <View
          className='h-10 w-10 items-center justify-center rounded-xl'
          style={{ backgroundColor: `${feature.accentColor}20` }}
        >
          <Icon color={feature.accentColor} size={20} />
        </View>
        <View className='flex-1'>
          <Text className='mb-0.5 text-sm font-semibold text-stone-800'>
            {feature.title}
          </Text>
          <Text className='mb-2 text-xs text-stone-500'>
            {feature.description}
          </Text>
          <View className='flex-row items-center gap-3'>
            <View className='flex-row items-center gap-1'>
              <View className='h-1.5 w-1.5 rounded-full bg-stone-300' />
              <Text className='text-xs text-stone-400'>
                {feature.freeLimit}
              </Text>
            </View>
            <View className='flex-row items-center gap-1'>
              <Check className='text-emerald-500' size={12} />
              <Text className='text-xs font-medium text-emerald-600'>
                {feature.premiumValue}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className='flex-row items-center gap-2 border-t border-stone-100 bg-stone-50 px-3 py-2'>
        <Sparkles className='text-amber-500' size={12} />
        <Text className='flex-1 text-[10px] italic text-stone-500'>
          {feature.scienceFact}
        </Text>
      </View>
    </Animated.View>
  );
}
