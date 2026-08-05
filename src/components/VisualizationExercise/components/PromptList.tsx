/**
 * PromptList Component
 * Displays a list of guiding questions with an icon for each
 */

import React from 'react';
import { View, Text } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

interface PromptListProps {
  title: string;
  prompts: string[];
  Icon: LucideIcon;
  bgColorValue: string;
  titleColorValue: string;
  iconColorValue: string;
  textColorValue: string;
}

export function PromptList({
  title,
  prompts,
  Icon,
  bgColorValue,
  titleColorValue,
  iconColorValue,
  textColorValue,
}: PromptListProps) {
  return (
    <View className='rounded-xl p-4' style={{ backgroundColor: bgColorValue }}>
      <Text
        className='mb-2 text-xs font-semibold uppercase tracking-wider'
        style={{ color: titleColorValue }}
      >
        {title}
      </Text>
      <View className='gap-2'>
        {prompts.map((prompt, index) => (
          <View key={index} className='flex-row items-center gap-2'>
            <Icon color={iconColorValue} size={iconSizes.small} />
            <Text className='text-sm' style={{ color: textColorValue }}>{prompt}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
