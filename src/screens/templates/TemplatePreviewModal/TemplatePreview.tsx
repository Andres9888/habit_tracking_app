/**
 * Template preview with icon and description
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../theme';
import { styles as baseStyles } from './styles';
import type { TemplatePreviewProps } from './types';

const localStyles = StyleSheet.create({
  templateDescription: {
    color: '#78716c', // stone-500
    fontSize: 17,
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
          { fontFamily: theme.custom.fontFamilies.primary.text },
        ]}
      >
        {description}
      </Text>
    </View>
  );
}
