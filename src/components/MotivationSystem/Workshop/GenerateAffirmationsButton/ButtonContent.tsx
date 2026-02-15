/**
 * ButtonContent - Content rendered inside the generate button
 */

import React from 'react';
import { View, Text } from 'react-native';

import { Wand2, Crown, Check } from 'lucide-react-native';

import { SparkleAnimation } from './SparkleAnimation';

interface ButtonContentProps {
  isPremium: boolean;
  isGenerating: boolean;
  showSuccess: boolean;
  reduceMotion: boolean;
  size?: 'compact' | 'full';
}

export function ButtonContent({
  isPremium,
  isGenerating,
  showSuccess,
  reduceMotion,
  size = 'full',
}: ButtonContentProps) {
  const iconSize = size === 'compact' ? 14 : 20;

  if (isGenerating) {
    return (
      <>
        <SparkleAnimation reduceMotion={reduceMotion} />
        <Text className='font-semibold text-white'>
          {size === 'compact' ? 'Generating...' : 'Generating Affirmations...'}
        </Text>
      </>
    );
  }

  if (showSuccess) {
    return (
      <>
        <Check className='text-white' size={iconSize} />
        <Text className='font-semibold text-white'>
          {size === 'compact' ? 'Added!' : 'Affirmations Added!'}
        </Text>
      </>
    );
  }

  if (isPremium) {
    return (
      <>
        <Wand2 className='text-white' size={iconSize} />
        <Text className='font-semibold text-white'>
          {size === 'compact' ? 'AI Generate' : 'Generate with AI'}
        </Text>
      </>
    );
  }

  return (
    <>
      <Crown className='text-amber-500' size={iconSize} />
      <Text className='font-semibold text-stone-600'>
        {size === 'compact' ? 'PRO' : 'AI Generation'}
      </Text>
      {size === 'full' && (
        <View className='rounded-full bg-amber-100 px-2 py-0.5'>
          <Text className='text-xs font-bold text-amber-700'>PRO</Text>
        </View>
      )}
    </>
  );
}
