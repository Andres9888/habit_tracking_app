import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Info } from 'lucide-react-native';

interface SectionHeaderProps {
  title: string;
  onInfoPress?: () => void;
}

/**
 * Section header with title and info icon button
 */
export function SectionHeader({ title, onInfoPress }: SectionHeaderProps) {
  return (
    <View className='flex-row items-center justify-between'>
      <Text className='text-base font-semibold text-stone-700'>{title}</Text>
      <Pressable
        accessible
        accessibilityLabel='Learn more about habit strength'
        accessibilityRole='button'
        hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
        testID='strength-history-info-button'
        onPress={onInfoPress}
      >
        <Info color='#78716c' size={18} />
      </Pressable>
    </View>
  );
}
