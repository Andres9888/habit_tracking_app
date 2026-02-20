import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isToday,
} from 'date-fns';

interface MiniCalendarGridProps {
  month: Date;
  completionByDay: Record<string, { completed: number; total: number }>;
  onSelectDate: (date: Date) => void;
}

const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function getDotColor(
  date: Date,
  completionByDay: Record<string, { completed: number; total: number }>
) {
  const key = format(date, 'yyyy-MM-dd');
  const day = completionByDay[key];
  if (!day || day.total === 0) return;
  if (day.completed === day.total) return '#10b981';
  if (day.completed > 0) return '#f59e0b';
  return;
}

/** Month grid with completion dots under each date */
export const MiniCalendarGrid: React.FC<MiniCalendarGridProps> = ({
  month,
  completionByDay,
  onSelectDate,
}) => {
  const weeks = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    const rows: Date[][] = [];
    let current = start;
    while (current <= end) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(current);
        current = addDays(current, 1);
      }
      rows.push(week);
    }
    return rows;
  }, [month]);

  return (
    <View>
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        {DAY_LABELS.map((d) => (
          <Text
            key={d}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 10,
              color: '#a8a29e',
              fontWeight: '600',
            }}
          >
            {d}
          </Text>
        ))}
      </View>
      {weeks.map((week, wi) => (
        <View key={wi} style={{ flexDirection: 'row', height: 34 }}>
          {week.map((date) => {
            const inMonth = isSameMonth(date, month);
            const today = isToday(date);
            const dot = inMonth ? getDotColor(date, completionByDay) : null;
            return (
              <Pressable
                key={date.toISOString()}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => onSelectDate(date)}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: today ? '800' : '500',
                    color: inMonth
                      ? today
                        ? '#1c1917'
                        : '#57534e'
                      : '#d6d3d1',
                  }}
                >
                  {format(date, 'd')}
                </Text>
                {dot && (
                  <View
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: dot,
                      marginTop: 1,
                    }}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
};
