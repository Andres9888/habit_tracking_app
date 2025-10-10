import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameMonth, isToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import clsx from "clsx";

type HabitStatus = "done" | "missed" | "planned" | "empty";

interface HabitCalendarViewProps {
  habitId: Id<"habits">;
  tracking: Array<{ habitId: Id<"habits">; date: string; completed: boolean }>;
  toggleHabit: (args: { habitId: Id<"habits">; date: string }) => void;
}

export default function HabitCalendarView({
  habitId,
  tracking,
  toggleHabit,
}: HabitCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getHabitStatus = (dateString: string): HabitStatus => {
    const trackingEntry = tracking.find(
      (t) => t.habitId === habitId && t.date === dateString
    );

    // Parse date in local timezone to avoid timezone shifting
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (trackingEntry?.completed) return "done";
    if (date < today) return "missed";
    if (date.getTime() === today.getTime()) return "planned";
    return "empty";
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday)
  const firstDayOfWeek = monthStart.getDay();

  // Create array of empty slots for days before the month starts
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between px-2">
        <Pressable onPress={handlePreviousMonth} className="p-2 rounded-xl bg-slate-50">
          <ChevronLeft size={20} color="#64748b" />
        </Pressable>

        <Pressable onPress={handleToday} className="py-2 px-4">
          <Text className="text-base font-semibold text-slate-900 tracking-tight">
            {format(currentMonth, 'MMMM yyyy')}
          </Text>
        </Pressable>

        <Pressable onPress={handleNextMonth} className="p-2 rounded-xl bg-slate-50">
          <ChevronRight size={20} color="#64748b" />
        </Pressable>
      </View>

      <View className="flex-row px-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <View key={day} className="flex-1 items-center py-2">
            <Text className="text-[10px] font-semibold text-slate-500 tracking-widest">{day}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap px-1">
        {emptyDays.map((i) => (
          <View key={`empty-${i}`} className="w-[14.28%] aspect-square items-center justify-center p-0.5" />
        ))}

        {daysInMonth.map((date) => {
          const dateString = format(date, 'yyyy-MM-dd');
          const status = getHabitStatus(dateString);
          const isCurrentDay = isToday(date);

          // Parse date in local timezone
          const [year, month, day] = dateString.split('-').map(Number);
          const checkDate = new Date(year, month - 1, day);
          const todayCheck = new Date();
          todayCheck.setHours(0, 0, 0, 0);
          checkDate.setHours(0, 0, 0, 0);
          const isFuture = checkDate > todayCheck;

          return (
            <Pressable
              key={dateString}
              onPress={() => !isFuture && toggleHabit({ habitId, date: dateString })}
              disabled={isFuture}
              className={clsx(
                "w-[14.28%] aspect-square items-center justify-center p-0.5",
              )}
            >
              <View className={clsx(
                "flex-1 rounded-xl border bg-white items-center justify-center",
                status === "done" && "border-2 border-emerald-500 bg-emerald-50",
                status === "missed" && "border-dashed border-slate-200 bg-gray-50 opacity-70",
                status === "planned" && "border-2 border-blue-500 bg-blue-50",
                isFuture && "opacity-30 border-slate-100",
                isCurrentDay && "border-2 border-slate-900"
              )}>
                <Text
                  className={clsx(
                    "text-[13px] font-medium text-slate-500",
                    status === "done" && "text-emerald-600 font-semibold",
                    status === "missed" && "text-slate-500",
                    isFuture && "text-slate-300",
                    isCurrentDay && "text-slate-900 font-bold"
                  )}
                >
                  {format(date, 'd')}
                </Text>
                {status === "done" && (
                  <View className="mt-0.5 w-1 h-1 rounded-full bg-emerald-600" />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View className="flex-row justify-center gap-6 pt-2 pb-1">
        <View className="flex-row items-center gap-1.5">
          <View className="w-3 h-3 rounded-md border-2 border-emerald-500 bg-emerald-50" />
          <Text className="text-[11px] font-medium text-slate-500">Completed</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="w-3 h-3 rounded-md border border-dashed border-slate-200 bg-gray-50 opacity-70" />
          <Text className="text-[11px] font-medium text-slate-500">Missed</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="w-3 h-3 rounded-md border-2 border-blue-500 bg-blue-50" />
          <Text className="text-[11px] font-medium text-slate-500">Today</Text>
        </View>
      </View>
    </View>
  );
}
