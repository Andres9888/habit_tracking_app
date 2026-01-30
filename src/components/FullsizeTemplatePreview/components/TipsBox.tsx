/**
 * Tips box for FullsizeTemplatePreview
 * Displays numbered tips for success
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Lightbulb } from 'lucide-react-native';
import { useAppTheme } from '../../../theme';
import { tipsStyles } from '../styles';

interface TipsBoxProps {
  tips: string[];
  iconColor: string;
}

export function TipsBox({ tips, iconColor }: TipsBoxProps) {
  const theme = useAppTheme();

  if (!tips || tips.length === 0) {
    return null;
  }

  return (
    <View
      accessible
      accessibilityLabel={`Tips for success: ${tips.length} tips available`}
      accessibilityRole='text'
      style={tipsStyles.tipsBox}
    >
      <View style={tipsStyles.tipsHeader}>
        <Lightbulb color={iconColor} size={20} strokeWidth={2} />
        <Text
          style={[
            tipsStyles.tipsLabel,
            { fontFamily: theme.custom.fontFamilies.primary.text },
          ]}
        >
          TIPS FOR SUCCESS
        </Text>
      </View>
      <View style={tipsStyles.tipsDivider} />
      {tips.map((tip: string, index: number) => (
        <View key={index} style={tipsStyles.tipItem}>
          <View
            style={[
              tipsStyles.tipIconContainer,
              { backgroundColor: `${iconColor}15` },
            ]}
          >
            <Text style={[tipsStyles.tipNumber, { color: iconColor }]}>
              {index + 1}
            </Text>
          </View>
          <Text
            style={[
              tipsStyles.tipText,
              { fontFamily: theme.custom.fontFamilies.primary.text },
            ]}
          >
            {tip}
          </Text>
        </View>
      ))}
    </View>
  );
}
