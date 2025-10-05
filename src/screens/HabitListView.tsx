import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { Check, X, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

type HabitStatus = "done" | "missed" | "planned";

export default function HabitListView() {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

  const createHabit = useMutation(api.habits.create);
  const toggleHabit = useMutation(api.habits.toggleHabit);
  const habits = useQuery(api.habits.list) ?? [];

  // Get today's date for tracking
  const today = format(new Date(), 'yyyy-MM-dd');

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

  const getHabitStatus = (habitId: string): HabitStatus => {
    const todayTracking = useQuery(api.habits.getTracking, { dates: [today] }) ?? [];
    const trackingEntry = todayTracking.find(
      (t) => t.habitId === habitId && t.date === today
    );

    if (trackingEntry?.completed) return "done";
    return "planned";
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Habit Kit</Text>
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
            const status = getHabitStatus(habit._id);

            return (
              <View key={habit._id} style={styles.habitCard}>
                <View style={styles.habitMain}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <TouchableOpacity
                    onPress={() => toggleHabit({ habitId: habit._id, date: today })}
                    style={[
                      styles.statusButton,
                      status === "done" && styles.statusButtonDone
                    ]}
                    accessibilityLabel={`Toggle ${habit.name} for today`}
                    accessibilityRole="button"
                  >
                    {status === "done" ? (
                      <Check size={20} color="#10B981" />
                    ) : (
                      <View style={styles.statusButtonEmpty} />
                    )}
                  </TouchableOpacity>
                </View>

                {habit.notes && (
                  <Text style={styles.habitNotes}>{habit.notes}</Text>
                )}

                <View style={styles.habitStats}>
                  <Text style={styles.statText}>Created {format(habit.createdAt, 'MMM d, yyyy')}</Text>
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
    gap: 16,
  },
  habitCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    gap: 12,
  },
  habitMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    letterSpacing: -0.3,
    flex: 1,
  },
  statusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusButtonDone: {
    borderColor: '#10B981',
    backgroundColor: '#ecfdf5',
  },
  statusButtonEmpty: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  habitNotes: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  habitStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
});