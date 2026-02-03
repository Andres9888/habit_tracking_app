/**
 * PricingCard - Subscription pricing display
 */

import React from 'react';
import { View, Text } from 'react-native';

export function PricingCard() {
  return (
    <View className='mb-4 overflow-hidden rounded-2xl border-2 border-violet-400/50 bg-white/10'>
      <View className='items-center px-4 py-4'>
        <Text className='mb-1 text-xs font-semibold uppercase tracking-wide text-violet-300'>
          Premium Subscription
        </Text>
        <View className='flex-row items-baseline gap-1'>
          <Text className='text-3xl font-bold text-white'>$6.99</Text>
          <Text className='text-base text-white/70'>/month</Text>
        </View>
        <Text className='mt-1 text-sm text-white/60'>
          7-day free trial • Auto-renews at $6.99/month • Cancel anytime
        </Text>
      </View>
    </View>
  );
}
