/**
 * AccordionHeader - Clickable header for accordion
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../../theme/ThemeContext';

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
  const { colors } = useThemeColors();
  
  return (
    <Pressable
      accessibilityHint={`Double tap to ${isExpanded ? 'collapse' : 'expand'} streak records`}
      accessibilityRole='button'
      accessibilityState={{ expanded: isExpanded }}
      className='flex-row items-center justify-between p-3'
      onPress={onToggle}
    >
      <View className='flex-row items-center gap-2'>
        <Text 
          className='text-sm font-medium'
          style={{ color: colors.text.primary }}
        >
          Streak Records
        </Text>
        {!isExpanded && hasRecords && (
          <Text 
            className='text-xs'
            style={{ color: colors.text.tertiary }}
          >
            {previewText}
          </Text>
        )}
      </View>
      <Animated.View style={chevronStyle}>
        <Ionicons color={colors.text.secondary} name='chevron-down' size={18} />
      </Animated.View>
    </Pressable>
  );
}
