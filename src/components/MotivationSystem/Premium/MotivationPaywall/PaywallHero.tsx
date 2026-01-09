/**
 * PaywallHero - Hero section with crown icon and title
 */

import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown } from 'lucide-react-native';

export function PaywallHero() {
  return (
    <View className='mb-6 mt-4 items-center'>
      <LinearGradient
        className='mb-4 h-20 w-20 items-center justify-center rounded-3xl'
        colors={['#8b5cf6', '#7c3aed']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      >
        <Crown color='#ffffff' size={40} />
      </LinearGradient>

      <Text className='mb-2 text-center text-2xl font-bold text-white'>
        Unlock Premium Motivation
      </Text>
      <Text className='text-center text-base text-white/80'>
        Science-backed tools to help you build{'\n'}lasting habits
      </Text>
    </View>
  );
}
