import { format, isToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { View, Text, Pressable } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import clsx from "clsx";
import { useHabitCalendarViewLogic } from "./HabitCalendarView.hooks";

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
  const {
    currentMonth,
    daysInMonth,
    emptyDays,
    getHabitStatus,
    handlePreviousMonth,
    handleNextMonth,
    handleToday,
  } = useHabitCalendarViewLogic({ habitId, tracking });

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between px-2">
        <Pressable
          className="rounded-xl bg-slate-50 p-2"
          onPress={handlePreviousMonth}
        >
          <ChevronLeft color="#64748b" size={20} />
        </Pressable>

        <Pressable className="px-4 py-2" onPress={handleToday}>
          <Text className="text-base font-semibold tracking-tight text-slate-900">
            {format(currentMonth, "MMMM yyyy")}
          </Text>
        </Pressable>

        <Pressable
          className="rounded-xl bg-slate-50 p-2"
          onPress={handleNextMonth}
        >
          <ChevronRight color="#64748b" size={20} />
        </Pressable>
      </View>

      <View className="flex-row px-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <View key={day} className="flex-1 items-center py-2">
            <Text className="text-[10px] font-semibold tracking-widest text-slate-500">
              {day}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap px-1">
        {emptyDays.map((i) => (
          <View
            key={`empty-${i}`}
            className="aspect-square w-[14.28%] items-center justify-center p-0.5"
          />
        ))}

        {daysInMonth.map((date) => {
          const dateString = format(date, "yyyy-MM-dd");
          const status = getHabitStatus(dateString);
          const isCurrentDay = isToday(date);

          // Parse date in local timezone
          const [year, month, day] = dateString.split("-").map(Number);
          const checkDate = new Date(year, month - 1, day);
          const todayCheck = new Date();
          todayCheck.setHours(0, 0, 0, 0);
          checkDate.setHours(0, 0, 0, 0);
          const isFuture = checkDate > todayCheck;

          return (
            <Pressable
              key={dateString}
              className={clsx(
                "aspect-square w-[14.28%] items-center justify-center p-0.5"
              )}
              disabled={isFuture}
              onPress={() =>
                !isFuture && toggleHabit({ habitId, date: dateString })
              }
            >
              <View
                className={clsx(
                  "flex-1 items-center justify-center rounded-xl border bg-white",
                  status === "done" &&
                    "border-2 border-emerald-500 bg-emerald-50",
                  status === "missed" &&
                    "border-dashed border-slate-200 bg-gray-50 opacity-70",
                  status === "planned" && "border-2 border-blue-500 bg-blue-50",
                  isFuture && "border-slate-100 opacity-30",
                  isCurrentDay && "border-2 border-slate-900"
                )}
              >
                <Text
                  className={clsx(
                    "text-[13px] font-medium text-slate-500",
                    status === "done" && "font-semibold text-emerald-600",
                    status === "missed" && "text-slate-500",
                    isFuture && "text-slate-300",
                    isCurrentDay && "font-bold text-slate-900"
                  )}
                >
                  {format(date, "d")}
                </Text>
                {status === "done" && (
                  <View className="mt-0.5 h-1 w-1 rounded-full bg-emerald-600" />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View className="flex-row justify-center gap-6 pb-1 pt-2">
        <View className="flex-row items-center gap-1.5">
          <View className="h-3 w-3 rounded-md border-2 border-emerald-500 bg-emerald-50" />
          <Text className="text-[11px] font-medium text-slate-500">
            Completed
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="h-3 w-3 rounded-md border border-dashed border-slate-200 bg-gray-50 opacity-70" />
          <Text className="text-[11px] font-medium text-slate-500">Missed</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="h-3 w-3 rounded-md border-2 border-blue-500 bg-blue-50" />
          <Text className="text-[11px] font-medium text-slate-500">Today</Text>
        </View>
      </View>
    </View>
  );
}
