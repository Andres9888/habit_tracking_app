/**
 * Description section for FullsizeTemplatePreview
 */

import React from 'react';
import { View, Text } from 'react-native';

import { heroStyles } from '../styles';
import { useAppTheme } from '../../../theme';

interface DescriptionSectionProps {
  description: string;
}

export function DescriptionSection({ description }: DescriptionSectionProps) {
  const theme = useAppTheme();

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
