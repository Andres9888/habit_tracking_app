/**
 * TemplateChip Component
 * Quick start template button with haptic feedback and spring animation
 */

import React from 'react';
import { Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { springs } from '@/theme/animations';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useThemeColors } from '../../theme/ThemeContext';
import type { QuickStartTemplate } from './types';
import { styles } from './styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = springs.standard;

interface TemplateChipProps {
  template: QuickStartTemplate;
  onPress: (template: QuickStartTemplate) => void;
}

export function TemplateChip({ template, onPress }: TemplateChipProps) {
  const { colors } = useThemeColors();
  const { triggerLightImpact } = useHapticFeedback();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, SPRING_CONFIG);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING_CONFIG);
  };

  const handlePress = () => {
    triggerLightImpact();
    onPress(template);
  };

  return (
    <AnimatedPressable
      accessibilityLabel={`Create ${template.name} habit`}
      accessibilityRole='button'
      style={[styles.templateChip, { backgroundColor: colors.gray[100] }, animatedStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text style={styles.templateEmoji}>{template.emoji}</Text>
      <Text style={[styles.templateName, { color: colors.text.primary }]}>{template.name}</Text>
    </AnimatedPressable>
  );
}
