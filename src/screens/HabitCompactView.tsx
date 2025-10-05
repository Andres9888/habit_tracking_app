import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { Check, Plus, Circle } from "lucide-react";
import { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

type HabitStatus = "done" | "missed" | "planned";

export default function HabitCompactView() {
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Quick Check</Text>
          <Pressable
            onPress={() => setIsAdding(!isAdding)}
            style={styles.addButton}
            accessibilityLabel="Add habit"
            accessibilityRole="button"
          >
            <Plus size={18} strokeWidth={2.4} color="#000" />
          </Pressable>
        </View>

        {isAdding && (
          <View style={styles.addForm}>
            <View style={styles.formContent}>
              <View style={styles.formField}>
                <TextInput
                  value={newHabitName}
                  onChangeText={setNewHabitName}
                  placeholder="New habit"
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
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleSubmit}
                  disabled={!canSubmit}
                  style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
                  accessibilityRole="button"
                >
                  <Text style={styles.submitButtonText}>Add</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        <View style={styles.habitsList}>
          {habits.map((habit) => {
            const todayTracking = useQuery(api.habits.getTracking, { dates: [today] }) ?? [];
            const isCompleted = todayTracking.some(
              (t) => t.habitId === habit._id && t.date === today && t.completed
            );

            return (
              <TouchableOpacity
                key={habit._id}
                onPress={() => toggleHabit({ habitId: habit._id, date: today })}
                style={[
                  styles.habitCard,
                  isCompleted && styles.habitCardCompleted
                ]}
                accessibilityLabel={`Toggle ${habit.name} for today`}
                accessibilityRole="button"
              >
                <View style={styles.habitContent}>
                  <Text style={[
                    styles.habitName,
                    isCompleted && styles.habitNameCompleted
                  ]}>
                    {habit.name}
                  </Text>

                  <View style={[
                    styles.statusIndicator,
                    isCompleted && styles.statusIndicatorCompleted
                  ]}>
                    {isCompleted ? (
                      <Check size={16} color="#10B981" />
                    ) : (
                      <Circle size={16} color="#d1d5db" fill="none" strokeWidth={2} />
                    )}
                  </View>
                </View>

                {isCompleted && (
                  <View style={styles.completionIndicator} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {habits.length === 0 && !isAdding && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No habits yet</Text>
            <Text style={styles.emptyStateSubtext}>Add your first habit to get started</Text>
          </View>
        )}
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
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: '#0f172a',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addForm: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    marginBottom: 16,
  },
  formContent: {
    gap: 12,
  },
  formField: {
    gap: 8,
  },
  input: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },
  formActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  submitButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '500',
  },
  habitsList: {
    gap: 8,
  },
  habitCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    padding: 12,
    position: 'relative',
  },
  habitCardCompleted: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10B981',
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
    letterSpacing: -0.2,
    flex: 1,
  },
  habitNameCompleted: {
    color: '#065f46',
  },
  statusIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicatorCompleted: {
    // Additional styling for completed state if needed
  },
  completionIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#10B981',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});