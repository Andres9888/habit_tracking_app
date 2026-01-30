/**
 * InfoSection Component
 *
 * Educational info card with icon, title, and description.
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface InfoSectionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
  delay: number;
}

export function InfoSection({
  icon,
  title,
  description,
  color,
  delay,
}: InfoSectionProps) {
  return (
    <Animated.View
      className='flex-row items-start gap-3 rounded-2xl bg-white/80 p-4'
      entering={FadeInDown.delay(delay).duration(400)}
    >
      <View
        className='h-10 w-10 items-center justify-center rounded-xl'
        style={{ backgroundColor: `${color}15` }}
      >
        <Ionicons color={color} name={icon} size={20} />
      </View>
      <View className='flex-1'>
        <Text className='mb-1 text-base font-semibold text-stone-800'>
          {title}
        </Text>
        <Text className='text-sm leading-5 text-stone-600'>{description}</Text>
      </View>
    </Animated.View>
  );
}

export default InfoSection;
