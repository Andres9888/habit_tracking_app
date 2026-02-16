/**
 * ImageSourceOption Component
 * Reusable option button for camera or library selection
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { LucideIcon } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ImageSourceOptionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accessibilityLabel: string;
  onPress: () => void;
  onClose: () => void;
}

export function ImageSourceOption({
  icon: Icon,
  title,
  description,
  accessibilityLabel,
  onPress,
  onClose,
}: ImageSourceOptionProps) {
  const { colors, isDark } = useThemeColors();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 18, stiffness: 150 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 18, stiffness: 150 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  // Theme-aware fuchsia accent
  const fuchsiaBg = isDark ? '#701a75' : '#f5d0fe';
  const fuchsiaIcon = isDark ? '#f0abfc' : '#c026d3';

  return (
    <AnimatedPressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      className='flex-row items-center gap-3 rounded-xl p-4'
      style={[
        animatedStyle,
        { 
          borderWidth: 1, 
          borderColor: isDark ? colors.gray[700] : colors.border 
        }
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
        onClose();
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View 
        className='h-10 w-10 items-center justify-center rounded-full' 
        style={{ backgroundColor: fuchsiaBg }}
      >
        <Icon color={fuchsiaIcon} size={20} />
      </View>
      <View className='flex-1'>
        <Text className='font-medium' style={{ color: colors.text.primary }}>
          {title}
        </Text>
        <Text className='text-xs' style={{ color: colors.text.secondary }}>
          {description}
        </Text>
      </View>
    </AnimatedPressable>
  );
}
