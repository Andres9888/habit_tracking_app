/**
 * HeroWhyPill — the user's own motivation, quoted inside the hero band.
 * Renders nothing when no why / identity / woopWish is set (the design shows no
 * placeholder copy for an empty why).
 */
import { Text, View } from 'react-native';
import type { Habit } from '../../../../features/habits/types';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';
import { useResolveWhy } from '../GoalWhyAnchor/GoalWhyAnchor.hooks';

interface HeroWhyPillProps {
  habit: Habit;
  palette: InsightPalette;
}

export function HeroWhyPill({ habit, palette }: HeroWhyPillProps) {
  const resolved = useResolveWhy(habit);
  if (resolved === null) return null;

  return (
    <View
      accessibilityLabel={`${resolved.label}: ${resolved.value}`}
      accessibilityRole='summary'
      style={{
        alignItems: 'flex-start',
        backgroundColor: palette.bandSoft,
        borderRadius: borderRadius.medium,
        flexDirection: 'row',
        gap: 9,
        marginTop: spacing.base,
        paddingHorizontal: 15,
        paddingVertical: 13,
      }}
    >
      <Text style={{ fontSize: 13, marginTop: 2 }}>{resolved.icon}</Text>
      <Text
        style={{
          color: palette.bandMuted,
          flex: 1,
          fontSize: 13,
          lineHeight: 20,
        }}
      >
        <Text style={{ color: palette.bandFg, fontWeight: fontWeights.bold }}>
          {resolved.label}:{' '}
        </Text>
        {`“${resolved.value}”`}
      </Text>
    </View>
  );
}
