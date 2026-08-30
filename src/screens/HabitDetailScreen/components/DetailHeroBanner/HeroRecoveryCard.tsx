/**
 * HeroRecoveryCard — the reframe that replaces the why after a miss.
 *
 * Prototype copy: a serif headline naming the run that survived, then a body
 * that ends on the one rule worth keeping. Amber lives in the wash and the
 * hairline; the card itself stays the normal surface so this reads as the app
 * noticing, not as a warning banner.
 */
import { Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import {
  NEVER_MISS_TWICE,
  recoveryBodyCopy,
  recoveryHeadlineCopy,
} from '../../insights';
import type { InsightPalette } from '../../insightPalette';

interface HeroRecoveryCardProps {
  bestStreak: number;
  /** Length of the run this miss ended. */
  brokenRun: number;
  missedDayLabel: string;
  palette: InsightPalette;
}

export function HeroRecoveryCard({
  bestStreak,
  brokenRun,
  missedDayLabel,
  palette,
}: HeroRecoveryCardProps) {
  const headline = recoveryHeadlineCopy(missedDayLabel, brokenRun);
  const body = recoveryBodyCopy(brokenRun, bestStreak);

  return (
    <View
      accessibilityLabel={`${headline} ${body}${NEVER_MISS_TWICE}`}
      accessibilityRole='summary'
      style={{
        backgroundColor: palette.card,
        borderColor: palette.amberBorder,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 15,
      }}
    >
      <Text
        style={{
          color: palette.textPrimary,
          fontFamily: fontFamilies.primary.display,
          fontSize: 18,
          lineHeight: 24,
        }}
      >
        {headline}
      </Text>
      <Text
        style={{
          color: palette.textSecondary,
          fontSize: 13,
          lineHeight: 20,
          marginTop: 8,
        }}
      >
        {body}
        <Text
          style={{
            color: palette.textPrimary,
            fontWeight: fontWeights.semibold,
          }}
        >
          {NEVER_MISS_TWICE}
        </Text>
      </Text>
    </View>
  );
}
