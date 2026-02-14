/**
 * ContributionGrid - GitHub-style heatmap of habit completions
 * Shows last 15 weeks (105 days) in a compact, shareable grid
 */
import React, { useMemo } from 'react';
import { View, Text } from 'react-native';

interface ContributionGridProps {
  completedDates: Set<string>;
  habitColor?: string;
}

const WEEKS = 15;
const DAYS_PER_WEEK = 7;
const CELL_SIZE = 14;
const CELL_GAP = 3;
const DAY_LABELS = ['', 'M', '', 'W', '', 'F', ''];

/** Get opacity level based on whether the day is completed */
function getCellColor(
  isCompleted: boolean,
  baseColor: string
): { backgroundColor: string; opacity: number } {
  if (!isCompleted) {
    return { backgroundColor: '#e7e5e4', opacity: 1 }; // stone-200
  }
  return { backgroundColor: baseColor, opacity: 1 };
}

/** Format date as YYYY-MM-DD matching the app's date format */
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Get month labels for the grid columns */
function getMonthLabels(
  weeks: Date[][]
): Array<{ label: string; colIndex: number }> {
  const labels: Array<{ label: string; colIndex: number }> = [];
  const months = [
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
  let lastMonth = -1;

  for (let w = 0; w < weeks.length; w++) {
    const firstDay = weeks[w][0];
    if (firstDay && firstDay.getMonth() !== lastMonth) {
      lastMonth = firstDay.getMonth();
      labels.push({ label: months[lastMonth], colIndex: w });
    }
  }
  return labels;
}

export function ContributionGrid({
  completedDates,
  habitColor = '#047857',
}: ContributionGridProps) {
  const { weeks, monthLabels, stats } = useMemo(() => {
    const today = new Date();
    const todayDay = today.getDay(); // 0=Sun
    // End of grid is today's week's Saturday
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + (6 - todayDay));

    const totalDays = WEEKS * DAYS_PER_WEEK;
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - totalDays + 1);

    const grid: Date[][] = [];
    let completedCount = 0;
    const cursor = new Date(startDate);

    for (let w = 0; w < WEEKS; w++) {
      const week: Date[] = [];
      for (let d = 0; d < DAYS_PER_WEEK; d++) {
        week.push(new Date(cursor));
        if (completedDates.has(formatDate(cursor))) {
          completedCount++;
        }
        cursor.setDate(cursor.getDate() + 1);
      }
      grid.push(week);
    }

    return {
      weeks: grid,
      monthLabels: getMonthLabels(grid),
      stats: { completed: completedCount, total: totalDays },
    };
  }, [completedDates]);

  const gridWidth = WEEKS * (CELL_SIZE + CELL_GAP) + 24; // 24 for day labels

  return (
    <View>
      {/* Month labels */}
      <View style={{ flexDirection: 'row', marginLeft: 24, marginBottom: 4 }}>
        {monthLabels.map(({ label, colIndex }) => (
          <Text
            key={`${label}-${colIndex}`}
            style={{
              position: 'absolute',
              left: colIndex * (CELL_SIZE + CELL_GAP),
              fontSize: 10,
              color: '#a8a29e', // stone-400
              fontWeight: '500',
            }}
          >
            {label}
          </Text>
        ))}
      </View>

      <View style={{ flexDirection: 'row', marginTop: 14 }}>
        {/* Day labels */}
        <View style={{ width: 20, marginRight: 4 }}>
          {DAY_LABELS.map((label, i) => (
            <View
              key={i}
              style={{
                height: CELL_SIZE,
                marginBottom: CELL_GAP,
                justifyContent: 'center',
              }}
            >
              <Text
                style={{ fontSize: 9, color: '#a8a29e', fontWeight: '500' }}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>

        {/* Grid */}
        <View style={{ flexDirection: 'row', gap: CELL_GAP }}>
          {weeks.map((week, wi) => (
            <View key={wi} style={{ gap: CELL_GAP }}>
              {week.map((day, di) => {
                const dateStr = formatDate(day);
                const isCompleted = completedDates.has(dateStr);
                const isFuture = day > new Date();
                const { backgroundColor, opacity } = getCellColor(
                  isCompleted,
                  habitColor
                );

                return (
                  <View
                    key={di}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      borderRadius: 3,
                      backgroundColor: isFuture ? '#f5f5f4' : backgroundColor,
                      opacity: isFuture ? 0.4 : opacity,
                    }}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* Legend */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: 8,
          gap: 4,
        }}
      >
        <Text style={{ fontSize: 10, color: '#a8a29e', marginRight: 4 }}>
          Less
        </Text>
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 2,
            backgroundColor: '#e7e5e4',
          }}
        />
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 2,
            backgroundColor: habitColor,
            opacity: 0.4,
          }}
        />
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 2,
            backgroundColor: habitColor,
          }}
        />
        <Text style={{ fontSize: 10, color: '#a8a29e', marginLeft: 4 }}>
          More
        </Text>
      </View>
    </View>
  );
}
