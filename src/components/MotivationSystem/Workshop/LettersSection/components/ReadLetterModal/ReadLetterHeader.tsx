/**
 * ReadLetterHeader Component
 * Header for the read letter modal with animated envelope
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { MailOpen, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../../../../../theme/ThemeContext';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

interface ReadLetterHeaderProps {
  title: string | undefined;
  envelopeAnimatedStyle: AnimatedStyle<ViewStyle>;
  onClose: () => void;
}

export function ReadLetterHeader({
  title,
  envelopeAnimatedStyle,
  onClose,
}: ReadLetterHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View className='flex-row items-center justify-between px-4 pb-4 pt-14'>
      <View className='flex-1' />
      <View className='flex-row items-center gap-2'>
        <Animated.View style={envelopeAnimatedStyle}>
          <View className='h-10 w-10 items-center justify-center rounded-xl bg-violet-100'>
            <MailOpen className='text-violet-600' size={24} />
          </View>
        </Animated.View>
        <Text className='text-lg font-bold' style={{ color: colors.text.primary }}>
          {title || 'Letter from Past Self'}
        </Text>
      </View>
      <View className='flex-1 items-end'>
        <Pressable
          accessibilityLabel='Close letter'
          accessibilityRole='button'
          className='h-10 w-10 items-center justify-center rounded-full'
          style={{ backgroundColor: colors.gray[200] }}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onClose();
          }}
        >
          <X color={colors.text.secondary} size={20} />
        </Pressable>
      </View>
    </View>
  );
}
