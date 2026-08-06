/**
 * WhatsWorkingCard — the amber "what's working" insight.
 *
 * States the daypart this habit reliably lands in and how the current reminder
 * relates to it. Only rendered when `useHabitInsights` found a real pattern —
 * there is deliberately no generic fallback copy.
 */
import { Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import type { WorkingInsight } from '../../insights';
import type { InsightPalette } from '../../insightPalette';
import { InsightCardHeader } from './InsightCardHeader';
import { InsightPill } from './InsightPill';
import { WorkingStatTile } from './WorkingStatTile';

interface WhatsWorkingCardProps {
  insight: WorkingInsight;
  palette: InsightPalette;
  onAdjustReminder: () => void;
}

function reminderLine(insight: WorkingInsight): string {
  const window = insight.daypart.label.toLowerCase();
  if (!insight.reminderTime) {
    return `No reminder yet — one just before your ${window} window would protect it.`;
  }
  return insight.reminderInWindow
    ? `Reminder at ${insight.reminderTime} — just inside your best window.`
    : `Reminder at ${insight.reminderTime} — outside your best window.`;
}

export function WhatsWorkingCard({
  insight,
  onAdjustReminder,
  palette,
}: WhatsWorkingCardProps) {
  return (
    <View
      style={{
        backgroundColor: palette.amberBg,
        borderRadius: borderRadius.large,
        padding: 18,
      }}
    >
      <InsightCardHeader
        accent={palette.amber}
        eyebrow="What's working"
        glyph='★'
        headline={`Your wins land ${insight.daypart.phrase}.`}
        headlineColor={palette.textPrimary}
      />
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        <WorkingStatTile
          label={`of ${insight.sample} wins ${insight.daypart.phrase}`}
          palette={palette}
          value={insight.sharePct}
        />
        <WorkingStatTile
          muted
          label='the rest of the day'
          palette={palette}
          value={insight.otherPct}
        />
      </View>
      <View
        style={{
          alignItems: 'center',
          borderTopColor: palette.amberBorder,
          borderTopWidth: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 18,
          paddingTop: 14,
        }}
      >
        <Text
          style={{
            color: palette.textSecondary,
            flex: 1,
            fontSize: 13,
            lineHeight: 20,
            paddingRight: 12,
          }}
        >
          {reminderLine(insight)}
        </Text>
        <InsightPill
          accessibilityHint='Opens habit settings to change the reminder time'
          borderColor={palette.amberBorder}
          label='Adjust ›'
          tint={palette.amber}
          onPress={onAdjustReminder}
        />
      </View>
    </View>
  );
}
