/**
 * Template preview with icon and description
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../theme';
import { typography } from '../../../theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles as baseStyles } from './styles';
import type { TemplatePreviewProps } from './types';

const localStyles = StyleSheet.create({
  templateDescription: {
    fontSize: typography.body.fontSize,
    lineHeight: 22,
    textAlign: 'center',
  },
});

export function TemplatePreview({
  customColor,
  description,
  icon,
}: TemplatePreviewProps) {
  const theme = useAppTheme();
  const { colors } = useThemeColors();

  return (
    <View style={baseStyles.previewContainer}>
      <View
        style={[
          baseStyles.iconContainer,
          { backgroundColor: `${customColor}20` },
        ]}
      >
        <Text style={baseStyles.iconText}>{icon}</Text>
      </View>
      <Text
        style={[
          localStyles.templateDescription,
          {
            color: colors.text.secondary,
            fontFamily: theme.custom.fontFamilies.primary.text,
          },
        ]}
      >
        {description}
      </Text>
    </View>
  );
}
