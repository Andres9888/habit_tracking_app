/**
 * SocialProof - User avatars and social proof section
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Flame } from 'lucide-react-native';

const AVATAR_INITIALS = ['J', 'M', 'K'];

export function SocialProof() {
  return (
    <View className='mb-6 flex-row items-center justify-center gap-2'>
      <View className='flex-row'>
        {AVATAR_INITIALS.map((initial, i) => (
          <View
            key={initial}
            className={`h-8 w-8 items-center justify-center rounded-full border-2 border-white/30 bg-violet-400 ${
              i > 0 ? '-ml-2' : ''
            }`}
          >
            <Text className='text-xs font-bold text-white'>{initial}</Text>
          </View>
        ))}
      </View>
      <View className='flex-row items-center gap-1'>
        <Flame color='#f59e0b' fill='#f59e0b' size={14} />
        <Text className='text-sm text-white/80'>
          10,000+ users building habits
        </Text>
      </View>
    </View>
  );
}
