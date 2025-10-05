import { useMutation, useQuery } from "convex/react";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
import { Check, X, Plus, TrendingUp, Calendar, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

type HabitStatus = "done" | "missed" | "planned";

export default function HabitDetailedView() {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

  const createHabit = useMutation(api.habits.create);
  const toggleHabit = useMutation(api.habits.toggleHabit);
  const habits = useQuery(api.habits.list) ?? [];

  // Get date range for statistics
  const today = new Date();
  const last30Days = subDays(today, 30);
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);

  const canSubmit = useMemo(
    () => newHabitName.trim().length > 0,
    [newHabitName],
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

  // Calculate habit statistics
  const getHabitStats = (habitId: Id<"habits">) => {
    const habitTracking = useQuery(api.habits.getTracking, {
      dates: Array.from({ length: 30 }, (_, i) =>
        format(subDays(today, i), 'yyyy-MM-dd')
      ).reverse()
    }) ?? [];

    const habitData = habitTracking.filter(t => t.habitId === habitId);

    // Calculate streak
    let streak = 0;
    for (let i = 0; i < habitData.length; i++) {
      if (habitData[i].completed) {
        streak++;
      } else {
        break;
      }
    }

    // Calculate 30-day completion rate
    const last30DaysData = habitData.slice(-30);
    const completionRate = last30DaysData.length > 0
      ? Math.round((last30DaysData.filter(d => d.completed).length / last30DaysData.length) * 100)
      : 0;

    // Calculate this week's completion
    const weekDates = Array.from({ length: 7 }, (_, i) =>
      format(new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
    );

    const weekData = habitData.filter(d => weekDates.includes(d.date));
    const weekCompletion = weekData.length > 0
      ? Math.round((weekData.filter(d => d.completed).length / weekData.length) * 100)
      : 0;

    return {
      streak,
      completionRate,
      weekCompletion,
      totalCompletions: habitData.filter(d => d.completed).length,
      longestStreak: 0, // Would need additional calculation
    };
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Habit Details</Text>
          <Pressable
            onPress={() => setIsAdding(!isAdding)}
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
                  onPress={() => setIsAdding(false)}
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
            const stats = getHabitStats(habit._id);

            return (
              <View key={habit._id} style={styles.habitCard}>
                <View style={styles.habitHeader}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <TouchableOpacity
                    onPress={() => toggleHabit({ habitId: habit._id, date: format(today, 'yyyy-MM-dd') })}
                    style={styles.todayButton}
                    accessibilityLabel={`Toggle ${habit.name} for today`}
                    accessibilityRole="button"
                  >
                    <Text style={styles.todayButtonText}>Today</Text>
                  </TouchableOpacity>
                </View>

                {habit.notes && (
                  <Text style={styles.habitNotes}>{habit.notes}</Text>
                )}

                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <TrendingUp size={20} color="#3B82F6" />
                    <View style={styles.statContent}>
                      <Text style={styles.statValue}>{stats.streak}</Text>
                      <Text style={styles.statLabel}>Current Streak</Text>
                    </View>
                  </View>

                  <View style={styles.statItem}>
                    <Target size={20} color="#10B981" />
                    <View style={styles.statContent}>
                      <Text style={styles.statValue}>{stats.completionRate}%</Text>
                      <Text style={styles.statLabel}>30-Day Rate</Text>
                    </View>
                  </View>

                  <View style={styles.statItem}>
                    <Calendar size={20} color="#F59E0B" />
                    <View style={styles.statContent}>
                      <Text style={styles.statValue}>{stats.weekCompletion}%</Text>
                      <Text style={styles.statLabel}>This Week</Text>
                    </View>
                  </View>

                  <View style={styles.statItem}>
                    <Check size={20} color="#8B5CF6" />
                    <View style={styles.statContent}>
                      <Text style={styles.statValue}>{stats.totalCompletions}</Text>
                      <Text style={styles.statLabel}>Total Completions</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.habitFooter}>
                  <Text style={styles.footerText}>
                    Created {format(habit.createdAt, 'MMM d, yyyy')}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
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
    gap: 24,
  },
  habitCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24,
    gap: 20,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    letterSpacing: -0.3,
    flex: 1,
  },
  todayButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  todayButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  habitNotes: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: '45%',
  },
  statContent: {
    gap: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  habitFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
});