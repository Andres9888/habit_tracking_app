// NativeWind global styles
import '../global.css';

import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import {
  ConvexProvider,
  ConvexReactClient,
  useMutation,
  useQuery,
} from 'convex/react';
import { addDays, format, startOfDay, subMonths, eachDayOfInterval } from 'date-fns';
import { Plus, Settings, BarChart3 } from 'lucide-react-native';
import type { ComponentType } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { api } from '../convex/_generated/api';
import type { Id } from '../convex/_generated/dataModel';
import { CalendarTimeline } from './components/CalendarTimeline';
import SettingsModal from './components/SettingsModal';
import StatsNotesModal from './components/StatsNotesModal';
import CreateHabitModal from './components/CreateHabitModal';
import DraggableHabit from './components/DraggableHabit';
import CharacterScreen from './screens/CharacterScreen';
import CharacterIcon from './components/CharacterIcon';
import HabitCalendarModal from './components/HabitCalendarModal';
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
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch {
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
  const [showHabitStrengthPercentage, setShowHabitStrengthPercentage] =
    useState(true);
  const [selectedHabit, setSelectedHabit] = useState<any | null>(null);
  const [isHabitCalendarOpen, setIsHabitCalendarOpen] = useState(false);

  const toggleHabit = useMutation(api.habits.toggleHabit);
  const archiveHabit = useMutation(api.habits.archive);
  const reorderHabits = useMutation(api.habits.reorderHabits);
  const updateSettings = useMutation(api.settings.update);
  const habits = useQuery(api.habits.list) ?? [];
  const settings = useQuery(api.settings.get);

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

  // Load 12 months of tracking data for calendar modal and heatmap
  const extendedDateRange = useMemo(() => {
    const endDate = today;
    const startDate = subMonths(endDate, 12);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [today]);

  const extendedDateStrings = useMemo(
    () => extendedDateRange.map((d) => format(d, 'yyyy-MM-dd')),
    [extendedDateRange]
  );

  const tracking =
    useQuery(api.habits.getTracking, { dates: extendedDateStrings }) ?? [];

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

  const handleDragEnd = useCallback(
    async ({ data }: { data: any[] }) => {
      try {
        const habitIds = data.map((h) => h._id) as Id<'habits'>[];
        console.log('Reordering habits:', habitIds);
        await reorderHabits({ habitIds });
        console.log('Reorder successful');
      } catch (error) {
        console.error('Failed to reorder habits:', error);
      }
    },
    [reorderHabits]
  );

  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => {
      await archiveHabit({ habitId });
    },
    [archiveHabit]
  );

  const handleHabitLongPress = useCallback((habit: any) => {
    setSelectedHabit(habit);
    setIsHabitCalendarOpen(true);
  }, []);

  const handleHabitPress = useCallback((habit: any) => {
    setSelectedHabit(habit);
    setIsHabitCalendarOpen(true);
  }, []);

  // Memoize content container style to prevent re-renders on iOS
  const contentContainerStyle = useMemo(
    () => ({
      paddingHorizontal: 24,
      paddingTop: 48,
      paddingBottom: 96,
    }),
    []
  );

  // Memoize render item for better iOS performance
  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<any>) => {
      const weekStatus = weekDateStrings.map((ds) =>
        getHabitStatus(item._id, ds)
      );
      const streak = getStreak(item._id);
      return (
        <ScaleDecorator>
          <View className='mb-4' style={{ opacity: isActive ? 0.7 : 1 }}>
            <DraggableHabit
              habit={item}
              showHabitStrengthPercentage={showHabitStrengthPercentage}
              streak={streak}
              toggleHabit={toggleHabit}
              weekDateStrings={weekDateStrings}
              weekStatus={weekStatus}
              onArchive={handleArchive}
              onLongPress={drag}
              onPress={handleHabitPress}
            />
          </View>
        </ScaleDecorator>
      );
    },
    [
      getStreak,
      handleArchive,
      handleHabitPress,
      showHabitStrengthPercentage,
      toggleHabit,
      weekDateStrings,
    ]
  );

  if (showCharacterScreen) {
    return <CharacterScreen onBack={() => setShowCharacterScreen(false)} />;
  }

  const renderHeader = useCallback(() => (
    <View className='gap-4'>
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
        showSeparator
        canNavigateForward={canNavigateForward}
        dates={weekDates}
        onNextWeek={handleNextWeek}
        onPreviousWeek={handlePreviousWeek}
      />
    </View>
  ), [
    canNavigateForward,
    handleNextWeek,
    handlePreviousWeek,
    handleToggleForm,
    settings?.showCharacterScreen,
    settings?.showNotesStats,
    weekDates,
  ]);

  return (
    <GestureHandlerRootView className='flex-1'>
      <View className='flex-1 items-center bg-[#F5F1ED]'>
        <View className='w-full max-w-[448px] flex-1'>
          <DraggableFlatList
            data={habits}
            keyExtractor={(item: any) => item._id}
            renderItem={renderItem}
            onDragEnd={handleDragEnd}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={contentContainerStyle}
            showsVerticalScrollIndicator={false}
            activationDistance={10}
          />
        </View>
        <WebToaster />
        <SettingsModal
          showCharacterScreen={settings?.showCharacterScreen ?? true}
          showHabitStrengthPercentage={showHabitStrengthPercentage}
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
                showMotivationalMessages: settings.showMotivationalMessages,
                showNotesStats: settings.showNotesStats,
                showStreaks: settings.showStreaks,
              });
            }
          }}
          onChangeShowHabitStrengthPercentage={setShowHabitStrengthPercentage}
          onChangeShowNotesStats={async (value) => {
            if (settings) {
              await updateSettings({
                catTheme: settings.catTheme,
                darkMode: settings.darkMode,
                showCalendarView: settings.showCalendarView,
                showCharacterScreen: settings.showCharacterScreen,
                showConsistency: settings.showConsistency,
                showEmojis: settings.showEmojis,
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
        <HabitCalendarModal
          habit={selectedHabit}
          streak={selectedHabit ? getStreak(selectedHabit._id) : 0}
          tracking={tracking}
          toggleHabit={toggleHabit}
          visible={isHabitCalendarOpen}
          onClose={() => setIsHabitCalendarOpen(false)}
        />
      </View>
      <View className='absolute bottom-8 right-6' pointerEvents='box-none'>
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
