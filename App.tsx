import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ConvexProvider, ConvexReactClient, useMutation, useQuery } from "convex/react";
import { addDays, format, startOfWeek } from 'date-fns';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { api } from "./convex/_generated/api";
import { Id } from "./convex/_generated/dataModel";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

function getCatMotivation() {
  const motivations = [
    "Purr-fect progress! 🐱",
    "You're feline great! 😺",
    "Meow-velous work! 😸",
    "Keep pawing forward! 🐾",
  ];
  return motivations[Math.floor(Math.random() * motivations.length)];
}

function HabitStats({ habitId, settings }: { habitId: Id<"habits">, settings: any }) {
  const stats = useQuery(api.habits.getStats, { habitId }) ?? { streak: 0, consistency: 0 };

  if (!settings.showStreaks && !settings.showConsistency) return null;

  return (
    <View style={styles.statsContainer}>
      {settings.showStreaks && (
        <Text style={styles.statText}>
          {settings.showEmojis && "🔥"} {stats.streak} day streak
        </Text>
      )}
      {settings.showConsistency && (
        <Text style={styles.statText}>
          {settings.showEmojis && "📊"} {stats.consistency}% consistency
        </Text>
      )}
    </View>
  );
}


function HabitsScreen() {
  const [newHabit, setNewHabit] = useState("");
  const [newHabitNotes, setNewHabitNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const createHabit = useMutation(api.habits.create);
  const toggleHabit = useMutation(api.habits.toggleHabit);
  const habits = useQuery(api.habits.list) ?? [];

  // Week model
  const weekStart = startOfWeek(selectedDate);
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekDateStrings = weekDates.map((d) => format(d, 'yyyy-MM-dd'));
  const monthLabel = format(selectedDate, 'MMMM');

  const tracking = useQuery(api.habits.getTracking, { dates: weekDateStrings }) ?? [];
  const settings = useQuery(api.settings.get) ?? {
    showStreaks: true,
    showConsistency: true,
    showMotivationalMessages: true,
    showEmojis: true,
    showCalendarView: true,
    catTheme: true,
  };

  const handleCreateHabit = async () => {
    if (!newHabit.trim()) return;
    await createHabit({ name: newHabit.trim(), notes: newHabitNotes.trim() || undefined });
    setNewHabit("");
    setNewHabitNotes("");
  };

  const DayCircle = ({ filled }: { filled: boolean }) => (
    <View style={[styles.circle, filled ? styles.circleFilled : styles.circleEmpty]} />
  );

  const HabitCard = ({ habitName, notes, habitId }: { habitName: string; notes?: string; habitId: Id<'habits'> }) => {
    const completedCount = weekDates.reduce((acc, d) => {
      const dateStr = format(d, 'yyyy-MM-dd');
      return acc + (tracking.some((t) => t.habitId === habitId && t.date === dateStr && t.completed) ? 1 : 0);
    }, 0);

    return (
      <View style={styles.habitCard}>
        <View style={styles.habitCardTopRow}>
          <Text accessibilityLabel="energy count" style={styles.energyText}>⚡ {completedCount}</Text>
          <View style={styles.circlesRow}>
            {weekDates.map((d) => {
              const dateStr = format(d, 'yyyy-MM-dd');
              const isCompleted = tracking.some((t) => t.habitId === habitId && t.date === dateStr && t.completed);
              return <DayCircle key={dateStr} filled={isCompleted} />;
            })}
          </View>
        </View>
        <View style={styles.habitCardBody}>
          <View>
            <Text style={styles.habitTitle}>{habitName}</Text>
            {!!notes && <Text style={styles.habitSubtitle}>{notes}</Text>}
          </View>
          <MaterialCommunityIcons accessibilityLabel="muted" name="bell-off-outline" size={22} color="#111827" />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.largeTitle}>Habits</Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Add habit"
          onPress={handleCreateHabit}
          style={styles.addButton}
        >
          <Ionicons name="add" size={28} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Month + week row */}
      <View style={styles.monthWeekContainer}>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <View style={styles.weekRowCompact}>
          {weekDates.map((d) => {
            const isSelected = format(d, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            return (
              <TouchableOpacity key={d.toString()} onPress={() => setSelectedDate(d)} style={styles.weekCell}>
                <Text style={[styles.weekCellDate, isSelected && styles.weekCellDateSelected]}>{format(d, 'd')}</Text>
                <Text style={[styles.weekCellDow, isSelected && styles.weekCellDowSelected]}>{format(d, 'EE')}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Habit cards */}
      {habits.map((habit) => (
        <HabitCard key={habit._id} habitId={habit._id} habitName={habit.name} notes={habit.notes ?? undefined} />
      ))}

      {/* Instruction section */}
      <View style={styles.instructionContainer}>
        <Ionicons accessibilityElementsHidden name="arrow-up" size={24} color="#111827" />
        <View style={styles.dashedDivider} />
        <Text style={styles.instructionText}>
          Tap a circle to check off the habit for that day. Tap on the habit name to see details or change something.
        </Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="OK" style={styles.okPill}>
          <Text style={styles.okPillText}>OK</Text>
        </TouchableOpacity>
      </View>

      {/* Quick add area */}
      <View style={styles.addHabitContainer}>
        <TextInput
          style={styles.input}
          value={newHabit}
          onChangeText={setNewHabit}
          placeholder="Enter a new habit..."
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          value={newHabitNotes}
          onChangeText={setNewHabitNotes}
          placeholder="Add notes (optional)..."
          multiline
          numberOfLines={2}
        />
        <TouchableOpacity
          style={[styles.button, !newHabit.trim() && styles.buttonDisabled]}
          onPress={handleCreateHabit}
          disabled={!newHabit.trim()}
        >
          <Text style={styles.buttonText}>Add Habit</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

function MainApp() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <View style={{ flex: 1 }}>
        <HabitsScreen />
        <View style={styles.bottomBar}>
          <View style={styles.tabItemActive}>
            <MaterialCommunityIcons name="vector-circle" size={22} color="#111827" />
            <Text style={styles.tabTextActive}>Habits</Text>
          </View>
          <View style={styles.tabItem}>
            <MaterialCommunityIcons name="brightness-5" size={22} color="#9CA3AF" />
            <Text style={styles.tabText}>Focus</Text>
          </View>
          <View style={styles.tabItem}>
            <MaterialCommunityIcons name="menu" size={22} color="#9CA3AF" />
            <Text style={styles.tabText}>Journal</Text>
          </View>
          <View style={styles.tabItem}>
            <MaterialCommunityIcons name="cog" size={22} color="#9CA3AF" />
            <Text style={styles.tabText}>Other</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
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
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addButton: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#475569',
    textAlign: 'center',
    marginBottom: 8,
  },
  largeTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
  },
  monthWeekContainer: {
    marginBottom: 16,
  },
  monthLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  weekRowCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekCell: {
    alignItems: 'center',
    width: 40,
  },
  weekCellDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  weekCellDateSelected: {
    color: '#111827',
  },
  weekCellDow: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  weekCellDowSelected: {
    color: '#111827',
  },
  addHabitContainer: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'white',
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 16,
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 24,
    marginBottom: 20,
  },
  habitCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  energyText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
  },
  circlesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  circleEmpty: {
    borderColor: '#111827',
    backgroundColor: 'transparent',
  },
  circleFilled: {
    borderColor: '#111827',
    backgroundColor: '#111827',
  },
  habitCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  habitSubtitle: {
    fontSize: 18,
    color: '#111827',
    opacity: 0.9,
  },
  dayHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    minWidth: 32,
  },
  instructionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  dashedDivider: {
    width: 24,
    height: 1,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#111827',
  },
  instructionText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#111827',
    paddingHorizontal: 24,
  },
  okPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0f172a',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 9999,
    marginTop: 4,
  },
  okPillText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  habitRow: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  habitInfo: {
    marginBottom: 12,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  habitNotes: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
  },
  weekButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonCompleted: {
    backgroundColor: '#10b981',
  },
  dayButtonIncomplete: {
    backgroundColor: '#f3f4f6',
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dayButtonTextCompleted: {
    color: 'white',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    alignItems: 'center',
    opacity: 0.6,
  },
  tabItemActive: {
    alignItems: 'center',
  },
  tabText: {
    marginTop: 2,
    fontSize: 12,
    color: '#9CA3AF',
  },
  tabTextActive: {
    marginTop: 2,
    fontSize: 12,
    color: '#111827',
    fontWeight: '700',
  },
});
