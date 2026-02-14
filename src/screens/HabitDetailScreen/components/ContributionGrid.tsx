/**
 * ContributionGrid - GitHub-style streak calendar
 * Shows last 16 weeks of completion data in a compact grid
 */
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { format, subDays } from 'date-fns';

const CELL_SIZE = 13;
const CELL_GAP = 3;
const WEEKS = 16;
const DAYS = WEEKS * 7;

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

const CARD_SHADOW = {
  elevation: 4,
  shadowColor: '#1c1917',
  shadowOffset: { height: 4, width: 0 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
};

interface ContributionGridProps {
  completedDates: Set<string>;
  habitColor?: string;
  baseDelay?: number;
}

function getIntensity(
  completed: boolean,
  _habitColor: string
): string {
  // Using opacity-based green shades matching the design system
  return completed ? '#059669' : '#f5f5f4'; // emerald-600 vs stone-100
}

export function ContributionGrid({
  completedDates,
  habitColor = '#047857',
  baseDelay = 180,
}: ContributionGridProps) {
  const grid = useMemo(() => {
    const today = new Date();
    const todayDow = today.getDay(); // 0=Sun
    // Align to end of current week (Saturday)
    const endOffset = 6 - todayDow;
    const endDate = subDays(today, -endOffset);

    const weeks: { date: string; completed: boolean }[][] = [];

    for (let w = WEEKS - 1; w >= 0; w--) {
      const week: { date: string; completed: boolean }[] = [];
      for (let d = 0; d < 7; d++) {
        const dayOffset = w * 7 + (6 - d);
        const date = subDays(endDate, dayOffset);
        const dateStr = format(date, 'yyyy-MM-dd');
        const isFuture = date > today;
        week.push({
          date: dateStr,
          completed: !isFuture && completedDates.has(dateStr),
        });
      }
      weeks.push(week);
    }

    return weeks;
  }, [completedDates]);

  // Month labels
  const monthLabels = useMemo(() => {
    const today = new Date();
    const labels: { text: string; col: number }[] = [];
    let lastMonth = -1;

    for (let w = 0; w < WEEKS; w++) {
      const dayOffset = (WEEKS - 1 - w) * 7;
      const date = subDays(today, dayOffset);
      const month = date.getMonth();
      if (month !== lastMonth) {
        labels.push({ text: format(date, 'MMM'), col: w });
        lastMonth = month;
      }
    }
    return labels;
  }, []);

  return (
    <Animated.View
      className='rounded-2xl bg-white p-4'
      entering={anim(baseDelay)}
      style={CARD_SHADOW}
    >
      {/* Month labels */}
      <View className='mb-1 ml-6 flex-row'>
        {monthLabels.map((label, i) => (
          <Text
            key={`${label.text}-${i}`}
            className='text-[10px] text-stone-400'
            style={{
              position: 'absolute',
              left: label.col * (CELL_SIZE + CELL_GAP),
            }}
          >
            {label.text}
          </Text>
        ))}
      </View>

      <View className='mt-3 flex-row'>
        {/* Day labels */}
        <View className='mr-1 justify-between' style={{ width: 20 }}>
          {['', 'M', '', 'W', '', 'F', ''].map((label, i) => (
            <Text
              key={`day-${i}`}
              className='text-[10px] text-stone-400'
              style={{ height: CELL_SIZE, lineHeight: CELL_SIZE }}
            >
              {label}
            </Text>
          ))}
        </View>

        {/* Grid */}
        <View className='flex-row' style={{ gap: CELL_GAP }}>
          {grid.map((week, wi) => (
            <View key={`week-${wi}`} style={{ gap: CELL_GAP }}>
              {week.map((day, di) => (
                <View
                  key={day.date}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    borderRadius: 3,
                    backgroundColor: getIntensity(day.completed, habitColor),
                    opacity: day.completed ? 1 : 0.6,
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}
