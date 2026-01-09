/**
 * Hero section component for PremiumBenefitsModal
 */

import React from 'react';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function HeroSection() {
  return (
    <LinearGradient
      className='px-4 py-5'
      colors={['#8b5cf6', '#7c3aed']}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
    >
      <Text className='mb-1 text-center text-xl font-bold text-white'>
        Unlock Your Full Motivation Toolkit
      </Text>
      <Text className='text-center text-sm text-violet-100'>
        Science-backed features proven to increase habit retention by 3x
      </Text>
    </LinearGradient>
  );
}
