/**
 * StatCard - Displays a single statistic with optional emoji, accent color, and interaction.
 * Supports animated value countup for numeric stats.
 */
import React from 'react';
import { View, Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AnimatedStatValue } from './AnimatedStatValue';
import type { StatCardProps } from '../AnalyticsScreen.types';
import { styles } from './StatCard.styles';

interface ExtendedStatCardProps extends StatCardProps {
  /** Accent color for the top border highlight */
  accentColor?: string;
  /** Whether to animate numeric values counting up */
  animateValue?: boolean;
}

export const StatCard: React.FC<ExtendedStatCardProps> = ({
  title,
  value,
  subtitle,
  emoji,
  onPress,
  loading = false,
  accentColor,
  animateValue = false,
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
      {/* Accent top bar */}
      {accentColor && (
        <View
          style={[
            styles.accentBar,
            { backgroundColor: accentColor },
          ]}
        />
      )}
      {loading ? (
        <View accessibilityLabel="Loading" style={styles.statCardLoading}>
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
            {animateValue ? (
              <AnimatedStatValue
                delay={200}
                style={styles.statCardValue}
                value={value}
              />
            ) : (
              <Text style={styles.statCardValue}>{value}</Text>
            )}
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
        accessibilityHint="Double tap to view habit details"
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={onPress}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return content;
};
