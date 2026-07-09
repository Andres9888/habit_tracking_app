/**
 * YearStrip — chromeless year-long completion grid with tap-to-jump-to-month.
 * Sits below the month grid inside the unified Calendar card; unlike
 * BinaryHeatmap it has no title/legend/tooltip, just the grid + a rate caption.
 */
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import {
  generateBinaryGrid,
  InlineHeatmapGrid,
} from '../../../components/BinaryHeatmap';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography } from '../../../theme/typography';
import { api } from '../../../../convex/_generated/api';
import { useCachedQuery } from '../../../lib/queryCache';

interface YearStripProps {
  completedDates: Set<string>;
  habitColor: string;
  habitCreatedAt?: number;
  onNavigateToMonth: (dateString: string) => void;
}

export function YearStrip({
  completedDates,
  habitColor,
  habitCreatedAt,
  onNavigateToMonth,
}: YearStripProps) {
  const { colors } = useThemeColors();
  const settings = useCachedQuery(
    api.settings.get,
    {},
    { entryName: 'settings.get' }
  );
  const dayShape = settings?.dayShape ?? 'square';
  const gridData = useMemo(
    () => generateBinaryGrid('1y', completedDates, habitCreatedAt),
    [completedDates, habitCreatedAt]
  );

  // Year cells INSPECT + navigate only — never toggle. A ~6px cell is too
  // small to safely write a completion; all toggling happens on the month
  // grid above.
  const handleCellPress = (date: string) => onNavigateToMonth(date);

  return (
    <View>
      <InlineHeatmapGrid
        habitColor={habitColor}
        monthLabels={gridData.monthLabels}
        shape={dayShape}
        weeks={gridData.weeks}
        onCellPress={handleCellPress}
      />
      <Text
        style={{
          ...typography.caption,
          color: colors.text.secondary,
          marginTop: 7,
          textAlign: 'center',
        }}
      >
        {gridData.stats.completionRate}% this year · tap to jump
      </Text>
    </View>
  );
}
