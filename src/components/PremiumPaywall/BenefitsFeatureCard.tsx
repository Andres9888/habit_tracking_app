/**
 * Single feature card for benefits variant
 * Dark-mode aware, staggered entrance animation
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import type { MotivationFeatureItem } from './PremiumPaywall.types';

interface BenefitsFeatureCardProps {
  feature: MotivationFeatureItem;
  isHighlighted: boolean;
  index: number;
  reduceMotion: boolean;
}

const STAGGER_MS = 60;
const MAX_STAGGER = 5;

export function BenefitsFeatureCard({
  feature,
  isHighlighted,
  index,
  reduceMotion,
}: BenefitsFeatureCardProps) {
  const { colors } = useThemeColors();

  const entering = reduceMotion
    ? undefined
    : FadeInDown.delay(Math.min(index, MAX_STAGGER) * STAGGER_MS).duration(280);

  return (
    <Animated.View entering={entering}>
      <View
        className='mb-3 rounded-xl p-4'
        style={{
          backgroundColor: colors.card,
          borderWidth: isHighlighted ? 2 : 1,
          borderColor: isHighlighted
            ? (feature.accentColor ?? colors.primary[500])
            : colors.cardBorder,
        }}
      >
        <View className='mb-2 flex-row items-center gap-3'>
          <View
            className='h-10 w-10 items-center justify-center rounded-full'
            style={{ backgroundColor: `${feature.accentColor ?? '#8b5cf6'}20` }}
          >
            <feature.icon color={feature.accentColor ?? '#8b5cf6'} size={20} />
          </View>
          <View className='flex-1'>
            <Text
              className='text-base font-semibold'
              style={{ color: colors.text.primary }}
            >
              {feature.title}
            </Text>
            <Text
              className='text-xs'
              style={{ color: colors.text.secondary }}
            >
              {feature.description}
            </Text>
          </View>
        </View>
        {feature.scienceFact && (
          <View
            className='mt-1 rounded-lg px-3 py-1.5'
            style={{ backgroundColor: colors.gray[100] }}
          >
            <Text
              className='text-xs italic'
              style={{ color: colors.text.tertiary }}
            >
              📊 {feature.scienceFact}
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}
