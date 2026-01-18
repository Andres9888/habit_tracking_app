/**
 * FeatureCheck - Animated feature list item for paywall
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { useFeatureAnimation } from './usePaywallAnimations';
import type { FeatureCheckProps } from './types';

export function FeatureCheck({
  icon: Icon,
  title,
  subtitle,
  isHighlighted,
  index,
  reduceMotion,
}: FeatureCheckProps) {
  const { animatedStyle } = useFeatureAnimation(index, reduceMotion);

  return (
    <Animated.View
      className={`mb-2 flex-row items-center gap-3 rounded-lg px-3 py-2 ${
        isHighlighted ? 'bg-violet-100/80' : 'bg-white/10'
      }`}
      style={reduceMotion ? undefined : animatedStyle}
    >
      <View
        className={`h-8 w-8 items-center justify-center rounded-lg ${
          isHighlighted ? 'bg-violet-200' : 'bg-white/20'
        }`}
      >
        <Icon color={isHighlighted ? '#7c3aed' : '#ffffff'} size={16} />
      </View>
      <View className='flex-1'>
        <Text
          className={`text-sm font-semibold ${
            isHighlighted ? 'text-violet-900' : 'text-white'
          }`}
        >
          {title}
        </Text>
        <Text
          className={`text-xs ${
            isHighlighted ? 'text-violet-600' : 'text-white/70'
          }`}
        >
          {subtitle}
        </Text>
      </View>
      <Check
        color={isHighlighted ? '#7c3aed' : '#10b981'}
        size={18}
        strokeWidth={2.5}
      />
    </Animated.View>
  );
}
