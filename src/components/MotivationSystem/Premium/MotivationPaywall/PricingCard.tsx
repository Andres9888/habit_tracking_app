/**
 * PricingCard - Subscription pricing display
 */

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { usePremium } from '../../../../hooks/usePremium';

export function PricingCard() {
  const { priceString, isLoadingOfferings } = usePremium();

  return (
    <View className='mb-4 overflow-hidden rounded-2xl border-2 border-violet-400/50 bg-white/10'>
      <View className='items-center px-4 py-4'>
        <Text className='mb-1 text-xs font-semibold uppercase tracking-wide text-violet-300'>
          Premium Subscription
        </Text>
        <View className='flex-row items-baseline gap-1'>
          {isLoadingOfferings ? (
            <ActivityIndicator color='#ffffff' size='small' />
          ) : (
            <>
              <Text className='text-3xl font-bold text-white'>
                {priceString ?? '$6.99'}
              </Text>
              <Text className='text-base text-white/70'>/month</Text>
            </>
          )}
        </View>
        <Text className='mt-1 text-sm text-white/80'>
          7-day free trial • Then {priceString ?? '$6.99'}/month • Cancel
          anytime
        </Text>
      </View>
    </View>
  );
}
