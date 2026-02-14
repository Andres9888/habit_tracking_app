/**
 * Social proof section shared across paywall variants
 * Avatar stack + star rating + user count
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { durations } from '../../theme/animations';

const AVATARS = ['🧑‍💻', '👩‍🎨', '🧑‍🏫', '👨‍⚕️', '👩‍🔬'];

function AvatarStack({ dark }: { dark: boolean }) {
  return (
    <View className="mb-2 flex-row items-center justify-center">
      {AVATARS.map((emoji, i) => (
        <View
          key={i}
          className={`h-8 w-8 items-center justify-center rounded-full border-2 ${
            dark ? 'border-stone-800 bg-stone-700' : 'border-white bg-stone-100'
          }`}
          style={{ marginLeft: i === 0 ? 0 : -8, zIndex: AVATARS.length - i }}
        >
          <Text className="text-sm">{emoji}</Text>
        </View>
      ))}
      <View
        className={`ml-[-8px] h-8 w-8 items-center justify-center rounded-full border-2 ${
          dark
            ? 'border-stone-800 bg-violet-900'
            : 'border-white bg-violet-100'
        }`}
        style={{ zIndex: 0 }}
      >
        <Text
          className={`text-[9px] font-bold ${
            dark ? 'text-violet-300' : 'text-violet-600'
          }`}
        >
          10K+
        </Text>
      </View>
    </View>
  );
}

export function SocialProofSection({ dark = false }: { dark?: boolean }) {
  return (
    <Animated.View
      className="mb-4 items-center"
      entering={FadeIn.duration(durations.enter).delay(200)}
    >
      <AvatarStack dark={dark} />
      <View className="flex-row items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className="text-amber-400" fill="#fbbf24" size={14} />
        ))}
        <Text
          className={`ml-1.5 text-xs font-medium ${
            dark ? 'text-white/70' : 'text-stone-600'
          }`}
        >
          4.8
        </Text>
      </View>
      <Text
        className={`mt-1 text-center text-xs ${
          dark ? 'text-white/50' : 'text-stone-500'
        }`}
      >
        Join 10,000+ people building lasting habits
      </Text>
    </Animated.View>
  );
}
