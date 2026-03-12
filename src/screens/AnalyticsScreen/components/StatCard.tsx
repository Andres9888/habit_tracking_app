/**
 * StatCard - Displays a single statistic with optional emoji and interaction
 */
import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { StatCardProps } from '../AnalyticsScreen.types';
import { styles } from './StatCard.styles';

export const StatCard = memo(function StatCard({
  title,
  value,
  subtitle,
  emoji,
  onPress,
  loading = false,
}: StatCardProps) {
  const accessibilityLabel = loading
    ? `${title}, loading`
    : `${title}: ${value}${subtitle ? `, ${subtitle}` : ''}`;

  // When wrapped in AnimatedPressable, a11y is on the pressable — avoid double-announcing
  const isInteractive = !!onPress && !loading;
  const { colors } = useThemeColors();

  const content = (
    <View
      accessible={!isInteractive}
      accessibilityHint={
        !isInteractive && onPress
          ? 'Double tap to view habit details'
          : undefined
      }
      accessibilityLabel={isInteractive ? undefined : accessibilityLabel}
      accessibilityRole={
        isInteractive ? undefined : onPress ? 'button' : 'text'
      }
      style={[
        styles.statCard,
        { backgroundColor: colors.surface, shadowColor: colors.text.primary },
      ]}
    >
      {loading ? (
        <View
          accessibilityLabel={`Loading ${title}...`}
          style={styles.statCardLoading}
        >
          <View
            style={[styles.skeletonTitle, { backgroundColor: colors.border }]}
          />
          <View
            style={[styles.skeletonValue, { backgroundColor: colors.border }]}
          />
          {subtitle ? <View
              style={[
                styles.skeletonSubtitle,
                { backgroundColor: colors.border },
              ]}
            /> : null}
        </View>
      ) : (
        <>
          <Text
            style={[styles.statCardTitle, { color: colors.text.secondary }]}
          >
            {title}
          </Text>
          <View style={styles.statCardValueRow}>
            {emoji ? <Text accessibilityElementsHidden style={styles.statCardEmoji}>
                {emoji}
              </Text> : null}
            <Text
              style={[styles.statCardValue, { color: colors.text.primary }]}
            >
              {value}
            </Text>
          </View>
          {subtitle ? <Text
              style={[styles.statCardSubtitle, { color: colors.text.tertiary }]}
            >
              {subtitle}
            </Text> : null}
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
});
