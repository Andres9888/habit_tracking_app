/**
 * HeatmapGrid — 7×4 rolling window. Each cell is its own pressable so a tap
 * toggles that day; cells are 44pt tall via padding while the painted square
 * stays flush to the grid.
 */
import { Pressable, Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { WEEKDAY_SHORT } from '../../insights';
import type { InsightPalette } from '../../insightPalette';
import type { HeatCell } from './useMonthHeatmap';

const HEADER = [1, 2, 3, 4, 5, 6, 0];
const STATE_LABEL: Record<HeatCell['state'], string> = {
  done: 'done',
  future: 'upcoming',
  missed: 'missed',
  partial: 'skipped',
  today: 'today, not yet done',
};

interface HeatmapGridProps {
  cells: HeatCell[];
  palette: InsightPalette;
  onDayPress: (date: string, isCompleted: boolean) => void;
}

export function cellStyle(state: HeatCell['state'], palette: InsightPalette) {
  if (state === 'done') return { backgroundColor: palette.green };
  if (state === 'partial') return { backgroundColor: palette.greenSoft };
  if (state === 'today') {
    return { borderColor: palette.ctaGreen, borderWidth: 2 };
  }
  if (state === 'future') return { backgroundColor: palette.cellFuture };
  return { backgroundColor: palette.cellEmpty };
}

export function HeatmapGrid({ cells, onDayPress, palette }: HeatmapGridProps) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
      {HEADER.map((weekday, index) => (
        <Text
          key={`head-${index}`}
          style={{
            color: palette.textTertiary,
            fontSize: 10,
            textAlign: 'center',
            width: `${100 / 7}%`,
          }}
        >
          {WEEKDAY_SHORT[weekday]}
        </Text>
      ))}
      {cells.map((cell) => (
        <Pressable
          key={cell.date}
          accessibilityLabel={`${cell.date}, ${STATE_LABEL[cell.state]}`}
          accessibilityRole='button'
          disabled={cell.state === 'future'}
          style={{ padding: 3, width: `${100 / 7}%` }}
          onPress={() => onDayPress(cell.date, cell.state === 'done')}
        >
          <View
            style={{
              aspectRatio: 1,
              borderRadius: borderRadius.small,
              width: '100%',
              ...cellStyle(cell.state, palette),
            }}
          />
        </Pressable>
      ))}
    </View>
  );
}
