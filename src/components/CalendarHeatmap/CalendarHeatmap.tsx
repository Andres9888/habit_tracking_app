/**
 * CalendarHeatmap Component
 * GitHub-style 30-day completion heatmap
 *
 * Features:
 * - Visual grid showing last 30 days
 * - Color-coded completion status
 * - Today indicator
 * - Staggered entrance animation
 * - Tap for day details
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
import { Calendar } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export interface DayData {
  completed: boolean;
  date: string; // YYYY-MM-DD format
}

export interface CalendarHeatmapProps {
  data: DayData[]; // Last 30 days, oldest first
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
    // Staggered animation - cells appear from left to right, top to bottom
    const delay = index * 15;
    opacity.value = withDelay(delay, withTiming(1, { duration: 150 }));
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

  // Determine cell appearance
  const getCellStyle = () => {
    if (isFuture) return 'bg-stone-100 opacity-40';
    if (isToday && completed) return 'bg-emerald-500 ring-2 ring-emerald-300 ring-offset-1';
    if (isToday && !completed) return 'bg-amber-100 ring-2 ring-amber-300 ring-offset-1';
    if (completed) return 'bg-emerald-500';
    return 'bg-stone-200';
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

  // Build grid data - we need 5 weeks (35 cells) to show ~30 days properly
  const gridData = useMemo(() => {
    const result: Array<DayData & { isFuture: boolean; isToday: boolean }> = [];

    // Get today's date
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    // Calculate start date (35 days ago to fill 5 weeks)
    const startDate = new Date(todayDate);
    startDate.setDate(startDate.getDate() - 34);

    // Adjust to start on a Monday
    const dayOfWeek = startDate.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToSubtract);

    // Create a map of completion data for quick lookup
    const completionMap = new Map(data.map(d => [d.date, d.completed]));

    // Generate 35 days (5 weeks)
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

  // Split into weeks (7 days each)
  const weeks = useMemo(() => {
    const result: typeof gridData[] = [];
    for (let i = 0; i < gridData.length; i += 7) {
      result.push(gridData.slice(i, i + 7));
    }
    return result;
  }, [gridData]);

  // Day labels
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <View className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50">
      {/* Header */}
      <View className="mb-4 flex-row items-center gap-2">
        <Calendar className="text-stone-600" size={20} />
        <Text className="text-lg font-semibold text-stone-800">
          Last 30 Days
        </Text>
      </View>

      {/* Day Labels Row */}
      <View className="mb-2 flex-row justify-around px-1">
        {dayLabels.map((label, idx) => (
          <View key={idx} className="w-8 items-center">
            <Text className="text-xs font-medium text-stone-400">
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
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
      <View className="mt-4 flex-row items-center justify-center gap-4">
        <View className="flex-row items-center gap-1.5">
          <View className="h-3 w-3 rounded bg-stone-200" />
          <Text className="text-xs text-stone-500">Missed</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="h-3 w-3 rounded bg-emerald-500" />
          <Text className="text-xs text-stone-500">Done</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="h-3 w-3 rounded bg-amber-100 ring-1 ring-amber-300" />
          <Text className="text-xs text-stone-500">Today</Text>
        </View>
      </View>
    </View>
  );
}

export default CalendarHeatmap;




