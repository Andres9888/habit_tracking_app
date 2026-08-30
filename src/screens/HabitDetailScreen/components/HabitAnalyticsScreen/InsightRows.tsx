import { Text } from 'react-native';
import { CalendarDays, Clock, TrendingUp } from 'lucide-react-native';
import { useInsightPalette } from '../../insightPalette';
import type { InsightId } from '../../useDetailFlow';
import { FlowDivider, FlowRow, FlowRowGroup } from '../FlowRow';
import type { AnalyticsInsightRow } from './analyticsInsightRows';

interface InsightRowsProps {
  rows: AnalyticsInsightRow[];
  onOpenHistory: () => void;
  onOpenInsight: (id: InsightId) => void;
}

export function InsightRows({
  onOpenHistory,
  onOpenInsight,
  rows,
}: InsightRowsProps) {
  const palette = useInsightPalette();

  if (rows.length === 0) {
    return (
      <Text
        style={{
          color: palette.textSecondary,
          fontSize: 14,
          lineHeight: 21,
          paddingHorizontal: 4,
        }}
      >
        Patterns appear after about two weeks of check-ins.
      </Text>
    );
  }

  return (
    <FlowRowGroup>
      {rows.map((row, index) => (
        <InsightRow
          key={row.id}
          row={row}
          showDivider={index > 0}
          onOpenHistory={onOpenHistory}
          onOpenInsight={onOpenInsight}
        />
      ))}
    </FlowRowGroup>
  );
}

const ICONS = {
  oneFix: CalendarDays,
  streakTrend: TrendingUp,
  working: Clock,
} as const;

function InsightRow({
  onOpenHistory,
  onOpenInsight,
  row,
  showDivider,
}: {
  onOpenHistory: () => void;
  onOpenInsight: (id: InsightId) => void;
  row: AnalyticsInsightRow;
  showDivider: boolean;
}) {
  const palette = useInsightPalette();
  const isRuns = row.id === 'streakTrend';
  const Icon = ICONS[row.id];

  return (
    <>
      {showDivider ? <FlowDivider /> : null}
      <FlowRow
        accessibilityHint={
          isRuns
            ? 'Opens your runs in History'
            : 'Opens the evidence for this pattern'
        }
        icon={<Icon color={palette.green} size={20} strokeWidth={1.8} />}
        subtitle={row.subtitle}
        title={row.title}
        onPress={() =>
          isRuns ? onOpenHistory() : onOpenInsight(row.id as InsightId)
        }
      />
    </>
  );
}
