/**
 * Card - Shared surface primitive.
 *
 * Single source of truth for the app's card look: warm themed surface,
 * token-based shadow, and the standard 16px radius. Replaces 100+ hand-rolled
 * `View` + surface + shadow + radius blocks so cards stay consistent.
 *
 * Surface follows the app invariant: `isDark ? colors.card : light.surfaceMuted`.
 *
 * ```tsx
 * <Card>...</Card>                       // resting card (Level 1)
 * <Card elevation="floatingActionButton">// pressed / floating
 * <Card padded={false}>                  // opt out of default padding
 * <Card bordered>                        // hairline border
 * ```
 */
import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors as palette } from '@/theme/colors';
import { borderRadius, shadows, spacing } from '@/theme/spacing';
import { useThemeColors } from '@/theme/ThemeContext';

/** Shadow level — maps to the 5 token elevations in `theme/spacing`. */
export type CardElevation = keyof typeof shadows;

export interface CardProps extends ViewProps {
  /** Shadow depth token. Default `card` (Level 1, resting). */
  elevation?: CardElevation;
  /** Apply standard 16px padding. Default true. */
  padded?: boolean;
  /** Draw a hairline border using the themed card border. Default false. */
  bordered?: boolean;
}

export function Card({
  elevation = 'card',
  padded = true,
  bordered = false,
  style,
  children,
  ...rest
}: CardProps) {
  const { colors, isDark } = useThemeColors();
  const backgroundColor = isDark ? colors.card : palette.light.surfaceMuted;

  return (
    <View
      style={[
        {
          backgroundColor,
          borderRadius: borderRadius.card,
          ...shadows[elevation],
        },
        padded && { padding: spacing.base },
        bordered && {
          borderColor: colors.cardBorder,
          borderWidth: StyleSheet.hairlineWidth,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
