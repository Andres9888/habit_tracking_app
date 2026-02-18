/**
 * AboutSection - About this habit card
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { BookOpen } from 'lucide-react-native';
import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';
import { sectionStyles, themedSectionStyles } from '../styles';
import type { AboutSectionProps } from '../TemplateScienceModal.types';

export const AboutSection = ({
  animatedStyle,
  description,
}: AboutSectionProps) => {
  const theme = useAppTheme();
  const { colors, isDark } = useThemeColors();
  const themed = themedSectionStyles(colors);

  return (
    <Animated.View
      accessible
      accessibilityLabel={`About this habit: ${description}`}
      style={[themed.sectionCard, animatedStyle]}
    >
      <View style={sectionStyles.sectionHeader}>
        <View
          style={[
            sectionStyles.sectionIconBadge,
            { backgroundColor: isDark ? colors.gray[100] : '#F0F9FF' },
          ]}
        >
          <BookOpen color='#0EA5E9' size={16} strokeWidth={2} />
        </View>
        <Text
          style={[
            themed.sectionTitle,
            { fontFamily: theme.custom.fontFamilies.primary.text },
          ]}
        >
          About This Habit
        </Text>
      </View>
      <Text
        style={[
          themed.descriptionText,
          { fontFamily: theme.custom.fontFamilies.primary.text },
        ]}
      >
        {description}
      </Text>
    </Animated.View>
  );
};
