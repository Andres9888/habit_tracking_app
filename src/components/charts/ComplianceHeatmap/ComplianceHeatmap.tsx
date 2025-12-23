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
  // Green-300
  high: '#10B981',

  // Gray-100
  low: '#D1FAE5',

  // Green-100
  medium: '#6EE7B7',

  none: '#F3F4F6', // Primary green
};

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
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
        completedHabits: 0,
        completionRate: 0,
        date: '',
        level: 'none',
        totalHabits: 0,
      });
    }

    for (const day of data) {
      currentWeek.push(day);

      if (currentWeek.length === 7) {
        weeksData.push(currentWeek);
        currentWeek = [];
      }
    }

    // Add remaining days
    if (currentWeek.length > 0) {
      // Fill the rest of the week with empty cells
      while (currentWeek.length < 7) {
        currentWeek.push({
          completedHabits: 0,
          completionRate: 0,
          date: '',
          level: 'none',
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

    for (const [weekIndex, week] of weeks.entries()) {
      const validDay = week.find((day) => day.date);
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
    }

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
                    activeOpacity={0.7}
                    disabled={!day.date}
                    style={[
                      styles.cell,
                      {
                        backgroundColor: day.date
                          ? LEVEL_COLORS[day.level]
                          : 'transparent',
                      },
                    ]}
                    onPress={() => day.date && onDayPress?.(day)}
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
  dayLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: 10,
    textAlign: 'center',
  },
  dayLabelCell: {
    height: CELL_SIZE,
    justifyContent: 'center',
    marginBottom: spacing.xs,
    width: 20,
  },
  dayLabelsContainer: {
    flexDirection: 'column',
    left: 0,
    position: 'absolute',
    top: 40,
    zIndex: 1,
  },
  cell: {
    height: CELL_SIZE,
    width: CELL_SIZE,
    borderRadius: 2,
    marginBottom: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    height: 200,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  cellText: {
    color: colors.surface,
    fontSize: 8,
    fontWeight: '600',
  },
  emptySubtext: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.h3,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  legend: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    borderTopColor: colors.border,
    justifyContent: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
  },
  legendCell: {
    borderRadius: 2,
    height: 12,
    marginHorizontal: 2,
    width: 12,
  },
  monthLabel: {
    position: 'absolute',
    top: 0,
  },
  legendLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: 10,
    marginHorizontal: spacing.xs,
  },
  monthLabelsContainer: {
    height: 20,
    position: 'relative',
  },
  monthLabelText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 10,
  },
  scrollView: {
    marginLeft: 24,
    marginTop: 20,
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
  weekColumn: {
    flexDirection: 'column',
    marginRight: spacing.xs,
  },
  weeksContainer: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
});
