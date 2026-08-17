import { Text } from 'react-native';
import { CalendarDays, Clock } from 'lucide-react-native';
import { useInsightPalette } from '../../insightPalette';
import type { InsightId } from '../../useDetailFlow';
import { FlowDivider, FlowRow, FlowRowGroup } from '../FlowRow';
import type { AnalyticsInsightRow } from './analyticsInsightRows';

interface InsightRowsProps {
  rows: AnalyticsInsightRow[];
  onOpenInsight: (id: InsightId) => void;
}

export function InsightRows({ onOpenInsight, rows }: InsightRowsProps) {
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
          onOpenInsight={onOpenInsight}
        />
      ))}
    </FlowRowGroup>
  );
}

function InsightRow({
  onOpenInsight,
  row,
  showDivider,
}: {
  onOpenInsight: (id: InsightId) => void;
  row: AnalyticsInsightRow;
  showDivider: boolean;
}) {
  const palette = useInsightPalette();
  const Icon = row.id === 'working' ? Clock : CalendarDays;

  return (
    <>
      {showDivider ? <FlowDivider /> : null}
      <FlowRow
        accessibilityHint='Opens the evidence for this pattern'
        icon={<Icon color={palette.green} size={20} strokeWidth={1.8} />}
        subtitle={row.subtitle}
        title={row.title}
        onPress={() => onOpenInsight(row.id)}
      />
    </>
  );
}
