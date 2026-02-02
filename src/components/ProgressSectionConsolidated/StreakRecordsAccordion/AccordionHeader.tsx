/**
 * AccordionHeader - Clickable header for accordion
 */

import React from 'react';
import { View, Text, Pressable, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

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
        {!isExpanded && hasRecords && (
          <Text className='text-xs text-stone-500'>{previewText}</Text>
        )}
      </View>
      <Animated.View style={chevronStyle}>
        <Ionicons color='#78716c' name='chevron-down' size={18} />
      </Animated.View>
    </Pressable>
  );
}
