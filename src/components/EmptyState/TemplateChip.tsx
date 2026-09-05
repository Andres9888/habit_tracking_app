/**
 * TemplateChip Component
 * Quick start template button with haptic feedback and spring animation
 */

import React from 'react';
import { Text } from 'react-native';

import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useThemeColors } from '../../theme/ThemeContext';
import type { QuickStartTemplate } from './types';
import { styles } from './styles';

interface TemplateChipProps {
  template: QuickStartTemplate;
  onPress: (template: QuickStartTemplate) => void;
}

export function TemplateChip({ template, onPress }: TemplateChipProps) {
  const { colors } = useThemeColors();
  const { triggerLightImpact } = useHapticFeedback();

  const handlePress = () => {
    triggerLightImpact();
    onPress(template);
  };

  return (
    <AnimatedPressable
      accessibilityLabel={`Create ${template.name} habit`}
      accessibilityRole='button'
      // Chips sit shoulder-to-shoulder in a wrapped row; the default 10pt slop
      // would overlap neighbours and steal their taps.
      hitSlop={0}
      style={[styles.templateChip, { backgroundColor: colors.gray[100] }]}
      onPress={handlePress}
    >
      <Text style={styles.templateEmoji}>{template.emoji}</Text>
      <Text style={[styles.templateName, { color: colors.text.primary }]}>
        {template.name}
      </Text>
    </AnimatedPressable>
  );
}
