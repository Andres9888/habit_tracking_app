/**
 * Blur overlay variant components: Feature lists
 */

import React from 'react';
import { View, Text } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { ANALYTICS_FEATURES } from './analyticsFeatures';
import { MOTIVATION_FEATURES } from './motivationFeatures';
import { colors } from '../../theme/colors';

interface MotivationFeatureListProps {
  triggeredByFeature?: string;
}

export function AnalyticsFeatureList() {
  return (
    <View className='mb-6'>
      {ANALYTICS_FEATURES.map((feature, index) => (
        <View
          key={index}
          className='mb-3 flex-row items-start rounded-xl bg-white/10 p-4'
        >
          <View className='mr-4 h-10 w-10 items-center justify-center rounded-xl bg-white/10'>
            <Ionicons
              color={colors.premium?.[600] ?? '#8b5cf6'}
              name={feature.icon}
              size={24}
            />
          </View>
          <View className='mr-2 flex-1'>
            <Text className='mb-0.5 text-base font-semibold text-white'>
              {feature.title}
            </Text>
            <Text className='text-sm text-white/60'>{feature.description}</Text>
          </View>
          <Ionicons
            color={colors.success ?? '#10b981'}
            name='checkmark-circle'
            size={20}
          />
        </View>
      ))}
    </View>
  );
}

export function MotivationFeatureList({
  triggeredByFeature,
}: MotivationFeatureListProps) {
  return (
    <View className='mb-6'>
      {MOTIVATION_FEATURES.map((feature) => (
        <View
          key={feature.id}
          className='mb-3 flex-row items-center rounded-xl bg-white/10 p-4'
          style={
            feature.id === triggeredByFeature
              ? { borderColor: '#10b981', borderWidth: 2 }
              : undefined
          }
        >
          <View className='mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/10'>
            <feature.icon color='#ffffff' size={20} />
          </View>
          <View className='flex-1'>
            <Text className='text-base font-semibold text-white'>
              {feature.title}
            </Text>
            <Text className='text-xs text-white/60'>{feature.subtitle}</Text>
          </View>
          <Ionicons color='#10b981' name='checkmark-circle' size={20} />
        </View>
      ))}
    </View>
  );
}
