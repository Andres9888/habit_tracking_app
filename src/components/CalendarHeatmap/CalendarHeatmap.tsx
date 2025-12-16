/**
 * CalendarHeatmap Component
 * GitHub-style 30-day completion heatmap with intensity levels
 */

import React, { useEffect, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Calendar, Grid3X3 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export interface DayData {
  completed: boolean;
  date: string;
}

export interface CalendarHeatmapProps {
  data: DayData[];
  onDayPress?: (date: string, completed: boolean) => void;
}

interface DayCellProps {
  completed: boolean;
  date: string;
  index: number;
  isFuture: boolean;
  isToday: boolean;
  onPress?: (date: string, completed: boolean) => void;
}

function DayCell({ completed, date, index, isFuture, isToday, onPress }: DayCellProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = index * 12;
    opacity.value = withDelay(delay, withTiming(1, { duration: 120 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 15, stiffness: 300 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (isFuture) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(date, completed);
  };

  const getCellStyle = () => {
    if (isFuture) return 'bg-stone-50';
    if (isToday && completed) return 'bg-emerald-500 shadow-sm shadow-emerald-200';
    if (isToday && !completed) return 'border-2 border-amber-400 bg-amber-50';
    if (completed) return 'bg-emerald-500';
    return 'bg-stone-100';
  };

  return (
    <Pressable
      accessibilityLabel={`${date}, ${completed ? 'completed' : 'not completed'}${isToday ? ', today' : ''}`}
      accessibilityRole="button"
      disabled={isFuture}
      onPress={handlePress}
    >
      <Animated.View
        className={`h-8 w-8 rounded-lg ${getCellStyle()}`}
        style={animatedStyle}
      />
    </Pressable>
  );
}

export function CalendarHeatmap({ data, onDayPress }: CalendarHeatmapProps) {
  const today = new Date().toISOString().split('T')[0];

  // Calculate completion stats
  const completedCount = data.filter((d) => d.completed).length;
  const totalDays = data.length;

  const gridData = useMemo(() => {
    const result: Array<DayData & { isFuture: boolean; isToday: boolean }> = [];
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const startDate = new Date(todayDate);
    startDate.setDate(startDate.getDate() - 34);

    const dayOfWeek = startDate.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToSubtract);

    const completionMap = new Map(data.map((d) => [d.date, d.completed]));

    for (let i = 0; i < 35; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];

      const isFuture = currentDate > todayDate;
      const isToday = dateStr === today;
      const completed = completionMap.get(dateStr) ?? false;

      result.push({
        completed: isFuture ? false : completed,
        date: dateStr,
        isFuture,
        isToday,
      });
    }

    return result;
  }, [data, today]);

  const weeks = useMemo(() => {
    const result: typeof gridData[] = [];
    for (let i = 0; i < gridData.length; i += 7) {
      result.push(gridData.slice(i, i + 7));
    }
    return result;
  }, [gridData]);

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <View className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Grid3X3 className="text-stone-500" size={18} />
          <Text className="text-lg font-semibold text-stone-800">Activity</Text>
        </View>
        <View className="flex-row items-center gap-1 rounded-full bg-emerald-50 px-3 py-1">
          <Text className="text-sm font-bold text-emerald-700">{completedCount}</Text>
          <Text className="text-sm text-emerald-600">/ {totalDays}</Text>
        </View>
      </View>

      {/* Day Labels */}
      <View className="mb-2 flex-row justify-around px-1">
        {dayLabels.map((label, idx) => (
          <View key={idx} className="w-8 items-center">
            <Text className="text-xs font-medium text-stone-400">{label}</Text>
          </View>
        ))}
      </View>

      {/* Grid */}
      <View className="gap-1.5">
        {weeks.map((week, weekIdx) => (
          <View key={weekIdx} className="flex-row justify-around">
            {week.map((day, dayIdx) => (
              <DayCell
                key={day.date}
                completed={day.completed}
                date={day.date}
                index={weekIdx * 7 + dayIdx}
                isFuture={day.isFuture}
                isToday={day.isToday}
                onPress={onDayPress}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View className="mt-4 flex-row items-center justify-center gap-5">
        <View className="flex-row items-center gap-2">
          <View className="h-4 w-4 rounded bg-stone-100" />
          <Text className="text-xs text-stone-500">Missed</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="h-4 w-4 rounded bg-emerald-500" />
          <Text className="text-xs text-stone-500">Done</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="h-4 w-4 rounded border-2 border-amber-400 bg-amber-50" />
          <Text className="text-xs text-stone-500">Today</Text>
        </View>
      </View>
    </View>
  );
}

export default CalendarHeatmap;
