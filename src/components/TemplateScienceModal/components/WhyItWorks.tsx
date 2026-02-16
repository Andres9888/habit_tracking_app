/**
 * WhyItWorks - Section explaining why the habit works
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';
import { scienceStyles, themedScienceStyles } from '../styles';

interface WhyItWorksProps {
  whyItWorksText: string;
}

export function WhyItWorks({ whyItWorksText }: WhyItWorksProps) {
  const theme = useAppTheme();
  const { colors, isDark } = useThemeColors();
  const themed = themedScienceStyles(colors, isDark);

  return (
    <View
      accessible
      accessibilityRole='text'
      style={[scienceStyles.whyItWorksContainer, themed.whyItWorksContainer]}
    >
      <View style={scienceStyles.whyItWorksHeader}>
        <Text style={scienceStyles.whyItWorksEmoji}>💡</Text>
        <Text
          style={[
            scienceStyles.whyItWorksTitle,
            themed.whyItWorksTitle,
            { fontFamily: theme.custom.fontFamilies.primary.text },
          ]}
        >
          Why This Habit Works
        </Text>
      </View>
      <Text
        style={[
          scienceStyles.whyItWorksText,
          themed.whyItWorksText,
          { fontFamily: theme.custom.fontFamilies.primary.text },
        ]}
      >
        {whyItWorksText}
      </Text>
    </View>
  );
}
