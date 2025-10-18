// NativeWind global styles
import '../global.css';

import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import {
  ConvexProvider,
  ConvexReactClient,
  useMutation,
  useQuery,
} from 'convex/react';
import { addDays, format, startOfDay } from 'date-fns';
import { Plus, Settings, BarChart3 } from 'lucide-react-native';
import type { ComponentType } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import { api } from '../convex/_generated/api';
import type { Id } from '../convex/_generated/dataModel';
import { CalendarTimeline } from './components/CalendarTimeline';
import SettingsModal from './components/SettingsModal';
import StatsNotesModal from './components/StatsNotesModal';
import CreateHabitModal from './components/CreateHabitModal';
import DraggableHabit from './components/DraggableHabit';
import CharacterScreen from './screens/CharacterScreen';
import CharacterIcon from './components/CharacterIcon';
import * as SecureStore from 'expo-secure-store';

type HabitStatus = 'done' | 'missed' | 'planned';

// Initialize Convex client for Expo
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error('EXPO_PUBLIC_CONVEX_URL is required but was not provided');
}
const convex = new ConvexReactClient(convexUrl);

// Initialize Clerk (optional for development)
const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

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

const WebToaster: ComponentType =
  Platform.OS === 'web'
    ? (require('sonner').Toaster as ComponentType)
    : () => null;

