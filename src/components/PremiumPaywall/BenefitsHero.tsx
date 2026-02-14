/**
 * Benefits variant hero component
 * Crown icon + gradient background
 */

import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { VariantConfig } from './PremiumPaywall.types';
import { durations } from '../../theme/animations';

export function BenefitsHero({ config }: { config: VariantConfig }) {
  return (
    <LinearGradient
      className="px-4 py-6"
      colors={[config.gradientColors[0], config.gradientColors[1]]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
    >
      <Animated.View
        className="items-center"
        entering={FadeInDown.duration(durations.enter).damping(18)}
      >
        <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <Crown color="#ffffff" size={24} />
        </View>
        <Text className="mb-1 text-center text-xl font-bold text-white">
          {config.heroTitle}
        </Text>
        <Text className="text-center text-sm text-violet-100">
          {config.heroSubtitle}
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}
