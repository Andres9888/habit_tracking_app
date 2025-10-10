// NativeWind global styles
import "../global.css";

import { useMutation, useQuery } from "convex/react";
import { addDays, format } from "date-fns";
import { Settings } from "lucide-react-native";
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

  // Get 5-day window ending with today
  const today = new Date();
  const weekDates = Array.from({ length: 5 }, (_, i) => addDays(today, i - 4));
  const weekDateStrings = weekDates.map(d => format(d, 'yyyy-MM-dd'));

  const tracking = useQuery(api.habits.getTracking, { dates: weekDateStrings }) ?? [];

  const canSubmit = useMemo(
    () => newHabitName.trim().length > 0,
    [newHabitName],
  );

  const handleToggleForm = () => {
    setIsAdding((prev) => {
      if (prev) {
        setNewHabitName("");
      }
      return !prev;
    });
  };

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
    const [year, month, day] = dateString.split('-').map(Number);
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
      setHabitOrder(habits.map(h => h._id));
    }
  }, [habits, habitOrder.length]);

  // Reorder habits based on current order state
  const orderedHabits = useMemo(() => {
    if (habitOrder.length === 0) return habits;

    const orderMap = new Map(habitOrder.map((id, index) => [id, index]));
    return [...habits].sort((a, b) => {
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
        <View className="max-w-[448px] mx-auto px-6 pt-12 pb-24 gap-8">
          <View className="flex-row items-center justify-between mb-8">
            <Text className="text-4xl font-extrabold tracking-tight text-slate-900">
              Habits
            </Text>
            <Pressable
              onPress={() => setIsSettingsOpen(true)}
              className="w-10 h-10 rounded-[10px] items-center justify-center"
              accessibilityLabel="Settings"
              accessibilityRole="button"
            >
              <Settings size={24} color="#101727" />
            </Pressable>
          </View>

          <DateSelector dates={weekDates} />

          {isAdding && (
            <View className="rounded-3xl border border-slate-200 bg-white/90 p-5 mb-8">
              <View className="gap-4">
                <View className="gap-2">
                  <Text className="text-[11px] font-semibold tracking-[3px] text-slate-500">
                    NEW HABIT
                  </Text>
                  <TextInput
                    value={newHabitName}
                    onChangeText={setNewHabitName}
                    placeholder="Name your habit"
                    autoFocus
                    className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900"
                    placeholderTextColor="#999"
                  />
                </View>
                <View className="flex-row items-center justify-end gap-3">
                  <Pressable
                    onPress={handleToggleForm}
                    className="py-2"
                    accessibilityRole="button"
                  >
                    <Text className="text-[11px] tracking-[3px] text-slate-500 font-semibold">
                      CANCEL
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSubmit}
                    disabled={!canSubmit}
                    className={`rounded-3xl border border-slate-900 px-5 py-2 ${!canSubmit ? 'opacity-40' : ''}`}
                    accessibilityRole="button"
                  >
                    <Text className="text-[11px] tracking-[3px] text-slate-900 font-semibold">
                      ADD
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          <View className="gap-4">
            {orderedHabits.map((habit) => {
              const weekStatus = weekDateStrings.map(ds => getHabitStatus(habit._id, ds));

              // Calculate streak (consecutive days completed up to today)
              const calculateStreak = () => {
                const completedDates = new Set(
                  tracking
                    .filter(t => t.habitId === habit._id && t.completed)
                    .map(t => t.date)
                );

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                let streak = 0;
                let currentDate = new Date(today);

                // Count consecutive days backward from today
                while (true) {
                  const dateString = format(currentDate, 'yyyy-MM-dd');
                  if (completedDates.has(dateString)) {
                    streak++;
                    currentDate.setDate(currentDate.getDate() - 1);
                  } else {
                    break;
                  }
                }

                return streak;
              };

              const streak = calculateStreak();

              return (
                <DraggableHabit
                  key={habit._id}
                  habit={habit}
                  weekDateStrings={weekDateStrings}
                  weekStatus={weekStatus}
                  streak={streak}
                  toggleHabit={toggleHabit}
                />
              );
            })}
          </View>
        </View>
        <Toaster />
        <SettingsModal
          visible={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </ScrollView>
    </GestureHandlerRootView>
  );
}

export default App;