function HabitsApp() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsNotesOpen, setIsStatsNotesOpen] = useState(false);
  const [isCreateHabitOpen, setIsCreateHabitOpen] = useState(false);
  const [showCharacterScreen, setShowCharacterScreen] = useState(false);

  const toggleHabit = useMutation(api.habits.toggleHabit);
  const archiveHabit = useMutation(api.habits.archive);
  const updateSettings = useMutation(api.settings.update);
  const habits = useQuery(api.habits.list) ?? [];
  const settings = useQuery(api.settings.get);
  const [habitOrder, setHabitOrder] = useState<string[]>([]);

  const today = useMemo(() => startOfDay(new Date()), []);
  const [weekAnchor, setWeekAnchor] = useState(today);

  const weekDates = useMemo(
    () => Array.from({ length: 5 }, (_, i) => addDays(weekAnchor, i - 4)),
    [weekAnchor]
  );
  const weekDateStrings = useMemo(
    () => weekDates.map((d) => format(d, 'yyyy-MM-dd')),
    [weekDates]
  );

  const tracking =
    useQuery(api.habits.getTracking, { dates: weekDateStrings }) ?? [];

  const completedDatesByHabit = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const t of tracking) {
      if (!t.completed) continue;
      if (!map.has(t.habitId)) {
        map.set(t.habitId, new Set<string>());
      }
      map.get(t.habitId)!.add(t.date);
    }
    return map;
  }, [tracking]);

  const getStreak = useCallback(
    (habitId: string) => {
      const completedDates = completedDatesByHabit.get(habitId);
      if (!completedDates) return 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const currentDate = new Date(today);

      let streak = 0;
      // Count consecutive days backward from today
      // eslint-disable-next-line no-constant-condition
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
    },
    [completedDatesByHabit]
  );

  const handleToggleForm = () => {
    setIsCreateHabitOpen(true);
  };

  const handlePreviousWeek = useCallback(() => {
    setWeekAnchor((prev) => addDays(prev, -5));
  }, []);

  const handleNextWeek = useCallback(() => {
    setWeekAnchor((prev) => addDays(prev, 5));
  }, []);

  const canNavigateForward = useMemo(
    () => weekAnchor.getTime() < today.getTime(),
    [weekAnchor, today]
  );

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

    if (trackingEntry?.completed) return 'done';
    if (date < today) return 'missed';
    return 'planned';
  };

  // Initialize habit order when habits load
  useEffect(() => {
    if (habits.length > 0 && habitOrder.length === 0) {
      setHabitOrder(habits.map((h) => h._id));
    }
  }, [habits, habitOrder.length]);

  // Reorder habits based on current order state
  const orderedHabits = useMemo(() => {
    if (habitOrder.length === 0) return habits;

    const orderMap = new Map(habitOrder.map((id, index) => [id, index]));
    return [...habits].sort((a: any, b: any) => {
      const aOrder = orderMap.get(a._id) ?? Infinity;
      const bOrder = orderMap.get(b._id) ?? Infinity;
      return aOrder - bOrder;
    });
  }, [habits, habitOrder]);

  const _handleReorder = useCallback(async (newOrder: string[]) => {
    setHabitOrder(newOrder);
    // TODO: Implement reorderHabits mutation in convex/habits.ts
    // await reorderHabits({ habitIds: newOrder as Id<"habits">[] });
  }, []);

  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => {
      await archiveHabit({ habitId });
    },
    [archiveHabit]
  );

  if (showCharacterScreen) {
    return <CharacterScreen onBack={() => setShowCharacterScreen(false)} />;
  }

  return (
    <GestureHandlerRootView className='flex-1'>
      <View className='flex-1 items-center bg-[#F5F1ED]'>
        <ScrollView
          className='w-full max-w-[448px]'
          showsVerticalScrollIndicator={false}
        >
          <View className='gap-4 px-6 pb-24 pt-12'>
            <View className='mt-3 flex-row items-center justify-between'>
              <Pressable
                accessibilityHint='Open create habit modal'
                accessibilityLabel='Add habit'
                accessibilityRole='button'
                className='h-12 flex-row items-center gap-2 rounded-full bg-[#101828] px-5'
                onPress={handleToggleForm}
              >
                <Plus color='#ffffff' size={18} strokeWidth={2.25} />
                <Text className='text-base font-normal tracking-tight text-white'>
                  Habits
                </Text>
              </Pressable>
              <View className='flex-row gap-3'>
                {settings?.showCharacterScreen && (
                  <Pressable
                    accessibilityLabel='View character'
                    accessibilityRole='button'
                    onPress={() => setShowCharacterScreen(true)}
                  >
                    <CharacterIcon size={36} />
                  </Pressable>
                )}
                {settings?.showNotesStats && (
                  <Pressable
                    accessibilityLabel='View statistics and notes'
                    accessibilityRole='button'
                    className='h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6]'
                    onPress={() => setIsStatsNotesOpen(true)}
                  >
                    <BarChart3 color='#101727' size={20} strokeWidth={2.25} />
                  </Pressable>
                )}
                <Pressable
                  accessibilityLabel='Open settings'
                  accessibilityRole='button'
                  className='h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6]'
                  onPress={() => setIsSettingsOpen(true)}
                >
                  <Settings color='#101727' size={20} strokeWidth={2.25} />
                </Pressable>
              </View>
            </View>

            {/* CalendarTimeline from Figma Design (node 201:87) - replaces DateSelector */}
            <CalendarTimeline
              canNavigateForward={canNavigateForward}
              dates={weekDates}
              onNextWeek={handleNextWeek}
              onPreviousWeek={handlePreviousWeek}
              showSeparator={true}
            />

            <View className='gap-4'>
              {orderedHabits.map((habit: any) => {
                const weekStatus = weekDateStrings.map((ds) =>
                  getHabitStatus(habit._id, ds)
                );
                const streak = getStreak(habit._id);
                return (
                  <DraggableHabit
                    key={habit._id}
                    habit={habit}
                    showHabitStrengthPercentage={
                      settings?.showHabitStrengthPercentage ?? true
                    }
                    streak={streak}
                    toggleHabit={toggleHabit}
                    weekDateStrings={weekDateStrings}
                    weekStatus={weekStatus}
                    onArchive={handleArchive}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>
        <WebToaster />
        <SettingsModal
          showCharacterScreen={settings?.showCharacterScreen ?? true}
          showHabitStrengthPercentage={
            settings?.showHabitStrengthPercentage ?? true
          }
          showNotesStats={settings?.showNotesStats ?? true}
          visible={isSettingsOpen}
          onChangeShowCharacterScreen={async (value) => {
            if (settings) {
              await updateSettings({
                catTheme: settings.catTheme,
                darkMode: settings.darkMode,
                showCalendarView: settings.showCalendarView,
                showCharacterScreen: value,
                showConsistency: settings.showConsistency,
                showEmojis: settings.showEmojis,
                showHabitStrengthPercentage: settings.showHabitStrengthPercentage,
                showMotivationalMessages: settings.showMotivationalMessages,
                showNotesStats: settings.showNotesStats,
                showStreaks: settings.showStreaks,
              });
            }
          }}
          onChangeShowHabitStrengthPercentage={async (value) => {
            if (settings) {
              await updateSettings({
                catTheme: settings.catTheme,
                darkMode: settings.darkMode,
                showCalendarView: settings.showCalendarView,
                showCharacterScreen: settings.showCharacterScreen,
                showConsistency: settings.showConsistency,
                showEmojis: settings.showEmojis,
                showHabitStrengthPercentage: value,
                showMotivationalMessages: settings.showMotivationalMessages,
                showNotesStats: settings.showNotesStats,
                showStreaks: settings.showStreaks,
              });
            }
          }}
          onChangeShowNotesStats={async (value) => {
            if (settings) {
              await updateSettings({
                catTheme: settings.catTheme,
                darkMode: settings.darkMode,
                showCalendarView: settings.showCalendarView,
                showCharacterScreen: settings.showCharacterScreen,
                showConsistency: settings.showConsistency,
                showEmojis: settings.showEmojis,
                showHabitStrengthPercentage: settings.showHabitStrengthPercentage,
                showMotivationalMessages: settings.showMotivationalMessages,
                showNotesStats: value,
                showStreaks: settings.showStreaks,
              });
            }
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
        <StatsNotesModal
          visible={isStatsNotesOpen}
          onClose={() => setIsStatsNotesOpen(false)}
        />
        <CreateHabitModal
          visible={isCreateHabitOpen}
          onClose={() => setIsCreateHabitOpen(false)}
        />
      </View>
      <View pointerEvents='box-none' className='absolute bottom-8 right-6'>
        <Pressable
          accessibilityHint='Open create habit modal'
          accessibilityLabel='Add habit'
          accessibilityRole='button'
          className='h-14 w-14 items-center justify-center rounded-full bg-[#101727] shadow-lg'
          onPress={handleToggleForm}
        >
          <Plus color='#ffffff' size={24} strokeWidth={2.25} />
        </Pressable>
      </View>
    </GestureHandlerRootView>
  );
}

export default function App() {
  // Temporarily bypass Clerk authentication for development
  if (!clerkPublishableKey) {
    console.warn('Running without authentication - Clerk key not configured');
    return (
      <ConvexProvider client={convex}>
        <HabitsApp />
      </ConvexProvider>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ConvexProvider client={convex}>
          <HabitsApp />
        </ConvexProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
