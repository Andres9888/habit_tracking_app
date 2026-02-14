/**
 * Single feature card for benefits variant
 * Staggered entrance animation + highlighted glow
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { MotivationFeatureItem } from './PremiumPaywall.types';
import { durations } from '../../theme/animations';

interface BenefitsFeatureCardProps {
  feature: MotivationFeatureItem;
  isHighlighted: boolean;
  index?: number;
}

export function BenefitsFeatureCard({
  feature,
  isHighlighted,
  index = 0,
}: BenefitsFeatureCardProps) {
  const staggerDelay = Math.min(index, 4) * durations.stagger;

  return (
    <Animated.View
      className={`mb-3 rounded-xl border p-4 ${
        isHighlighted
          ? 'border-2 bg-violet-50/50'
          : 'border-stone-200 bg-white'
      }`}
      entering={FadeInDown.duration(durations.enter)
        .delay(staggerDelay)
        .damping(18)}
      style={
        isHighlighted
          ? { borderColor: feature.accentColor }
          : undefined
      }
    >
      <View className="mb-2 flex-row items-center gap-3">
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: `${feature.accentColor}20` }}
        >
          <feature.icon color={feature.accentColor ?? '#8b5cf6'} size={20} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-stone-800">
            {feature.title}
          </Text>
          <Text className="text-xs text-stone-500">{feature.description}</Text>
        </View>
      </View>
      {feature.scienceFact && (
        <View className="mt-1 rounded-lg bg-stone-50 px-3 py-2">
          <Text className="text-xs italic text-stone-400">
            📊 {feature.scienceFact}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}
