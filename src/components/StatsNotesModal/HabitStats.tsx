import { useQuery } from 'convex/react';
import { format, startOfDay, subDays } from 'date-fns';
import { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import Svg, { Line, Circle, Rect, Text as SvgText } from 'react-native-svg';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

export default function HabitStats() {
  const habits = useQuery(api.habits.list) ?? [];
  const [selectedHabitId, setSelectedHabitId] = useState<Id<'habits'> | null>(
    habits[0]?._id ?? null
  );

  const today = useMemo(() => startOfDay(new Date()), []);

  // Get last 30 days for trend chart
  const last30Days = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) =>
        format(subDays(today, 29 - i), 'yyyy-MM-dd')
      ),
    [today]
  );

  // Get last 7 days for weekly bar chart
  const last7Days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        format(subDays(today, 6 - i), 'yyyy-MM-dd')
      ),
    [today]
  );

  const tracking30 =
    useQuery(api.habits.getTracking, { dates: last30Days }) ?? [];
  const tracking7 =
    useQuery(api.habits.getTracking, { dates: last7Days }) ?? [];

  const selectedHabit = habits.find((h) => h._id === selectedHabitId);

  // Calculate stats for selected habit
  const habitStats = useMemo(() => {
    if (!selectedHabitId) return null;

    const habitTracking30 = tracking30.filter(
      (t) => t.habitId === selectedHabitId
    );
    const habitTracking7 = tracking7.filter(
      (t) => t.habitId === selectedHabitId
    );

    // Calculate current streak
    const completedDates = new Set(
      habitTracking30.filter((t) => t.completed).map((t) => t.date)
    );
    let currentStreak = 0;
    const currentDate = new Date(today);

    while (true) {
      const dateString = format(currentDate, 'yyyy-MM-dd');
      if (completedDates.has(dateString)) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate longest streak in 30-day period
    let longestStreak = 0;
    let tempStreak = 0;

    for (const dateStr of last30Days) {
      if (completedDates.has(dateStr)) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // 30-day completion data for line chart
    const completionData = last30Days.map((date) => ({
      completed: habitTracking30.some((t) => t.date === date && t.completed),
      date,
    }));

    // 7-day completion data for bar chart
    const weeklyData = last7Days.map((date) => ({
      completed: habitTracking7.some((t) => t.date === date && t.completed),
      date,
    }));

    return {
      completionData,
      currentStreak,
      longestStreak,
      weeklyData,
    };
  }, [selectedHabitId, tracking30, tracking7, last30Days, last7Days, today]);

  if (habits.length === 0) {
    return (
      <View className='items-center py-8'>
        <Text className='text-center text-sm text-slate-500'>
          No habits yet. Create your first habit to see stats!
        </Text>
      </View>
    );
  }

  return (
    <View className='gap-4'>
      <Text className='text-lg font-semibold text-slate-900'>
        Per-Habit Stats
      </Text>

      {/* Habit selector */}
      <View className='gap-2'>
        <Text className='text-xs font-semibold uppercase tracking-[2px] text-slate-500'>
          SELECT HABIT
        </Text>
        <ScrollView
          horizontal
          className='flex-row gap-2'
          showsHorizontalScrollIndicator={false}
        >
          {habits.map((habit) => (
            <TouchableOpacity
              key={habit._id}
              accessibilityLabel={`View stats for ${habit.name}`}
              accessibilityRole='button'
              className={`rounded-xl px-4 py-2 ${
                selectedHabitId === habit._id ? 'bg-slate-900' : 'bg-slate-100'
              }`}
              onPress={() => setSelectedHabitId(habit._id)}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedHabitId === habit._id
                    ? 'text-white'
                    : 'text-slate-700'
                }`}
              >
                {habit.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {selectedHabit && habitStats && (
        <View className='gap-4'>
          {/* Streaks */}
          <View className='flex-row gap-3'>
            <View className='flex-1 rounded-2xl bg-slate-50 p-4'>
              <Text className='text-xs font-semibold uppercase tracking-[2px] text-slate-500'>
                CURRENT STREAK
              </Text>
              <View className='mt-2 flex-row items-baseline gap-2'>
                <Text className='text-3xl font-bold text-[#48bb78]'>
                  {habitStats.currentStreak}
                </Text>
                <Text className='text-xl font-semibold text-slate-400'>
                  {habitStats.currentStreak === 1 ? 'day' : 'days'}
                </Text>
              </View>
            </View>
            <View className='flex-1 rounded-2xl bg-slate-50 p-4'>
              <Text className='text-xs font-semibold uppercase tracking-[2px] text-slate-500'>
                LONGEST STREAK
              </Text>
              <View className='mt-2 flex-row items-baseline gap-2'>
                <Text className='text-3xl font-bold text-[#48bb78]'>
                  {habitStats.longestStreak}
                </Text>
                <Text className='text-xl font-semibold text-slate-400'>
                  {habitStats.longestStreak === 1 ? 'day' : 'days'}
                </Text>
              </View>
            </View>
          </View>

          {/* Weekly bar chart */}
          <View className='rounded-2xl bg-slate-50 p-4'>
            <Text className='mb-3 text-xs font-semibold uppercase tracking-[2px] text-slate-500'>
              LAST 7 DAYS
            </Text>
            <WeeklyBarChart data={habitStats.weeklyData} />
          </View>

          {/* 30-day trend line chart */}
          <View className='rounded-2xl bg-slate-50 p-4'>
            <Text className='mb-3 text-xs font-semibold uppercase tracking-[2px] text-slate-500'>
              30-DAY TREND
            </Text>
            <TrendLineChart data={habitStats.completionData} />
          </View>
        </View>
      )}
    </View>
  );
}

// Simple bar chart for weekly view
function WeeklyBarChart({
  data,
}: {
  data: Array<{ date: string; completed: boolean }>;
}) {
  const chartWidth = 300;
  const chartHeight = 120;
  const barWidth = chartWidth / data.length - 8;
  const maxHeight = chartHeight - 30;

  return (
    <View className='items-center'>
      <Svg height={chartHeight} width={chartWidth}>
        {data.map((item, index) => {
          const x = index * (chartWidth / data.length) + 4;
          const barHeight = item.completed ? maxHeight : 10;
          const y = chartHeight - barHeight - 20;

          return (
            <View key={item.date}>
              <Rect
                fill={item.completed ? '#48bb78' : '#dde3ed'}
                height={barHeight}
                rx={4}
                width={barWidth}
                x={x}
                y={y}
              />
              <SvgText
                fill='#64748b'
                fontSize='10'
                textAnchor='middle'
                x={x + barWidth / 2}
                y={chartHeight - 5}
              >
                {format(new Date(item.date), 'EEE')[0]}
              </SvgText>
            </View>
          );
        })}
      </Svg>
      <Text className='mt-2 text-xs text-slate-500'>
        {format(new Date(data[0].date), 'MMM d')} -{' '}
        {format(new Date(data.at(-1).date), 'MMM d')}
      </Text>
    </View>
  );
}

// Simple line chart for 30-day trend
function TrendLineChart({
  data,
}: {
  data: Array<{ date: string; completed: boolean }>;
}) {
  const chartWidth = 300;
  const chartHeight = 100;
  const pointRadius = 3;

  // Calculate points
  const points = data.map((item, index) => ({
    completed: item.completed,
    x: (index / (data.length - 1)) * chartWidth,
    y: item.completed ? 20 : chartHeight - 20,
  }));

  // Create path for line
  const pathData = points
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `L ${point.x} ${point.y}`;
    })
    .join(' ');

  return (
    <View className='items-center'>
      <Svg height={chartHeight} width={chartWidth}>
        {/* Grid lines */}
        <Line
          stroke='#e2e8f0'
          strokeDasharray='4,4'
          strokeWidth='1'
          x1='0'
          x2={chartWidth}
          y1={chartHeight / 2}
          y2={chartHeight / 2}
        />

        {/* Line path */}
        <Line
          stroke='#cbd5e1'
          strokeWidth='1'
          x1={points[0]?.x ?? 0}
          x2={points.at(-1)?.x ?? 0}
          y1={points[0]?.y ?? 0}
          y2={points.at(-1)?.y ?? 0}
        />

        {/* Points */}
        {points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            fill={point.completed ? '#48bb78' : '#dde3ed'}
            r={pointRadius}
            stroke={point.completed ? '#48bb78' : '#94a3b8'}
            strokeWidth='1.5'
          />
        ))}

        {/* Labels */}
        <SvgText fill='#64748b' fontSize='10' textAnchor='start' x='0' y='15'>
          ✓
        </SvgText>
        <SvgText
          fill='#64748b'
          fontSize='10'
          textAnchor='start'
          x='0'
          y={chartHeight - 10}
        >
          ✗
        </SvgText>
      </Svg>
      <Text className='mt-2 text-xs text-slate-500'>
        {format(new Date(data[0].date), 'MMM d')} -{' '}
        {format(new Date(data.at(-1).date), 'MMM d')}
      </Text>
    </View>
  );
}
