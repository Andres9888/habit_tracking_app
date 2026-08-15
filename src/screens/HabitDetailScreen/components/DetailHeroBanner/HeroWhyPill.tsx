/**
 * HeroWhyPill — one resolved why line in the hero band.
 * Renders nothing when why / identity / wish are all empty.
 */
import { Text, View } from 'react-native';
import type { Habit } from '../../../../features/habits/types';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';
import { resolveWhy } from '../resolveWhy';

interface HeroWhyPillProps {
  habit: Habit;
  palette: InsightPalette;
}

export function HeroWhyPill({ habit, palette }: HeroWhyPillProps) {
  const resolved = resolveWhy(habit);
  if (resolved === null) return null;

  return (
    <View
      accessibilityLabel={`${resolved.label}: ${resolved.value}`}
      accessibilityRole='summary'
      style={{
        backgroundColor: palette.bandSoft,
        borderRadius: borderRadius.medium,
        marginTop: spacing.base,
        paddingHorizontal: 15,
        paddingVertical: 13,
      }}
    >
      <Text
        style={{
          color: palette.bandFg,
          fontSize: 11,
          fontWeight: fontWeights.bold,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        }}
      >
        {resolved.label}
      </Text>
      <Text
        style={{
          color: palette.bandMuted,
          fontFamily: fontFamilies.primary.display,
          fontSize: 15,
          fontStyle: 'italic',
          lineHeight: 21,
          marginTop: 3,
        }}
      >
        {resolved.value}
      </Text>
    </View>
  );
}
