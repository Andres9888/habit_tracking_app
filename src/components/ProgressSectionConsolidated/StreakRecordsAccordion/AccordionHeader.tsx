/**
 * AccordionHeader - Clickable header for accordion
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

interface AccordionHeaderProps {
  isExpanded: boolean;
  hasRecords: boolean;
  previewText: string;
  chevronStyle: AnimatedStyle<ViewStyle>;
  onToggle: () => void;
}

export function AccordionHeader({
  isExpanded,
  hasRecords,
  previewText,
  chevronStyle,
  onToggle,
}: AccordionHeaderProps) {
  return (
    <Pressable
      accessibilityHint={`Double tap to ${isExpanded ? 'collapse' : 'expand'} streak records`}
      accessibilityRole='button'
      accessibilityState={{ expanded: isExpanded }}
      className='flex-row items-center justify-between p-3'
      onPress={onToggle}
    >
      <View className='flex-row items-center gap-2'>
        <Text className='text-sm font-medium text-stone-700'>
          Streak Records
        </Text>
        {!isExpanded && hasRecords ? <Text className='text-xs text-stone-500'>{previewText}</Text> : null}
      </View>
      <Animated.View style={chevronStyle}>
        <ChevronDown color='#78716c' size={18} />
      </Animated.View>
    </Pressable>
  );
}
