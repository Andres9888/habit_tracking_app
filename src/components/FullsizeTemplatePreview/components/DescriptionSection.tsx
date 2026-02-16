/**
 * Description section for FullsizeTemplatePreview
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';
import { createHeroStyles } from '../styles';

interface DescriptionSectionProps {
  description: string;
}

export function DescriptionSection({ description }: DescriptionSectionProps) {
  const theme = useAppTheme();
  const { colors } = useThemeColors();
  const heroStyles = React.useMemo(() => createHeroStyles(colors), [colors]);

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
