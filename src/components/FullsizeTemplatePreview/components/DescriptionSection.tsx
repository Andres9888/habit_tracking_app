/**
 * Description section for FullsizeTemplatePreview
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../../theme';
import { heroStyles } from '../styles';

interface DescriptionSectionProps {
  description: string;
  iconColor?: string;
}

export function DescriptionSection({
  description,
  iconColor,
}: DescriptionSectionProps) {
  const theme = useAppTheme();
  const fontFamily = theme.custom.fontFamilies.primary.text;
  const labelColor = iconColor?.trim() || undefined;

  return (
    <View style={heroStyles.descriptionSection}>
      <Text style={[heroStyles.descriptionText, { fontFamily }]}>
        {description}
      </Text>
    </View>
  );
}
