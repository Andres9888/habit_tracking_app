/**
 * Social proof section shared across paywall variants
 */

import React from 'react';
import { View, Text } from 'react-native';

import { Star } from 'lucide-react-native';

export function SocialProofSection({ dark = false }: { dark?: boolean }) {
  return (
    <View className='mb-4 items-center'>
      <View className='flex-row items-center gap-1'>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className='text-amber-400' fill='#fbbf24' size={14} />
        ))}
      </View>
      <Text
        className={`mt-1 text-center text-xs ${dark ? 'text-white/50' : 'text-stone-500'}`}
      >
        Loved by 10,000+ people building lasting habits
      </Text>
    </View>
  );
}
