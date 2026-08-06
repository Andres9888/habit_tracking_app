/**
 * Description section for FullsizeTemplatePreview
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../../theme';
import { heroStyles } from '../styles';
import { useDetailPalette } from '../detailPalette';

interface DescriptionSectionProps {
  description: string;
}

export function DescriptionSection({ description }: DescriptionSectionProps) {
  const theme = useAppTheme();
  const palette = useDetailPalette();
  const fontFamily = theme.custom.fontFamilies.primary.text;

  return (
    <View style={heroStyles.descriptionSection}>
      <Text
        style={[
          heroStyles.descriptionText,
          { color: palette.textSecondary, fontFamily },
        ]}
      >
        {description}
      </Text>
    </View>
  );
}
