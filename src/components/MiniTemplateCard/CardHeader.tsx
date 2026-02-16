/**
 * Card header sub-component for MiniTemplateCard
 */

import React from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChevronRight, FlaskConical } from 'lucide-react-native';
import { useStyles } from './MiniTemplateCard.styles';
import { useThemeColors } from '../../theme/ThemeContext';

interface CardHeaderProps {
  icon: string;
  iconColor: string;
  hasResearch?: boolean;
  chevronStyle: object;
  scienceBadgeStyle: object;
}

export function CardHeader({
  icon,
  iconColor,
  hasResearch,
  chevronStyle,
  scienceBadgeStyle,
}: CardHeaderProps) {
  const styles = useStyles();
  const { colors } = useThemeColors();
  return (
    <View style={styles.topRow}>
      <View style={styles.iconWrapper}>
        <View
          style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}
        >
          <Text style={styles.icon}>{icon}</Text>
        </View>
        {hasResearch && (
          <Animated.View
            accessibilityLabel='Science-backed habit'
            style={[styles.scienceBadge, scienceBadgeStyle]}
          >
            <FlaskConical color='#fff' size={10} strokeWidth={2.5} />
          </Animated.View>
        )}
      </View>
      <Animated.View
        accessibilityLabel='View details'
        style={[styles.chevronContainer, chevronStyle]}
      >
        <ChevronRight color={colors.text.tertiary} size={16} strokeWidth={2.5} />
      </Animated.View>
    </View>
  );
}
