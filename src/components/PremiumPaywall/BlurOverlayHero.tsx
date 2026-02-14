/**
 * Blur overlay variant: Hero section
 * Icon + animated entrance
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { VariantConfig } from './PremiumPaywall.types';
import { durations } from '../../theme/animations';

export function BlurOverlayHero({ config }: { config: VariantConfig }) {
  return (
    <Animated.View
      className="mb-6 mt-4 items-center"
      entering={FadeInDown.duration(durations.enter).damping(18)}
    >
      <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-white/15">
        <Sparkles color="#ffffff" size={28} />
      </View>
      <Text className="mb-2 text-center text-2xl font-bold text-white">
        {config.heroTitle}
      </Text>
      <Text className="text-center text-base text-white/70">
        {config.heroSubtitle}
      </Text>
    </Animated.View>
  );
}
