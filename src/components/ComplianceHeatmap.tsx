import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const { width: screenWidth } = Dimensions.get('window');

interface HeatmapData {
  date: string;
  completionRate: number;
  level: 'none' | 'low' | 'medium' | 'high';
  completedHabits: number;
  totalHabits: number;
}

interface Props {
  data: HeatmapData[] | null;
  onDayPress?: (day: HeatmapData) => void;
}

const CELL_SIZE = (screenWidth - spacing.lg * 2 - spacing.xs * 6) / 7;
const LEVEL_COLORS = {
  none: '#F3F4F6',     // Gray-100
  low: '#D1FAE5',      // Green-100
  medium: '#6EE7B7',   // Green-300
  high: '#10B981',     // Primary green
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function ComplianceHeatmap({ data, onDayPress }: Props) {
  const weeks = useMemo(() => {
    if (!data) return [];

    // Group data by weeks
    const weeksData: HeatmapData[][] = [];
    let currentWeek: HeatmapData[] = [];

    // Start from the first Sunday
    const firstDate = new Date(data[0].date);
    const firstDayOfWeek = firstDate.getDay();

    // Add empty cells for days before the first data point
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: '',
        completionRate: 0,
        level: 'none',
        completedHabits: 0,
        totalHabits: 0,
      });
    }

    data.forEach((day) => {
      currentWeek.push(day);

      if (currentWeek.length === 7) {
        weeksData.push(currentWeek);
        currentWeek = [];
      }
    });

    // Add remaining days
    if (currentWeek.length > 0) {
      // Fill the rest of the week with empty cells
      while (currentWeek.length < 7) {
        currentWeek.push({
          date: '',
          completionRate: 0,
          level: 'none',
          completedHabits: 0,
          totalHabits: 0,
        });
      }
      weeksData.push(currentWeek);
    }

    return weeksData;
  }, [data]);

  const monthLabels = useMemo(() => {
    if (!data || data.length === 0) return [];

    const labels: { month: string; weekIndex: number }[] = [];
    let currentMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const validDay = week.find(day => day.date);
      if (validDay) {
        const date = new Date(validDay.date);
        const month = date.getMonth();
        if (month !== currentMonth) {
          currentMonth = month;
          labels.push({
            month: MONTH_NAMES[month],
            weekIndex,
          });
        }
      }
    });

    return labels;
  }, [weeks, data]);

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No compliance data available</Text>
        <Text style={styles.emptySubtext}>
          Complete habits daily to see your compliance heatmap
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Day labels */}
      <View style={styles.dayLabelsContainer}>
        {DAY_NAMES.map((day, index) => (
          <View key={index} style={styles.dayLabelCell}>
            <Text style={styles.dayLabel}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Heatmap grid */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View>
          {/* Month labels */}
          <View style={styles.monthLabelsContainer}>
            {monthLabels.map((label, index) => (
              <View
                key={index}
                style={[
                  styles.monthLabel,
                  { left: label.weekIndex * (CELL_SIZE + spacing.xs) },
                ]}
              >
                <Text style={styles.monthLabelText}>{label.month}</Text>
              </View>
            ))}
          </View>

          {/* Weeks */}
          <View style={styles.weeksContainer}>
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekColumn}>
                {week.map((day, dayIndex) => (
                  <TouchableOpacity
                    key={dayIndex}
                    style={[
                      styles.cell,
                      {
                        backgroundColor: day.date
                          ? LEVEL_COLORS[day.level]
                          : 'transparent',
                      },
                    ]}
                    onPress={() => day.date && onDayPress?.(day)}
                    activeOpacity={0.7}
                    disabled={!day.date}
                  >
                    {day.completionRate > 0 && (
                      <Text style={styles.cellText}>
                        {Math.round(day.completionRate)}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendLabel}>Less</Text>
        {Object.entries(LEVEL_COLORS).map(([level, color]) => (
          <View
            key={level}
            style={[styles.legendCell, { backgroundColor: color }]}
          />
        ))}
        <Text style={styles.legendLabel}>More</Text>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Last 90 days • Tap a day to see details
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  emptyText: {
    ...typography.h3,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  dayLabelsContainer: {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    top: 40,
    zIndex: 1,
  },
  dayLabelCell: {
    width: 20,
    height: CELL_SIZE,
    marginBottom: spacing.xs,
    justifyContent: 'center',
  },
  dayLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: 10,
    textAlign: 'center',
  },
  scrollView: {
    marginLeft: 24,
    marginTop: 20,
  },
  monthLabelsContainer: {
    height: 20,
    position: 'relative',
  },
  monthLabel: {
    position: 'absolute',
    top: 0,
  },
  monthLabelText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 10,
  },
  weeksContainer: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  weekColumn: {
    flexDirection: 'column',
    marginRight: spacing.xs,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    marginBottom: spacing.xs,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 8,
    color: colors.surface,
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: 10,
    marginHorizontal: spacing.xs,
  },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  summary: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  summaryText: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: 10,
  },
});