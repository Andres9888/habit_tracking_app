// NativeWind global styles
import './global.css';

import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import {
  ConvexProvider,
  ConvexReactClient,
  useMutation,
  useQuery,
} from 'convex/react';
import { addDays, format } from 'date-fns';
import { Plus, Settings, Search, Bell, Wifi } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { api } from './convex/_generated/api';
import type { Id } from './convex/_generated/dataModel';
import { DateSelector } from './src/components/DateSelector';
import { CalendarTimeline } from './src/components/CalendarTimeline';
import SettingsModal from './src/components/SettingsModal';
import DraggableHabit from './src/components/DraggableHabit';
import CharacterScreen from './src/screens/CharacterScreen';
import CharacterIcon from './src/components/CharacterIcon';
import { getCompactMode, setCompactMode } from './src/lib/settingsStorage';
import * as SecureStore from 'expo-secure-store';
import { extendedTheme, useAppTheme } from './src/theme';
import { HapticTest } from './src/components/HapticTest';
import PremiumUpgradeScreen from './src/screens/PremiumUpgradeScreen';
import PremiumCTA from './src/components/PremiumCTA';
import { usePremium } from './src/hooks/usePremium';

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

function HabitsApp() {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showCharacterScreen, setShowCharacterScreen] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [showHapticTest, setShowHapticTest] = useState(false);
  const [showPremiumScreen, setShowPremiumScreen] = useState(false);
  const { isPremium } = usePremium();

  const createHabit = useMutation(api.habits.create);
  const toggleHabit = useMutation(api.habits.toggleHabit);
  const archiveHabit = useMutation(api.habits.archive);
  const habits = useQuery(api.habits.list) ?? [];

  const FREE_HABIT_LIMIT = 3;
  const hasReachedHabitLimit = !isPremium && habits.length >= FREE_HABIT_LIMIT;
  const settings = useQuery(api.settings.get);
  const [habitOrder, setHabitOrder] = useState<string[]>([]);

  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const highContrastMode = settings?.highContrastMode ?? false;
  const appTheme = useAppTheme();

  // Custom theme colors that extend the design system
  // Maps high contrast mode to design system colors
  const theme = useMemo(
    () =>
      highContrastMode
        ? {
            accent: '#facc15', // Yellow for high contrast
            accentText: appTheme.custom.colors.text.primary,
            background: appTheme.custom.colors.dark.background,
            border: '#facc15',
            icon: '#facc15',
            inputBackground: '#0f0f0f',
            inputPlaceholder: '#facc15',
            primaryText: appTheme.custom.colors.text.inverse,
            secondaryText: '#facc15',
            surface: appTheme.custom.colors.dark.surface,
            surfaceMuted: appTheme.custom.colors.dark.card,
          }
        : {
            // Default light mode using design system
            accent: appTheme.custom.colors.primary[500], // Brand green
            accentText: appTheme.custom.colors.text.inverse,
            background: appTheme.custom.colors.light.background,
            border: appTheme.custom.colors.border,
            icon: appTheme.custom.colors.text.primary,
            inputBackground: appTheme.custom.colors.light.card,
            inputPlaceholder: appTheme.custom.colors.text.tertiary,
            primaryText: appTheme.custom.colors.text.primary,
            secondaryText: appTheme.custom.colors.text.secondary,
            surface: appTheme.custom.colors.light.surface,
            surfaceMuted: appTheme.custom.colors.light.surface,
          },
    [highContrastMode, appTheme]
  );

  // Calculate dates based on week offset
  const displayWeekDates = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    const startOfWeek = addDays(today, -dayOfWeek); // Go back to Sunday
    const baseStart = addDays(startOfWeek, currentWeekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => addDays(baseStart, i));
  }, [currentWeekOffset]);

  const displayWeekDateStrings = useMemo(
    () => displayWeekDates.map((d) => format(d, 'yyyy-MM-dd')),
    [displayWeekDates]
  );

  const tracking =
    useQuery(api.habits.getTracking, { dates: displayWeekDateStrings }) ?? [];

  const handlePreviousWeek = useCallback(() => {
    setCurrentWeekOffset((prev) => prev - 1);
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentWeekOffset((prev) => prev + 1);
  }, []);

  // Load compact mode preference (native entry)
  useEffect(() => {
    (async () => {
      const saved = await getCompactMode();
      setIsCompactMode(saved);
    })();
  }, []);

  const handleCompactChange = async (next: boolean) => {
    setIsCompactMode(next);
    await setCompactMode(next);
  };

  const canSubmit = useMemo(
    () => newHabitName.trim().length > 0,
    [newHabitName]
  );

  const handleToggleForm = () => {
    setIsAdding((prev) => {
      if (prev) {
        setNewHabitName('');
      }
      return !prev;
    });
  };

  const handleSubmit = async () => {
    const name = newHabitName.trim();
    if (!name) {
      return;
    }

    await createHabit({ name, notes: '' });
    setNewHabitName('');
    setIsAdding(false);
  };

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
  useMemo(() => {
    if (habits.length > 0 && habitOrder.length === 0) {
      setHabitOrder(habits.map((h) => h._id));
    }
  }, [habits, habitOrder.length]);

  // Reorder habits based on current order state
  const orderedHabits = useMemo(() => {
    if (habitOrder.length === 0) return habits;

    const orderMap = new Map(habitOrder.map((id, index) => [id, index]));
    return [...habits].sort((a, b) => {
      const aOrder = orderMap.get(a._id) ?? Infinity;
      const bOrder = orderMap.get(b._id) ?? Infinity;
      return aOrder - bOrder;
    });
  }, [habits, habitOrder]);

  const handleReorder = useCallback(async (newOrder: string[]) => {
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

  if (showPremiumScreen) {
    return (
      <PremiumUpgradeScreen
        onClose={() => setShowPremiumScreen(false)}
        onUpgrade={() => {
          setShowPremiumScreen(false);
          // Show success message or navigate
        }}
      />
    );
  }

  if (showCharacterScreen) {
    return <CharacterScreen onBack={() => setShowCharacterScreen(false)} />;
  }

  // TEMPORARY: Haptic Test Screen for debugging
  if (showHapticTest) {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ padding: 16, backgroundColor: theme.accent }}>
          <Pressable onPress={() => setShowHapticTest(false)}>
            <Text
              style={{
                color: theme.accentText,
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              ← Back to App
            </Text>
          </Pressable>
        </View>
        <HapticTest />
      </View>
    );
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.background }}
        contentContainerStyle={{ backgroundColor: theme.background }}
      >
        <View className='mx-auto w-full max-w-[375px] px-4 pb-24 pt-4'>
          {/* Header Section */}
          <View className='mb-4 flex-row items-center justify-between'>
            {/* Time and Habits Button */}
            <View className='flex-row items-center gap-4'>
              <Text
                className='text-[20px] font-bold leading-[28px]'
                style={{ color: theme.primaryText }}
              >
                {format(new Date(), 'H:mm')}
              </Text>
              <View
                className='flex-row items-center gap-2 rounded-full px-4 py-2'
                style={{ backgroundColor: theme.accent }}
              >
                <Plus color={theme.accentText} size={12} strokeWidth={2} />
                <Text
                  className='text-[14px] font-semibold'
                  style={{ color: theme.accentText }}
                >
                  Habits
                </Text>
              </View>
            </View>

            {/* Right Icons */}
            <View className='flex-row items-center gap-4'>
              <Search color={theme.icon} size={14} strokeWidth={2} />
              <Bell color={theme.icon} size={20} strokeWidth={2} />
              <Wifi color={theme.icon} size={18} strokeWidth={2} />

              {/* TEMPORARY: Haptic Test Button (DEV ONLY) */}
              {__DEV__ && (
                <Pressable
                  accessibilityLabel='Open haptic test'
                  accessibilityRole='button'
                  className='h-8 w-8 items-center justify-center rounded-full'
                  onPress={() => setShowHapticTest(true)}
                  style={{ backgroundColor: '#ff6b6b' }}
                >
                  <Text
                    style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}
                  >
                    H
                  </Text>
                </Pressable>
              )}

              <Pressable
                accessibilityLabel='Open settings'
                accessibilityRole='button'
                className='h-8 w-8 items-center justify-center rounded-full'
                onPress={() => setIsSettingsOpen(true)}
              >
                <Settings color={theme.icon} size={20} />
              </Pressable>
            </View>
          </View>

          {/* Date Navigation */}
          <CalendarTimeline
            dates={displayWeekDates}
            onPreviousWeek={handlePreviousWeek}
            onNextWeek={handleNextWeek}
            highContrastMode={highContrastMode}
          />

          {isAdding && (
            <View
              className='mb-8 rounded-3xl border p-5'
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.border,
              }}
            >
              <View className='gap-4'>
                <View className='gap-2'>
                  <Text
                    className='text-[11px] font-semibold tracking-[3px]'
                    style={{ color: theme.secondaryText }}
                  >
                    NEW HABIT
                  </Text>
                  <TextInput
                    autoFocus
                    className='w-full rounded-3xl border px-5 py-3 text-sm font-medium'
                    placeholder='Name your habit'
                    placeholderTextColor={theme.inputPlaceholder}
                    value={newHabitName}
                    onChangeText={setNewHabitName}
                    style={{
                      backgroundColor: theme.inputBackground,
                      borderColor: theme.border,
                      color: theme.primaryText,
                    }}
                  />
                </View>
                {hasReachedHabitLimit && !isPremium && (
                  <View className='rounded-2xl border p-4' style={{ backgroundColor: '#FFD70015', borderColor: '#FFD70040' }}>
                    <Text
                      className='text-[13px] font-semibold mb-2'
                      style={{ color: theme.primaryText }}
                    >
                      You've reached the free limit of {FREE_HABIT_LIMIT} habits
                    </Text>
                    <PremiumCTA
                      compact
                      onUpgrade={() => setShowPremiumScreen(true)}
                      title='Upgrade to Premium for Unlimited Habits'
                      variant='default'
                    />
                  </View>
                )}
                <View className='flex-row items-center justify-end gap-3'>
                  <Pressable
                    accessibilityRole='button'
                    className='py-2'
                    onPress={handleToggleForm}
                  >
                    <Text
                      className='text-[11px] font-semibold tracking-[3px]'
                      style={{ color: theme.secondaryText }}
                    >
                      CANCEL
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole='button'
                    className={`rounded-3xl px-5 py-2 ${!canSubmit || hasReachedHabitLimit ? 'opacity-40' : ''}`}
                    disabled={!canSubmit || (hasReachedHabitLimit && !isPremium)}
                    onPress={handleSubmit}
                    style={{
                      backgroundColor: theme.accent,
                      borderColor: theme.accent,
                      borderWidth: 1,
                    }}
                  >
                    <Text
                      className='text-[11px] font-semibold tracking-[3px]'
                      style={{ color: theme.accentText }}
                    >
                      ADD
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          <View className='gap-4'>
            {orderedHabits.map((habit) => {
              const weekStatus = displayWeekDateStrings.map((ds) =>
                getHabitStatus(habit._id, ds)
              );

              // Calculate streak (consecutive days completed up to today)
              const calculateStreak = () => {
                const completedDates = new Set(
                  tracking
                    .filter((t) => t.habitId === habit._id && t.completed)
                    .map((t) => t.date)
                );

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                let streak = 0;
                const currentDate = new Date(today);

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
                <DraggableHabit
                  key={habit._id}
                  habit={habit}
                  isCompactMode={isCompactMode}
                  highContrastMode={highContrastMode}
                  streak={streak}
                  toggleHabit={toggleHabit}
                  weekDateStrings={displayWeekDateStrings}
                  weekStatus={weekStatus}
                  onArchive={handleArchive}
                />
              );
            })}
          </View>
        </View>
        <SettingsModal
          isHighContrastActive={highContrastMode}
          isCompact={isCompactMode}
          onChangeCompact={handleCompactChange}
          onClose={() => setIsSettingsOpen(false)}
          onOpenPremium={() => {
            setIsSettingsOpen(false);
            setShowPremiumScreen(true);
          }}
          visible={isSettingsOpen}
        />
      </ScrollView>
      {/* Centered Floating Action Button */}
      <View
        pointerEvents='box-none'
        className='absolute bottom-8 left-0 right-0 items-center'
      >
        <Pressable
          accessibilityHint={
            isAdding ? 'Close add habit form' : 'Open add habit form'
          }
          accessibilityLabel={isAdding ? 'Close' : 'Add habit'}
          accessibilityRole='button'
          className='h-16 w-16 items-center justify-center rounded-full'
          style={{
            backgroundColor: theme.accent,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          onPress={handleToggleForm}
        >
          <Plus color={theme.accentText} size={28} strokeWidth={2.5} />
        </Pressable>
      </View>
    </GestureHandlerRootView>
  );
}

export default function App() {
  // Temporarily bypass Clerk authentication for development
  if (!clerkPublishableKey) {
    // Note: Authentication is optional for development
    // Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to .env to enable
    if (__DEV__) {
      console.log('ℹ️ Running in development mode without authentication');
    }
    return (
      <PaperProvider theme={extendedTheme}>
        <ConvexProvider client={convex}>
          <HabitsApp />
        </ConvexProvider>
      </PaperProvider>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <PaperProvider theme={extendedTheme}>
          <ConvexProvider client={convex}>
            <HabitsApp />
          </ConvexProvider>
        </PaperProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
