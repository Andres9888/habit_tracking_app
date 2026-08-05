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
  isFuture,
} from 'date-fns';

import { useThemeColors } from '../../../theme/ThemeContext';
import { DAY_LABELS, getDotColor, getGridColors } from './MiniCalendarGrid.helpers';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';

interface MiniCalendarGridProps {
  month: Date;
  completionByDay: Record<string, { completed: number; total: number }>;
  onSelectDate: (date: Date) => void;
}

/** Month grid with completion dots under each date */
export const MiniCalendarGrid: React.FC<MiniCalendarGridProps> = ({
  month,
  completionByDay,
  onSelectDate,
}) => {
  const { isDark } = useThemeColors();
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

  const c = getGridColors(isDark);

  return (
    <View>
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        {DAY_LABELS.map((d) => (
          <Text
            key={d}
            style={{ flex: 1, textAlign: 'center', fontFamily: fontFamilies.primary.text, fontSize: typography.tabBar.fontSize, color: c.label, fontWeight: fontWeights.semibold }}
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
            const future = isFuture(date);
            const dot = inMonth && !future ? getDotColor(date, completionByDay) : null;
            return (
              <Pressable
                key={date.toISOString()}
                disabled={future}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center', opacity: future ? 0.35 : 1 }}
                onPress={() => onSelectDate(date)}
              >
                <Text
                  style={{
                    fontFamily: fontFamilies.primary.text,
                    fontSize: typography.caption.fontSize,
                    fontWeight: today ? fontWeights.bold : fontWeights.medium,
                    color: inMonth ? (today ? c.today : c.text) : c.muted,
                  }}
                >
                  {format(date, 'd')}
                </Text>
                {dot ? <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: dot, marginTop: 1 }} /> : null}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
};
