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
import { DEFAULT_SETTINGS } from '../../../../convex/settings/types';
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
  const gridData = useMemo(
    () => generateBinaryGrid('1y', completedDates, habitCreatedAt),
    [completedDates, habitCreatedAt]
  );

  // Never paint DEFAULT_SETTINGS then flip — wait for real preference.
  if (!settings) return null;
  const dayShape = settings.dayShape ?? DEFAULT_SETTINGS.dayShape;
  // Year cells navigate only; toggling is on the month grid above.
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
