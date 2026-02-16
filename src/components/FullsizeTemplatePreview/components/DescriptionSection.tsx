/**
 * Description section for FullsizeTemplatePreview
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../../theme';
import { useHeroStyles } from '../styles';

interface DescriptionSectionProps {
  description: string;
}

export function DescriptionSection({ description }: DescriptionSectionProps) {
  const theme = useAppTheme();
  const heroStyles = useHeroStyles();

  return (
    <View style={heroStyles.descriptionSection}>
      <Text
        style={[
          heroStyles.descriptionText,
          { fontFamily: theme.custom.fontFamilies.primary.text },
        ]}
      >
        {description}
      </Text>
    </View>
  );
}
