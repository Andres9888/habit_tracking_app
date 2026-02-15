/**
 * WhyItWorks - Section explaining why the habit works
 */

import React from 'react';
import { View, Text } from 'react-native';

import { scienceStyles } from '../styles';
import { useAppTheme } from '../../../theme';

interface WhyItWorksProps {
  whyItWorksText: string;
}

export function WhyItWorks({ whyItWorksText }: WhyItWorksProps) {
  const theme = useAppTheme();

  return (
    <View
      accessible
      accessibilityRole='text'
      style={scienceStyles.whyItWorksContainer}
    >
      <View style={scienceStyles.whyItWorksHeader}>
        <Text style={scienceStyles.whyItWorksEmoji}>💡</Text>
        <Text
          style={[
            scienceStyles.whyItWorksTitle,
            { fontFamily: theme.custom.fontFamilies.primary.text },
          ]}
        >
          Why This Habit Works
        </Text>
      </View>
      <Text
        style={[
          scienceStyles.whyItWorksText,
          { fontFamily: theme.custom.fontFamilies.primary.text },
        ]}
      >
        {whyItWorksText}
      </Text>
    </View>
  );
}
