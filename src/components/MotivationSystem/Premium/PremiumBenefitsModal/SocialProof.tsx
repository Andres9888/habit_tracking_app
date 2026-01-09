/**
 * Social proof component for PremiumBenefitsModal
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';

export function SocialProof() {
  return (
    <View className='mb-4 mt-2 items-center'>
      <View className='flex-row items-center gap-1'>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className='text-amber-400' fill='#fbbf24' size={14} />
        ))}
      </View>
      <Text className='mt-1 text-center text-xs text-stone-500'>
        Trusted by 10,000+ users building lasting habits
      </Text>
    </View>
  );
}
