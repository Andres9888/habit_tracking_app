/**
 * HeroRecoveryCard — the missed-yesterday state the design lists under MVP
 * "Ship": when yesterday was scheduled and skipped, this replaces the why pill
 * so the first thing you read is that the run ending didn't undo the work.
 *
 * Deliberately NOT alarming: amber, not red, and no count of what was missed.
 * The two-minute CTA sits right under it because the point of the state is to
 * lower today's bar, not to report yesterday.
 */
import { Text, View } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';

interface HeroRecoveryCardProps {
  /** "One miss doesn't erase 12 days." */
  headline: string;
  /** Numbers that survived the reset. */
  bestStreak: number;
  daysDone: number;
  palette: InsightPalette;
}

function Stat({
  label,
  palette,
  value,
}: {
  label: string;
  palette: InsightPalette;
  value: number;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          color: palette.bandFg,
          fontFamily: fontFamilies.primary.display,
          fontSize: 20,
          fontWeight: fontWeights.bold,
          lineHeight: 22,
        }}
      >
        {value}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          color: palette.bandMuted,
          fontSize: 10,
          letterSpacing: 0.8,
          marginTop: 4,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export function HeroRecoveryCard({
  bestStreak,
  daysDone,
  headline,
  palette,
}: HeroRecoveryCardProps) {
  return (
    <View
      accessibilityRole='summary'
      style={{
        backgroundColor: palette.amberBg,
        borderColor: palette.amberBorder,
        borderRadius: borderRadius.medium,
        borderWidth: 1,
        marginTop: spacing.base,
        paddingHorizontal: 15,
        paddingVertical: 14,
      }}
    >
      <Text
        style={{
          color: palette.bandFg,
          fontFamily: fontFamilies.primary.display,
          fontSize: 18,
          fontWeight: fontWeights.semibold,
          lineHeight: 24,
        }}
      >
        {headline}
      </Text>
      <View
        style={{
          borderTopColor: palette.amberBorder,
          borderTopWidth: 1,
          flexDirection: 'row',
          gap: 12,
          marginTop: 13,
          paddingTop: 12,
        }}
      >
        <Stat label='Best streak' palette={palette} value={bestStreak} />
        <Stat label='Days done' palette={palette} value={daysDone} />
      </View>
    </View>
  );
}
