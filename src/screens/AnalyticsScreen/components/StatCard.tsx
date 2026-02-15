/**
 * StatCard - Displays a single statistic with optional emoji, trend indicator, and interaction
 * Theme-aware with dark mode support and animated entrance
 */
import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '../../../theme';
import { spacing } from '../../../theme/spacing';
import type { StatCardProps } from '../AnalyticsScreen.types';

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  emoji,
  trend,
  onPress,
  loading = false,
  index = 0,
}) => {
  const { colors: tc, isDark } = useThemeColors();

  const accessibilityLabel = loading
    ? `${title}, loading`
    : `${title}: ${value}${subtitle ? `, ${subtitle}` : ''}${trend ? `, trending ${trend === 'up' ? 'up' : 'down'}` : ''}`;

  const trendColor =
    trend === 'up' ? (isDark ? '#34D399' : '#059669') : (isDark ? '#F87171' : '#DC2626');
  const trendArrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : null;

  const content = (
    <View
      accessible
      accessibilityHint={onPress ? 'Double tap to view habit details' : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={onPress ? 'button' : 'text'}
      style={{
        backgroundColor: tc.card,
        borderColor: tc.cardBorder,
        borderRadius: 16,
        borderWidth: 1,
        flex: 1,
        margin: spacing.sm,
        minWidth: '45%',
        padding: spacing.lg,
        shadowColor: isDark ? '#000000' : '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 16,
        elevation: 3,
      }}
    >
      {loading ? (
        <View style={{ height: 80 }}>
          <View
            style={{
              backgroundColor: tc.border,
              borderRadius: 4,
              height: 12,
              marginBottom: spacing.xs,
              width: 80,
            }}
          />
          <View
            style={{
              backgroundColor: tc.border,
              borderRadius: 4,
              height: 28,
              marginBottom: spacing.xs,
              width: 100,
            }}
          />
          {subtitle != null && (
            <View
              style={{
                backgroundColor: tc.border,
                borderRadius: 4,
                height: 10,
                width: 60,
              }}
            />
          )}
        </View>
      ) : (
        <>
          <Text
            style={{
              color: tc.text.secondary,
              fontSize: 13,
              fontWeight: '500',
              letterSpacing: 0.2,
              marginBottom: spacing.xs,
            }}
          >
            {title}
          </Text>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            {emoji != null && (
              <Text
                accessibilityElementsHidden
                style={{ fontSize: 22, marginRight: spacing.xs }}
              >
                {emoji}
              </Text>
            )}
            <Text
              style={{
                color: tc.text.primary,
                fontSize: 22,
                fontWeight: '700',
                letterSpacing: -0.5,
                lineHeight: 28,
                flex: 1,
              }}
              numberOfLines={1}
            >
              {value}
            </Text>
            {trendArrow != null && (
              <Text
                style={{
                  color: trendColor,
                  fontSize: 16,
                  fontWeight: '700',
                  marginLeft: 4,
                }}
              >
                {trendArrow}
              </Text>
            )}
          </View>
          {subtitle != null && (
            <Text
              style={{
                color: tc.text.tertiary,
                fontSize: 13,
                letterSpacing: -0.08,
                marginTop: spacing.xs,
              }}
            >
              {subtitle}
            </Text>
          )}
        </>
      )}
    </View>
  );

  const animated = (
    <Animated.View entering={FadeInUp.delay(100 + index * 60).springify().damping(18)}>
      {content}
    </Animated.View>
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
        {animated}
      </AnimatedPressable>
    );
  }

  return animated;
};
