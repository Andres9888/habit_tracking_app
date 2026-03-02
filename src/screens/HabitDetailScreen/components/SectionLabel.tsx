/**
 * SectionLabel - Divider with centered text label.
 * Used between sections in the habit detail screen.
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface SectionLabelProps {
  borderColor: string;
  delay: number;
  text: string;
  textColor: string;
}

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function SectionLabel({
  borderColor,
  delay,
  text,
  textColor,
}: SectionLabelProps) {
  return (
    <Animated.View
      className='mb-3 mt-6 flex-row items-center justify-center gap-2'
      entering={anim(delay)}
    >
      <View className='h-px flex-1' style={{ backgroundColor: borderColor }} />
      <Text
        className='text-[13px] font-semibold tracking-wider'
        style={{ color: textColor }}
      >
        {text}
      </Text>
      <View className='h-px flex-1' style={{ backgroundColor: borderColor }} />
    </Animated.View>
  );
}
