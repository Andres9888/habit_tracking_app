import { ClerkLoaded, ClerkProvider, SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { ConvexProvider, ConvexReactClient, useMutation, useQuery } from "convex/react";
import { addDays, format } from 'date-fns';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Calendar } from 'react-native-calendars';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SettingsModal from './src/components/SettingsModal';
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import { api } from "./convex/_generated/api";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}

// Token cache for Clerk
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

type HabitStatus = "done" | "missed" | "planned";

function HabitsScreen() {
  const { user } = useUser();
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [undoData, setUndoData] = useState<{habit: any, tracking: any[]} | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const formSlideAnim = useRef(new Animated.Value(0)).current;
  const formOpacityAnim = useRef(new Animated.Value(0)).current;

  const createHabit = useMutation(api.habits.create);
  const toggleHabit = useMutation(api.habits.toggleHabit);
  const removeHabit = useMutation(api.habits.remove);
  const restoreHabit = useMutation(api.habits.restore);
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

  useEffect(() => {
    console.log('Animation triggered, isAdding:', isAdding);
    const targetValue = isAdding ? 1 : 0;

    Animated.spring(rotateAnim, {
      toValue: targetValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      console.log('Rotation animation completed, target was:', targetValue);
    });

    Animated.timing(formSlideAnim, {
      toValue: targetValue,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(formOpacityAnim, {
      toValue: targetValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isAdding]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
    };
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const formSlide = formSlideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

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

  const showDeleteConfirmation = (habitId: any, habitName: string) => {
    // Apple uses medium impact for reveal, heavy for confirmation
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      `Delete "${habitName}"?`,
      'This will permanently remove the habit and all its tracking data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteHabit(habitId, habitName),
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteHabit = async (habitId: any, habitName: string) => {
    // Heavy haptic feedback on delete confirmation (Apple pattern)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      const deletedData = await removeHabit({ habitId });

      // Store the deleted data for undo
      setUndoData(deletedData);
      setShowUndo(true);

      // Clear any existing timeout
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }

      // Apple uses 5 seconds for undo timeout
      undoTimeoutRef.current = setTimeout(() => {
        setShowUndo(false);
        setUndoData(null);
      }, 5000);

    } catch (error) {
      console.error('Failed to delete habit:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', `Failed to delete "${habitName}". Please try again.`);
    }
  };

  const handleUndo = async () => {
    if (!undoData) return;

    // Light haptic feedback for undo
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await restoreHabit({
        habitData: undoData.habit,
        trackingData: undoData.tracking
      });

      // Clear undo state
      setShowUndo(false);
      setUndoData(null);
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }

    } catch (error) {
      console.error('Failed to restore habit:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to restore habit. Please try again.');
    }
  };

  const dismissUndo = () => {
    setShowUndo(false);
    setUndoData(null);
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }
  };

  const renderRightActions = (habitId: any, habitName: string) => (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    // Apple Mail style: red area expands as you drag
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    // Icon scales in quickly when appearing
    const scale = progress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1.1, 1],
      extrapolate: 'clamp',
    });

    const opacity = progress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 1],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.deleteAction}>
        <Animated.View
          style={[
            styles.deleteButton,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => showDeleteConfirmation(habitId, habitName)}
            activeOpacity={0.6}
            style={styles.deleteButtonTouchable}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${habitName}`}
            accessibilityHint="Deletes this habit and all tracking data"
          >
            <Animated.View
              style={{
                opacity,
                transform: [{ scale }],
              }}
            >
              <Text style={styles.deleteActionIcon}>🗑️</Text>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const isAtToday = format(selectedEndDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Habits</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={handleToggleForm}
              style={styles.addButton}
              accessibilityLabel={isAdding ? "Cancel" : "Add habit"}
              accessibilityRole="button"
            >
              <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <Text style={styles.plusIcon}>
                  +
                </Text>
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowSettings(true)}
              style={styles.settingsButton}
              accessibilityLabel="Settings"
              accessibilityRole="button"
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />

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
          <Animated.View
            style={[
              styles.addForm,
              {
                opacity: formOpacityAnim,
                transform: [{ translateY: formSlide }],
              },
            ]}
          >
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
          </Animated.View>
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
                rightThreshold={40}
                friction={2}
                containerStyle={styles.swipeableContainer}
              >
                <View
                  style={styles.habitCard}
                  accessible={true}
                  accessibilityLabel={`${habit.name} habit tracking`}
                  accessibilityHint="Swipe left to delete this habit"
                >
                  <View style={styles.habitHeader}>
                    <Text style={styles.habitName}>{habit.name}</Text>
                  </View>
                <View style={styles.calendarGrid}>
                  {weekDates.map((date, index) => {
                    const state = weekStatus[index];
                    const dateString = weekDateStrings[index];
                    const dayLabel = format(date, 'EEE').substring(0, 3);

                    // Check if this date is in the future
                    const dateObj = new Date(dateString);
                    dateObj.setHours(0, 0, 0, 0);
                    const isFuture = dateObj > today;

                    return (
                      <View
                        key={`${habit._id}-${dateString}`}
                        style={styles.dayColumn}
                      >
                        <Text style={styles.dayLabel}>{dayLabel.toUpperCase()}</Text>
                        <TouchableOpacity
                          onPress={() => !isFuture && toggleHabit({ habitId: habit._id, date: dateString })}
                          disabled={isFuture}
                          style={[
                            styles.dayButton,
                            state === "done" && styles.dayButtonDone,
                            state === "missed" && styles.dayButtonMissed,
                            isFuture && styles.dayButtonDisabled,
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

      {/* Undo notification */}
      {showUndo && undoData && (
        <View
          style={styles.undoContainer}
          accessible={true}
          accessibilityLiveRegion="polite"
        >
          <View style={styles.undoNotification}>
            <Text
              style={styles.undoText}
              accessibilityRole="text"
            >
              Deleted "{undoData.habit.name}"
            </Text>
            <View style={styles.undoActions}>
              <TouchableOpacity
                onPress={handleUndo}
                style={styles.undoButton}
                accessibilityRole="button"
                accessibilityLabel={`Undo deletion of ${undoData.habit.name} habit`}
                accessibilityHint="Restores the deleted habit and all its tracking data"
              >
                <Text style={styles.undoButtonText}>UNDO</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={dismissUndo}
                style={styles.dismissButton}
                accessibilityRole="button"
                accessibilityLabel="Dismiss undo notification"
                accessibilityHint="Permanently removes the deleted habit"
              >
                <Text style={styles.dismissButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function MainApp() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="auto" />
        <ClerkLoaded>
          <SignedIn>
            <HabitsScreen />
          </SignedIn>
          <SignedOut>
            <WelcomeScreen />
          </SignedOut>
        </ClerkLoaded>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SafeAreaProvider>
        <ConvexProvider client={convex}>
          <MainApp />
        </ConvexProvider>
      </SafeAreaProvider>
    </ClerkProvider>
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
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
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
    lineHeight: 24,
    textAlign: 'center',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 18,
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
  swipeableContainer: {
    overflow: 'visible',
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
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: '100%',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  deleteButtonTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteActionIcon: {
    fontSize: 28,
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
  dayButtonDisabled: {
    opacity: 0.3,
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
  undoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 48,
    paddingTop: 16,
    backgroundColor: 'transparent',
    pointerEvents: 'box-none',
  },
  undoNotification: {
    backgroundColor: 'rgba(28, 28, 30, 0.95)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10,
    elevation: 16,
  },
  undoText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '400',
    flex: 1,
  },
  undoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  undoButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  undoButtonText: {
    color: '#0A84FF',
    fontSize: 15,
    fontWeight: '600',
  },
  dismissButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  dismissButtonText: {
    color: '#8E8E93',
    fontSize: 18,
    fontWeight: '600',
  },
});
