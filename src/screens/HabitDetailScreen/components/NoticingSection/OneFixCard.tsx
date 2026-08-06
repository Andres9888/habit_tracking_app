/**
 * OneFixCard — the single actionable suggestion: the weekday that reliably
 * slips, plus a habit-stacking nudge to try on the next one.
 *
 * Hidden entirely once declined; collapses to a one-line acknowledgement once
 * accepted, so the card never nags about a decision already made.
 */
import { Text, View } from 'react-native';
import { borderRadius, shadows } from '../../../../theme/spacing';
import type { OneFixInsight } from '../../insights';
import type { InsightPalette } from '../../insightPalette';
import { InsightCardHeader } from './InsightCardHeader';
import { OneFixActions } from './OneFixActions';
import { oneFixBody, oneFixStackHint } from './oneFixCopy';
import { useOneFixResponse } from './useOneFixResponse';
import { WeekdayBars } from './WeekdayBars';

interface OneFixCardProps {
  cue?: string;
  habitId: string;
  insight: OneFixInsight;
  palette: InsightPalette;
}

export function OneFixCard({
  cue,
  habitId,
  insight,
  palette,
}: OneFixCardProps) {
  const { isLoaded, respond, response } = useOneFixResponse(
    habitId,
    insight.weakest.weekday
  );

  if (!isLoaded || response === 'declined') return null;

  const shell = {
    backgroundColor: palette.card,
    borderColor: palette.cardBorder,
    borderRadius: borderRadius.large,
    borderWidth: 1,
    padding: 18,
    ...shadows.subtle,
  };

  return (
    <View style={shell}>
      <InsightCardHeader
        accent={palette.ctaGreen}
        eyebrow='One fix to try'
        glyph='↗'
        headline={`${insight.weakest.plural} are where it slips.`}
        headlineColor={palette.textPrimary}
      />
      <WeekdayBars
        bars={insight.bars}
        palette={palette}
        weakestWeekday={insight.weakest.weekday}
      />
      <Text
        style={{
          color: palette.textSecondary,
          fontSize: 14,
          lineHeight: 22,
          marginTop: 16,
        }}
      >
        {oneFixBody(insight)} {oneFixStackHint(insight, cue)}
      </Text>
      {response === 'accepted' ? (
        <Text style={{ color: palette.ctaGreen, fontSize: 13, marginTop: 14 }}>
          ✓ You&rsquo;re trying this — we&rsquo;ll check back after{' '}
          {insight.weakest.plural.toLowerCase()}.
        </Text>
      ) : (
        <OneFixActions
          acceptLabel={`Try it this ${insight.weakest.plural.slice(0, -1)}`}
          palette={palette}
          onAccept={() => respond('accepted')}
          onDecline={() => respond('declined')}
        />
      )}
    </View>
  );
}
