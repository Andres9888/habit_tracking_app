// NativeWind global styles
import "../global.css";

import { useMutation, useQuery } from "convex/react";
import { addDays, format, startOfDay } from "date-fns";
import { Plus, Settings, BarChart3, User } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { Toaster } from "sonner";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { DateSelector } from "./components/DateSelector";
import SettingsModal from "./components/SettingsModal";
import StatsNotesModal from "./components/StatsNotesModal";
import CreateHabitModal from "./components/CreateHabitModal";
import DraggableHabit from "./components/DraggableHabit";
import CharacterScreen from "./screens/CharacterScreen";

type HabitStatus = "done" | "missed" | "planned";

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsNotesOpen, setIsStatsNotesOpen] = useState(false);
  const [isCreateHabitOpen, setIsCreateHabitOpen] = useState(false);
  const [showCharacterScreen, setShowCharacterScreen] = useState(false);

  const toggleHabit = useMutation(api.habits.toggleHabit);
  const archiveHabit = useMutation(api.habits.archive);
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

  const handleToggleForm = () => {
    setIsCreateHabitOpen(true);
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

  const handleArchive = useCallback(
    async (habitId: Id<"habits">) => {
      await archiveHabit({ habitId });
    },
    [archiveHabit]
  );

  if (showCharacterScreen) {
    return <CharacterScreen onBack={() => setShowCharacterScreen(false)} />;
  }

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
                accessibilityLabel="View character"
                accessibilityRole="button"
                className="h-9 w-9 items-center justify-center rounded-full bg-purple-100"
                onPress={() => setShowCharacterScreen(true)}
              >
                <User color="#9333ea" size={20} strokeWidth={2.25} />
              </Pressable>
              <Pressable
                accessibilityLabel="View statistics and notes"
                accessibilityRole="button"
                className="h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6]"
                onPress={() => setIsStatsNotesOpen(true)}
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

          <DateSelector
            canNavigateForward={canNavigateForward}
            dates={weekDates}
            onNextWeek={handleNextWeek}
            onPreviousWeek={handlePreviousWeek}
          />

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
                    onArchive={handleArchive}
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
        <StatsNotesModal
          visible={isStatsNotesOpen}
          onClose={() => setIsStatsNotesOpen(false)}
        />
        <CreateHabitModal
          visible={isCreateHabitOpen}
          onClose={() => setIsCreateHabitOpen(false)}
        />
      </ScrollView>
      <View pointerEvents="box-none" className="absolute bottom-8 right-6">
        <Pressable
          accessibilityHint="Open create habit modal"
          accessibilityLabel="Add habit"
          accessibilityRole="button"
          className="h-14 w-14 items-center justify-center rounded-full bg-[#101727] shadow-lg"
          onPress={handleToggleForm}
        >
          <Plus color="#ffffff" size={24} strokeWidth={2.25} />
        </Pressable>
      </View>
    </GestureHandlerRootView>
  );
}

export default App;
