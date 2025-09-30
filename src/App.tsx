import { useMutation, useQuery } from "convex/react";
import { addDays, format } from "date-fns";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from "react-native";
import { Toaster } from "sonner";
import { api } from "../convex/_generated/api";

type HabitStatus = "done" | "missed" | "planned";

function App() {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

  const createHabit = useMutation(api.habits.create);
  const toggleHabit = useMutation(api.habits.toggleHabit);
  const habits = useQuery(api.habits.list) ?? [];

  // Get 7-day window ending with today
  const today = new Date();
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
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

    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (trackingEntry?.completed) return "done";
    if (date < today) return "missed";
    return "planned";
  };

  return (
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
              const completionRate = Math.round((completedCount / 7) * 100);

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
                <View key={habit._id} style={styles.habitCard}>
                  <View style={styles.habitHeader}>
                    <Text style={styles.habitName}>{habit.name}</Text>
                  </View>
                  <View style={styles.calendarGrid}>
                    {weekDates.map((date, index) => {
                      const state = weekStatus[index];
                      const dateString = weekDateStrings[index];
                      const checkDate = new Date(dateString);
                      const todayCheck = new Date();
                      todayCheck.setHours(0, 0, 0, 0);
                      checkDate.setHours(0, 0, 0, 0);
                      const isFuture = checkDate > todayCheck;
                      const dayLabel = format(date, 'EEE').substring(0, 3);

                      return (
                        <View
                          key={`${habit._id}-${dateString}`}
                          style={styles.dayColumn}
                        >
                          <Text style={styles.dayLabel}>{dayLabel.toUpperCase()}</Text>
                          <Pressable
                            onPress={() => !isFuture && toggleHabit({ habitId: habit._id, date: dateString })}
                            disabled={isFuture}
                            style={[
                              styles.dayButton,
                              state === "done" && styles.dayButtonDone,
                              state === "missed" && styles.dayButtonMissed,
                              isFuture && styles.dayButtonFuture
                            ]}
                            accessibilityLabel={`Toggle ${habit.name} on ${format(date, 'MMM d')}`}
                            accessibilityRole="button"
                          >
                            <Text style={[
                              styles.dayButtonText,
                              state === "done" && styles.dayButtonTextDone,
                              state === "missed" && styles.dayButtonTextMissed
                            ]}>
                              {state === "done" ? "✓" : state === "missed" ? "–" : "·"}
                            </Text>
                          </Pressable>
                        </View>
                      );
                    })}
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${completionRate}%` }]} />
                  </View>
                  <View style={styles.habitStats}>
                    <Text style={styles.statText}>STREAK · {streak} DAYS</Text>
                    <Text style={styles.statText}>{completionRate}% THIS WEEK</Text>
                  </View>
                </View>
              );
            })}
          </View>
      </View>
      <Toaster />
    </ScrollView>
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