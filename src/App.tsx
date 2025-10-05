import { useMutation, useQuery } from "convex/react";
import { addDays, format } from "date-fns";
import { Plus, Pencil, Check, X, GripVertical } from "lucide-react";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, TouchableOpacity, Alert, Animated } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import HabitViewSelector, { HabitViewType } from "./components/HabitViewSelector";
import HabitListView from "./screens/HabitListView";
import HabitDetailedView from "./screens/HabitDetailedView";
import HabitCompactView from "./screens/HabitCompactView";

type HabitStatus = "done" | "missed" | "planned";

function App() {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [currentView, setCurrentView] = useState<HabitViewType>(settings?.defaultView as HabitViewType || 'list');

  const createHabit = useMutation(api.habits.create);

  // Update current view when settings change
  useMemo(() => {
    if (settings?.defaultView && settings.defaultView !== currentView) {
      setCurrentView(settings.defaultView as HabitViewType);
    }
  }, [settings?.defaultView]);
  const toggleHabit = useMutation(api.habits.toggleHabit);
  const updateSettings = useMutation(api.settings.update);
  const habits = useQuery(api.habits.list) ?? [];
  const settings = useQuery(api.settings.get);

  const handleViewChange = async (newView: HabitViewType) => {
    setCurrentView(newView);
    // Update settings to persist the view preference
    await updateSettings({
      defaultView: newView,
      catTheme: settings?.catTheme ?? true,
      darkMode: settings?.darkMode ?? false,
      showCalendarView: settings?.showCalendarView ?? true,
      showConsistency: settings?.showConsistency ?? true,
      showEmojis: settings?.showEmojis ?? true,
      showMotivationalMessages: settings?.showMotivationalMessages ?? true,
      showStreaks: settings?.showStreaks ?? true,
    });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'detailed':
        return <HabitDetailedView />;
      case 'compact':
        return <HabitCompactView />;
      default:
        return <HabitListView />;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Habit Kit</Text>
            <Pressable
              onPress={handleToggleForm}
              style={styles.addButton}
              accessibilityLabel="Add habit"
              accessibilityRole="button"
            >
              <Plus size={20} strokeWidth={2.4} color="#000" />
            </Pressable>
          </View>

          <HabitViewSelector
            currentView={currentView}
            onViewChange={handleViewChange}
          />

          {renderCurrentView()}
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
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
});

export default App;