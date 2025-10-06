import { useMutation, useQuery } from "convex/react";
import { addDays, format } from "date-fns";
import { Plus, Pencil, Check, X, GripVertical } from "lucide-react";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, TouchableOpacity, Alert, Animated } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

type HabitStatus = "done" | "missed" | "planned";

function App() {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [editingHabitId, setEditingHabitId] = useState<Id<"habits"> | null>(null);
  const [editingHabitName, setEditingHabitName] = useState("");

  const createHabit = useMutation(api.habits.create);
  const toggleHabit = useMutation(api.habits.toggleHabit);
  const updateHabitName = useMutation(api.habits.updateName);
  const habits = useQuery(api.habits.list) ?? [];
  const [habitOrder, setHabitOrder] = useState<string[]>([]);

  // Get 5-day window ending with today
  const today = new Date();
  const weekDates = Array.from({ length: 5 }, (_, i) => addDays(today, i - 4));
  const weekDateStrings = weekDates.map(d => format(d, 'yyyy-MM-dd'));

  console.log('Number of days:', weekDates.length);
  console.log('Dates:', weekDateStrings);

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
      <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Habits</Text>
            <Pressable
              onPress={handleToggleForm}
              style={styles.addButton}
              accessibilityLabel="Add habit"
              accessibilityRole="button"
            >
              <Plus size={20} strokeWidth={2.4} color="#000" />
            </Pressable>
          </View>

          {isAdding && (
            <View style={styles.addForm}>
              <View style={styles.formContent}>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>NEW HABIT</Text>
                  <TextInput
                    value={newHabitName}
                    onChangeText={setNewHabitName}
                    placeholder="Name your habit"
                    autoFocus
                    style={styles.input}
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.formActions}>
                  <Pressable
                    onPress={handleToggleForm}
                    style={styles.cancelButton}
                    accessibilityRole="button"
                  >
                    <Text style={styles.cancelButtonText}>CANCEL</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSubmit}
                    disabled={!canSubmit}
                    style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
                    accessibilityRole="button"
                  >
                    <Text style={styles.submitButtonText}>ADD</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          <View style={styles.habitsList}>
          {habits.map((habit) => {
              const weekStatus = weekDateStrings.map(ds => getHabitStatus(habit._id, ds));
              const completedCount = weekStatus.filter(s => s === "done").length;
              const completionRate = Math.round((completedCount / 5) * 100);

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
                  index={index}
                  allHabits={orderedHabits}
                  onReorder={handleReorder}
                  editingHabitId={editingHabitId}
                  editingHabitName={editingHabitName}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSaveEdit={handleSaveEdit}
                  setEditingHabitName={setEditingHabitName}
                  weekDates={weekDates}
                  weekDateStrings={weekDateStrings}
                  weekStatus={weekStatus}
                  completionRate={completionRate}
                  streak={streak}
                  toggleHabit={toggleHabit}
                />
              );
            })}
          </View>
      </View>
      <Toaster />
    </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    maxWidth: 448,
    marginHorizontal: 'auto',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 96,
    gap: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#0f172a',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addForm: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    marginBottom: 32,
  },
  formContent: {
    gap: 16,
  },
  formField: {
    gap: 8,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 3,
    color: '#64748b',
  },
  input: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },
  formActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 11,
    letterSpacing: 3,
    color: '#64748b',
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#0f172a',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    fontSize: 11,
    letterSpacing: 3,
    color: '#0f172a',
    fontWeight: '600',
  },
  habitsList: {
    gap: 32,
  },
  habitCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24,
  },
  habitHeader: {
    marginBottom: 24,
  },
  habitName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  calendarGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  dayColumn: {
    alignItems: 'center',
    gap: 8,
  },
  dayLabel: {
    fontSize: 10,
    letterSpacing: 3,
    color: '#64748b',
    fontWeight: '600',
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonDone: {
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  dayButtonMissed: {
    borderStyle: 'dashed',
  },
  dayButtonFuture: {
    opacity: 0.4,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  dayButtonTextDone: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
  dayButtonTextMissed: {
    color: '#64748b',
  },
  progressBarContainer: {
    height: 2,
    width: '100%',
    backgroundColor: '#e2e8f0',
    marginTop: 24,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0f172a',
  },
  habitStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  statText: {
    fontSize: 11,
    letterSpacing: 3,
    color: '#64748b',
    fontWeight: '600',
  },
});

export default App;