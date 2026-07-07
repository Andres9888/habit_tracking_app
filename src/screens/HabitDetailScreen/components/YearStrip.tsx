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
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

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
        weeks={gridData.weeks}
        onCellPress={handleCellPress}
      />
      <Text
        style={{
          ...typography.caption,
          color: colors.text.secondary,
          marginTop: spacing.sm,
          textAlign: 'center',
        }}
      >
        {gridData.stats.completionRate}% this year · tap to jump
      </Text>
    </View>
  );
}
