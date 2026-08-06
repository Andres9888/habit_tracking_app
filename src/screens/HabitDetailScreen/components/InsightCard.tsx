/**
 * InsightCard — the card surface every section on this screen sits on.
 *
 * The app has no shared Card primitive (42 files inline this style), so per-screen
 * inlining is the convention — but the exact same six properties appeared verbatim
 * five times inside this one screen, so it is collapsed here.
 *
 * The fill is `palette.card`, which resolves to `colors.cardPaper` in light mode:
 * ~50% warmth between white and the parchment canvas, so the card reads raised
 * without merging into it. Matches the Habit Browser and template drill-down.
 */
import type { ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';
import { borderRadius, shadows } from '../../../theme/spacing';
import type { InsightPalette } from '../insightPalette';

interface InsightCardProps {
  children: ReactNode;
  palette: InsightPalette;
  /** Defaults to the design's 18pt inset. */
  padding?: number;
  style?: ViewStyle;
}

export function InsightCard({
  children,
  padding = 18,
  palette,
  style,
}: InsightCardProps) {
  return (
    <View
      style={{
        backgroundColor: palette.card,
        borderColor: palette.cardBorder,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        padding,
        ...shadows.subtle,
        ...style,
      }}
    >
      {children}
    </View>
  );
}
