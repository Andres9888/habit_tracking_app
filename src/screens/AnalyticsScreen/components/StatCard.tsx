/**
 * StatCard - Displays a single statistic with optional emoji and interaction
 */
import React from 'react';
import { View, Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
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
  const accessibilityLabel = loading
    ? `${title}, loading`
    : `${title}: ${value}${subtitle ? `, ${subtitle}` : ''}`;

  const content = (
    <View
      accessible
      accessibilityHint={
        onPress ? 'Double tap to view habit details' : undefined
      }
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={onPress ? 'button' : 'text'}
      style={styles.statCard}
    >
      {loading ? (
        <View accessibilityLabel='Loading' style={styles.statCardLoading}>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonValue} />
          {subtitle && <View style={styles.skeletonSubtitle} />}
        </View>
      ) : (
        <>
          <Text style={styles.statCardTitle}>{title}</Text>
          <View style={styles.statCardValueRow}>
            {emoji && (
              <Text accessibilityElementsHidden style={styles.statCardEmoji}>
                {emoji}
              </Text>
            )}
            <Text style={styles.statCardValue}>{value}</Text>
          </View>
          {subtitle && <Text style={styles.statCardSubtitle}>{subtitle}</Text>}
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
