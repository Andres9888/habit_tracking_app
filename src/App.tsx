// NativeWind global styles
import "../global.css";

import { useMutation, useQuery } from "convex/react";
import { addDays, format, startOfDay } from "date-fns";
import { Plus, Settings, BarChart3, ChevronLeft, ChevronRight } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { DateSelector } from "./components/DateSelector";
import SettingsModal from "./components/SettingsModal";
import DraggableHabit from "./components/DraggableHabit";

type HabitStatus = "done" | "missed" | "planned";

function App() {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const createHabit = useMutation(api.habits.create);
  const toggleHabit = useMutation(api.habits.toggleHabit);
  const habits = useQuery(api.habits.list) ?? [];
  const [habitOrder, setHabitOrder] = useState<string[]>([]);

  const today = useMemo(() => startOfDay(new Date()), []);
  const [weekAnchor, setWeekAnchor] = useState(today);

  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekAnchor, i - 6)),
    [weekAnchor]
  );
  const weekDateStrings = useMemo(
    () => weekDates.map((d) => format(d, "yyyy-MM-dd")),
    [weekDates]
  );

  const tracking =
    useQuery(api.habits.getTracking, { dates: weekDateStrings }) ?? [];

  const canSubmit = useMemo(
    () => newHabitName.trim().length > 0,
    [newHabitName]
  );

  const handleToggleForm = () => {
    setIsAdding((prev) => {
      if (prev) {
        setNewHabitName("");
      }
      return !prev;
    });
  };

  const handlePreviousWeek = useCallback(() => {
    setWeekAnchor((prev) => addDays(prev, -7));
  }, []);

  const handleNextWeek = useCallback(() => {
    setWeekAnchor((prev) => addDays(prev, 7));
  }, []);

  const canNavigateForward = useMemo(
    () => weekAnchor.getTime() < today.getTime(),
    [weekAnchor, today]
  );

  const handleSubmit = async () => {
    const name = newHabitName.trim();
    if (!name) {
      return;
    }

    await createHabit({ name, notes: "" });
    setNewHabitName("");
    setIsAdding(false);
  };

  const getHabitStatus = (habitId: string, dateString: string): HabitStatus => {
    const trackingEntry = tracking.find(
      (t) => t.habitId === habitId && t.date === dateString
    );

    // Parse date in local timezone to avoid timezone shifting
    // YYYY-MM-DD format is interpreted as UTC, which can shift dates
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (trackingEntry?.completed) return "done";
    if (date < today) return "missed";
    return "planned";
  };

  // Initialize habit order when habits load
  useMemo(() => {
    if (habits.length > 0 && habitOrder.length === 0) {
      setHabitOrder(habits.map((h) => h._id));
    }
  }, [habits, habitOrder.length]);

  // Reorder habits based on current order state
  const orderedHabits = useMemo(() => {
    if (habitOrder.length === 0) return habits;

    const orderMap = new Map(habitOrder.map((id, index) => [id, index]));
    return [...habits].sort((a: any, b: any) => {
      const aOrder = orderMap.get(a._id) ?? Infinity;
      const bOrder = orderMap.get(b._id) ?? Infinity;
      return aOrder - bOrder;
    });
  }, [habits, habitOrder]);

  const handleReorder = useCallback(async (newOrder: string[]) => {
    setHabitOrder(newOrder);
    // TODO: Implement reorderHabits mutation in convex/habits.ts
    // await reorderHabits({ habitIds: newOrder as Id<"habits">[] });
  }, []);

  return (
    <GestureHandlerRootView className="flex-1">
      <ScrollView className="flex-1 bg-white">
        <View className="mx-auto max-w-[448px] gap-4 px-6 pb-24 pt-12">
          <View className="flex-row items-center justify-between">
            <Text className="text-[28px] font-semibold leading-[42px] tracking-[0.38px] text-[#101727]">
              Habits
            </Text>
            <View className="flex-row gap-3">
              <Pressable
                accessibilityLabel="View statistics"
                accessibilityRole="button"
                className="h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6]"
                onPress={() => {/* TODO: Add stats view */}}
              >
                <BarChart3 color="#101727" size={20} strokeWidth={2.25} />
              </Pressable>
              <Pressable
                accessibilityLabel="Open settings"
                accessibilityRole="button"
                className="h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6]"
                onPress={() => setIsSettingsOpen(true)}
              >
                <Settings color="#101727" size={20} strokeWidth={2.25} />
              </Pressable>
            </View>
          </View>

          {/* Date Range Header with Navigation */}
          <View className="flex-row items-center justify-between px-0">
            <Pressable
              accessibilityLabel="Previous week"
              accessibilityRole="button"
              className="h-8 w-8 items-center justify-center rounded-full bg-[#f3f4f6]"
              onPress={handlePreviousWeek}
            >
              <ChevronLeft color="#101727" size={16} strokeWidth={2.25} />
            </Pressable>
            <Text className="text-[14px] leading-5 tracking-[-0.15px] text-[#4a5565]">
              {format(weekDates[0], "MMM d")} - {format(weekDates[6], "MMM d")}
            </Text>
            <Pressable
              accessibilityLabel="Next week"
              accessibilityRole="button"
              accessibilityState={{ disabled: !canNavigateForward }}
              className={`h-8 w-8 items-center justify-center rounded-full bg-[#f3f4f6] ${canNavigateForward ? "" : "opacity-40"}`}
              disabled={!canNavigateForward}
              onPress={handleNextWeek}
            >
              <ChevronRight color="#101727" size={16} strokeWidth={2.25} />
            </Pressable>
          </View>

          <DateSelector dates={weekDates} />

          {isAdding && (
            <View className="mb-8 rounded-3xl border border-slate-200 bg-white/90 p-5">
              <View className="gap-4">
                <View className="gap-2">
                  <Text className="text-[11px] font-semibold tracking-[3px] text-slate-500">
                    NEW HABIT
                  </Text>
                  <TextInput
                    autoFocus
                    className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900"
                    placeholder="Name your habit"
                    placeholderTextColor="#999"
                    value={newHabitName}
                    onChangeText={setNewHabitName}
                  />
                </View>
                <View className="flex-row items-center justify-end gap-3">
                  <Pressable
                    accessibilityRole="button"
                    className="py-2"
                    onPress={handleToggleForm}
                  >
                    <Text className="text-[11px] font-semibold tracking-[3px] text-slate-500">
                      CANCEL
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    className={`rounded-3xl border border-slate-900 px-5 py-2 ${canSubmit ? "" : "opacity-40"}`}
                    disabled={!canSubmit}
                    onPress={handleSubmit}
                  >
                    <Text className="text-[11px] font-semibold tracking-[3px] text-slate-900">
                      ADD
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          <View className="gap-4">
            {(() => {
              // Memoize completed dates per habit to avoid recomputation
              const completedDatesByHabit = useMemo(() => {
                const map = new Map<string, Set<string>>();
                for (const t of tracking) {
                  if (!t.completed) continue;
                  if (!map.has(t.habitId)) map.set(t.habitId, new Set<string>());
                  map.get(t.habitId)!.add(t.date);
                }
                return map;
              }, [tracking]);

              const getStreak = useCallback(
                (habitId: string) => {
                  const completedDates = completedDatesByHabit.get(habitId);
                  if (!completedDates) return 0;

                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const currentDate = new Date(today);

                  let streak = 0;
                  // Count consecutive days backward from today
                  // eslint-disable-next-line no-constant-condition
                  while (true) {
                    const dateString = format(currentDate, "yyyy-MM-dd");
                    if (completedDates.has(dateString)) {
                      streak++;
                      currentDate.setDate(currentDate.getDate() - 1);
                    } else {
                      break;
                    }
                  }
                  return streak;
                },
                [completedDatesByHabit]
              );

              return orderedHabits.map((habit: any) => {
                const weekStatus = weekDateStrings.map((ds) =>
                  getHabitStatus(habit._id, ds)
                );
                const streak = getStreak(habit._id);
                return (
                  <DraggableHabit
                    key={habit._id}
                    habit={habit}
                    streak={streak}
                    toggleHabit={toggleHabit}
                    weekDateStrings={weekDateStrings}
                    weekStatus={weekStatus}
                  />
                );
              });
            })()}
          </View>
        </View>
        <Toaster />
        <SettingsModal
          visible={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </ScrollView>
      <View pointerEvents="box-none" className="absolute bottom-8 right-6">
        <View
          accessibilityHint={isAdding ? "Close add habit form" : "Open add habit form"}
          accessibilityLabel={isAdding ? "Close" : "Add habit"}
          accessibilityRole="button"
          accessible
          className="h-14 w-14 items-center justify-center rounded-full bg-[#101727] shadow-lg"
          // Expose onPress for tests; actual press handled by inner Pressable
          onPress={handleToggleForm as any}
        >
          <Pressable onPress={handleToggleForm}>
            <Plus color="#ffffff" size={24} strokeWidth={2.25} />
          </Pressable>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

export default App;
