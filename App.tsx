import { ConvexProvider, ConvexReactClient, useMutation, useQuery } from "convex/react";
import { addDays, format } from 'date-fns';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Animated, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { api } from "./convex/_generated/api";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

type HabitStatus = "done" | "missed" | "planned";

function HabitsScreen() {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const createHabit = useMutation(api.habits.create);
  const toggleHabit = useMutation(api.habits.toggleHabit);
  const removeHabit = useMutation(api.habits.remove);
  const habits = useQuery(api.habits.list) ?? [];

  // Get 4-day window (3 days before + selected end date)
  const weekDates = Array.from({ length: 4 }, (_, i) => addDays(selectedEndDate, i - 3));
  const weekDateStrings = weekDates.map(d => format(d, 'yyyy-MM-dd'));

  // Calculate today for preventing future selections
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  const goToPreviousPeriod = () => {
    setSelectedEndDate(prev => addDays(prev, -4));
  };

  const goToNextPeriod = () => {
    const nextDate = addDays(selectedEndDate, 4);
    const nextDateNormalized = new Date(nextDate);
    nextDateNormalized.setHours(0, 0, 0, 0);

    // Don't go beyond today
    if (nextDateNormalized <= today) {
      setSelectedEndDate(nextDate);
    } else {
      setSelectedEndDate(new Date());
    }
  };

  const goToToday = () => {
    setSelectedEndDate(new Date());
  };

  const handleDateSelect = (date: string) => {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    // Don't allow future dates
    if (selectedDate <= today) {
      setSelectedEndDate(selectedDate);
    }
    setShowCalendar(false);
  };

  const handleDeleteHabit = async (habitId: string) => {
    const habit = habits.find(h => h._id === habitId);
    const habitName = habit?.name || 'this habit';

    // Confirm before deleting
    if (!confirm(`Are you sure you want to delete "${habitName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await removeHabit({ habitId });
      // Success feedback could be added here (toast notification)
    } catch (error) {
      console.error('Failed to delete habit:', error);
      alert(`Failed to delete "${habitName}". Please try again.`);
    }
  };

  const renderRightActions = (habitId: string, habitName: string) => (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        onPress={() => handleDeleteHabit(habitId)}
        style={styles.deleteAction}
        accessibilityLabel={`Delete ${habitName}`}
        accessibilityRole="button"
      >
        <Animated.View style={[styles.deleteActionContent, { transform: [{ scale }] }]}>
          <Text style={styles.deleteActionText}>Delete</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const isAtToday = format(selectedEndDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Habits</Text>
          <TouchableOpacity
            onPress={handleToggleForm}
            style={styles.addButton}
            accessibilityLabel="Add habit"
            accessibilityRole="button"
          >
            <Text style={styles.plusIcon}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Date Navigation */}
        <View style={styles.dateNavigation}>
          <TouchableOpacity
            onPress={goToPreviousPeriod}
            style={styles.navButton}
            accessibilityLabel="Previous period"
            accessibilityRole="button"
          >
            <Text style={styles.navButtonText}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToToday}
            style={[styles.todayButton, isAtToday && styles.todayButtonDisabled]}
            disabled={isAtToday}
            accessibilityLabel="Go to today"
            accessibilityRole="button"
          >
            <Text style={[styles.todayButtonText, isAtToday && styles.todayButtonTextDisabled]}>
              {format(weekDates[0], 'MMM d')} - {format(weekDates[3], 'MMM d')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowCalendar(true)}
            style={styles.calendarButton}
            accessibilityLabel="Open calendar"
            accessibilityRole="button"
          >
            <Text style={styles.calendarButtonText}>📅</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToNextPeriod}
            style={[styles.navButton, isAtToday && styles.navButtonDisabled]}
            disabled={isAtToday}
            accessibilityLabel="Next period"
            accessibilityRole="button"
          >
            <Text style={[styles.navButtonText, isAtToday && styles.navButtonTextDisabled]}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Modal */}
        <Modal
          visible={showCalendar}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCalendar(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowCalendar(false)}
          >
            <View style={styles.calendarModal}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarTitle}>Select Date</Text>
                <TouchableOpacity
                  onPress={() => setShowCalendar(false)}
                  style={styles.closeButton}
                  accessibilityLabel="Close calendar"
                  accessibilityRole="button"
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Calendar
                current={format(selectedEndDate, 'yyyy-MM-dd')}
                onDayPress={(day) => handleDateSelect(day.dateString)}
                maxDate={format(today, 'yyyy-MM-dd')}
                markedDates={{
                  [format(selectedEndDate, 'yyyy-MM-dd')]: {
                    selected: true,
                    selectedColor: '#0f172a',
                  },
                }}
                theme={{
                  todayTextColor: '#3b82f6',
                  selectedDayBackgroundColor: '#0f172a',
                  selectedDayTextColor: '#ffffff',
                  arrowColor: '#0f172a',
                  monthTextColor: '#0f172a',
                  textMonthFontWeight: '600',
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                }}
              />
            </View>
          </TouchableOpacity>
        </Modal>

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
                <TouchableOpacity
                  onPress={handleToggleForm}
                  style={styles.cancelButton}
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelButtonText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={!canSubmit}
                  style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
                  accessibilityRole="button"
                >
                  <Text style={styles.submitButtonText}>ADD</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <View style={styles.habitsList}>
          {habits.map((habit) => {
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
              <Swipeable
                key={habit._id}
                renderRightActions={renderRightActions(habit._id, habit.name)}
                overshootRight={false}
              >
                <View style={styles.habitCard}>
                  <View style={styles.habitHeader}>
                    <Text style={styles.habitName}>{habit.name}</Text>
                  </View>
                <View style={styles.calendarGrid}>
                  {weekDates.map((date, index) => {
                    const state = weekStatus[index];
                    const dateString = weekDateStrings[index];
                    const dayLabel = format(date, 'EEE').substring(0, 3);

                    return (
                      <View
                        key={`${habit._id}-${dateString}`}
                        style={styles.dayColumn}
                      >
                        <Text style={styles.dayLabel}>{dayLabel.toUpperCase()}</Text>
                        <TouchableOpacity
                          onPress={() => toggleHabit({ habitId: habit._id, date: dateString })}
                          style={[
                            styles.dayButton,
                            state === "done" && styles.dayButtonDone,
                            state === "missed" && styles.dayButtonMissed,
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
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
                <View style={styles.habitStats}>
                  <Text style={styles.statText}>STREAK · {streak} DAYS</Text>
                </View>
              </View>
            </Swipeable>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

function MainApp() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="auto" />
        <HabitsScreen />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ConvexProvider client={convex}>
        <MainApp />
      </ConvexProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 96,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 20,
    color: '#0f172a',
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: '#94a3b8',
  },
  todayButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  todayButtonDisabled: {
    borderColor: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  todayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  todayButtonTextDisabled: {
    color: '#0f172a',
    fontWeight: '700',
  },
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarButtonText: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#0f172a',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    fontSize: 24,
    fontWeight: '300',
    color: '#000',
  },
  addForm: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    marginBottom: 24,
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
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
  },
  habitHeader: {
    marginBottom: 16,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  deleteAction: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 100,
    borderRadius: 20,
    marginBottom: 16,
  },
  deleteActionContent: {
    paddingHorizontal: 20,
  },
  deleteActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  dayColumn: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  dayLabel: {
    fontSize: 10,
    letterSpacing: 2.5,
    color: '#64748b',
    fontWeight: '600',
  },
  dayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  dayButtonText: {
    fontSize: 18,
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

  habitStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statText: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#64748b',
    fontWeight: '600',
  },
});
