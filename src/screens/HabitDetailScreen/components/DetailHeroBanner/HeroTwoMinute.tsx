/**
 * HeroTwoMinute — "Only have 2 minutes?" escape hatch under the complete bar.
 *
 * Tapping it reveals a smaller-ask framing rather than logging anything: the
 * point is to lower the bar on a bad day, not to record a different kind of
 * completion (the data model has one completion per day).
 */
import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import { durations } from '../../../../theme/animations';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';

interface HeroTwoMinuteProps {
  /** Open on mount — the recovery state leads with the smaller ask. */
  defaultExpanded?: boolean;
  hint: string;
  palette: InsightPalette;
}

export function HeroTwoMinute({
  defaultExpanded = false,
  hint,
  palette,
}: HeroTwoMinuteProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const reduceMotion = useReduceMotion();

  return (
    <>
      <Pressable
        accessibilityHint='Shows a smaller version of this habit to fall back on'
        accessibilityLabel='Only have 2 minutes?'
        accessibilityRole='button'
        accessibilityState={{ expanded }}
        hitSlop={12}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: spacing.md,
          minHeight: 24,
        }}
        onPress={() => setExpanded((open) => !open)}
      >
        <Text
          style={{
            color: palette.ctaGreen,
            fontSize: 13,
            fontWeight: fontWeights.semibold,
          }}
        >
          {expanded ? 'Only have 2 minutes? ↓' : 'Only have 2 minutes? →'}
        </Text>
      </Pressable>
      {expanded ? (
        <Animated.Text
          entering={reduceMotion ? undefined : FadeIn.duration(durations.quick)}
          style={{
            backgroundColor: palette.bandSoft,
            borderRadius: borderRadius.medium,
            color: palette.bandMuted,
            fontSize: 13,
            lineHeight: 19,
            marginTop: spacing.sm,
            paddingHorizontal: 15,
            paddingVertical: 12,
          }}
        >
          {hint}
        </Animated.Text>
      ) : null}
    </>
  );
}
