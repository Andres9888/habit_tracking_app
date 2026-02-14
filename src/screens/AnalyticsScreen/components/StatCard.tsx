/**
 * StatCard - Displays a single statistic with optional emoji and interaction
 * Theme-aware for dark mode support.
 */
import React from 'react';
import { View, Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { StatCardProps } from '../AnalyticsScreen.types';
import { styles } from './StatCard.styles';

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  emoji,
  onPress,
  loading = false,
}) => {
  const { colors, isDark } = useThemeColors();

  const accessibilityLabel = loading
    ? `${title}, loading`
    : `${title}: ${value}${subtitle ? `, ${subtitle}` : ''}`;

  const cardStyle = [
    styles.statCard,
    {
      backgroundColor: colors.surface,
      shadowColor: isDark ? '#000000' : '#1c1917',
      shadowOpacity: isDark ? 0.3 : 0.08,
    },
  ];

  const skeletonColor = { backgroundColor: colors.border };

  const content = (
    <View
      accessible
      accessibilityHint={
        onPress ? 'Double tap to view habit details' : undefined
      }
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={onPress ? 'button' : 'text'}
      style={cardStyle}
    >
      {loading ? (
        <View accessibilityLabel='Loading' style={styles.statCardLoading}>
          <View style={[styles.skeletonTitle, skeletonColor]} />
          <View style={[styles.skeletonValue, skeletonColor]} />
          {subtitle && <View style={[styles.skeletonSubtitle, skeletonColor]} />}
        </View>
      ) : (
        <>
          <Text style={[styles.statCardTitle, { color: colors.text.secondary }]}>
            {title}
          </Text>
          <View style={styles.statCardValueRow}>
            {emoji && (
              <Text accessibilityElementsHidden style={styles.statCardEmoji}>
                {emoji}
              </Text>
            )}
            <Text style={[styles.statCardValue, { color: colors.text.primary }]}>
              {value}
            </Text>
          </View>
          {subtitle && (
            <Text style={[styles.statCardSubtitle, { color: colors.text.tertiary }]}>
              {subtitle}
            </Text>
          )}
        </>
      )}
    </View>
  );

  if (onPress && !loading) {
    return (
      <AnimatedPressable
        accessible
        accessibilityHint='Double tap to view habit details'
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='button'
        onPress={onPress}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return content;
};
