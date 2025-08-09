import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { useState, useEffect } from 'react';
import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "./convex/_generated/api";
import { format, startOfWeek, addDays } from 'date-fns';
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

function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const signIn = useMutation(api.auth.signIn);
  const signUp = useMutation(api.auth.signUp);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp({ username: username.trim(), password });
      } else {
        await signIn({ username: username.trim(), password });
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.authTitle}>
        {isSignUp ? "Create Account" : "Sign In"}
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.linkText}>
          {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function SignOutButton() {
  const signOut = useMutation(api.auth.signOut);

  return (
    <TouchableOpacity
      style={styles.signOutButton}
      onPress={() => signOut()}
    >
      <Text style={styles.signOutText}>Sign Out</Text>
    </TouchableOpacity>
  );
}

function HabitsScreen() {
  const [newHabit, setNewHabit] = useState("");
  const [newHabitNotes, setNewHabitNotes] = useState("");
  const [selectedDate] = useState<Date>(new Date());
  
  const createHabit = useMutation(api.habits.create);
  const toggleHabit = useMutation(api.habits.toggleHabit);
  const habits = useQuery(api.habits.list) ?? [];
  
  // Get the start of the week
  const weekStart = startOfWeek(selectedDate);
  // Generate an array of dates for the week
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekDateStrings = weekDates.map(date => format(date, 'yyyy-MM-dd'));
  
  const tracking = useQuery(api.habits.getTracking, {
    dates: weekDateStrings
  }) ?? [];
  
  const settings = useQuery(api.settings.get) ?? {
    showStreaks: true,
    showConsistency: true,
    showMotivationalMessages: true,
    showEmojis: true,
    showCalendarView: true,
    catTheme: true,
  };

  const handleCreateHabit = async () => {
    if (newHabit.trim()) {
      await createHabit({ 
        name: newHabit.trim(),
        notes: newHabitNotes.trim() || undefined
      });
      setNewHabit("");
      setNewHabitNotes("");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {settings.catTheme && "🐱 "}Daily Habits{settings.catTheme && " 🐱"}
        </Text>
        {settings.showMotivationalMessages && (
          <Text style={styles.subtitle}>
            {getCatMotivation()}
          </Text>
        )}
      </View>

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

      <View style={styles.weekHeader}>
        {weekDates.map((date) => (
          <Text key={date.toString()} style={styles.dayHeader}>
            {format(date, 'EEE\nd')}
          </Text>
        ))}
      </View>

      {habits.map((habit) => (
        <View key={habit._id} style={styles.habitRow}>
          <View style={styles.habitInfo}>
            <Text style={styles.habitName}>{habit.name}</Text>
            <HabitStats habitId={habit._id} settings={settings} />
            {habit.notes && (
              <Text style={styles.habitNotes}>{habit.notes}</Text>
            )}
          </View>
          
          <View style={styles.weekButtons}>
            {weekDates.map((date) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const isCompleted = tracking.some(
                (t) => t.habitId === habit._id && t.date === dateStr && t.completed
              );
              return (
                <TouchableOpacity
                  key={dateStr}
                  onPress={() =>
                    toggleHabit({
                      habitId: habit._id,
                      date: dateStr,
                    })
                  }
                  style={[
                    styles.dayButton,
                    isCompleted ? styles.dayButtonCompleted : styles.dayButtonIncomplete
                  ]}
                >
                  <Text style={[
                    styles.dayButtonText,
                    isCompleted && styles.dayButtonTextCompleted
                  ]}>
                    {isCompleted && settings.showEmojis ? "✅" : ""}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      <SignOutButton />
    </ScrollView>
  );
}

function MainApp() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>
      <Authenticated>
        <HabitsScreen />
      </Authenticated>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ConvexAuthProvider client={convex}>
        <ConvexProvider client={convex}>
          <MainApp />
        </ConvexProvider>
      </ConvexAuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#475569',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#1e293b',
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
  linkText: {
    color: '#3b82f6',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  signOutText: {
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
  dayHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    minWidth: 32,
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
});
