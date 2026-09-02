/**
 * HeroRecoveryCard — the reframe that replaces the why after a miss.
 *
 * Prototype copy: a serif headline naming the run that survived, then one
 * sentence naming the record the miss did not take. Amber lives in the wash
 * and the hairline; the card itself stays the normal surface so this reads as
 * the app noticing, not as a warning banner.
 */
import { Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontFamilies } from '../../../../theme/typography';
import { recoveryBodyCopy, recoveryHeadlineCopy } from '../../insights';
import type { InsightPalette } from '../../insightPalette';

interface HeroRecoveryCardProps {
  bestStreak: number;
  /** Length of the run this miss ended. */
  brokenRun: number;
  /** Consecutive missed scheduled days ending yesterday; 1 for a single miss. */
  missedDays?: number;
  missedDayLabel: string;
  palette: InsightPalette;
}

export function HeroRecoveryCard({
  bestStreak,
  brokenRun,
  missedDays = 1,
  missedDayLabel,
  palette,
}: HeroRecoveryCardProps) {
  const headline = recoveryHeadlineCopy(missedDayLabel, brokenRun, missedDays);
  const body = recoveryBodyCopy(brokenRun, bestStreak);

  return (
    <View
      accessibilityLabel={`${headline} ${body}`}
      accessibilityRole='summary'
      accessible
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
      </Text>
    </View>
  );
}
