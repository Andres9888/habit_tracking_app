/**
 * PromptList Component
 * Displays a list of guiding questions with an icon for each
 */

import React from 'react';
import { View, Text } from 'react-native';

import type { LucideIcon } from 'lucide-react-native';

interface PromptListProps {
  title: string;
  prompts: string[];
  Icon: LucideIcon;
  bgColor: string;
  titleColor: string;
  iconColor: string;
  textColor: string;
}

export function PromptList({
  title,
  prompts,
  Icon,
  bgColor,
  titleColor,
  iconColor,
  textColor,
}: PromptListProps) {
  return (
    <View className={`rounded-xl ${bgColor} p-4`}>
      <Text
        className={`mb-2 text-xs font-semibold uppercase tracking-wider ${titleColor}`}
      >
        {title}
      </Text>
      <View className='gap-2'>
        {prompts.map((prompt, index) => (
          <View key={index} className='flex-row items-center gap-2'>
            <Icon className={iconColor} size={14} />
            <Text className={`text-sm ${textColor}`}>{prompt}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
