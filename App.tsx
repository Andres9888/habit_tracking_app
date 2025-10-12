// NativeWind global styles
import './global.css';

import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { ConvexProvider, ConvexReactClient, useMutation, useQuery } from 'convex/react';
import { addDays, format } from 'date-fns';
import { Plus, Settings } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { api } from './convex/_generated/api';
import type { Id } from './convex/_generated/dataModel';
import { DateSelector } from './src/components/DateSelector';
import SettingsModal from './src/components/SettingsModal';
import DraggableHabit from './src/components/DraggableHabit';
import * as SecureStore from 'expo-secure-store';

type HabitStatus = 'done' | 'missed' | 'planned';

// Initialize Convex client for Expo
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error('EXPO_PUBLIC_CONVEX_URL is required but was not provided');
}
const convex = new ConvexReactClient(convexUrl);

// Initialize Clerk
const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!clerkPublishableKey) {
  throw new Error('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is required but was not provided');
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

function HabitsApp() {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const createHabit = useMutation(api.habits.create);
  const toggleHabit = useMutation(api.habits.toggleHabit);
  const habits = useQuery(api.habits.list) ?? [];
  const [habitOrder, setHabitOrder] = useState<string[]>([]);

  // Get 5-day window ending with today
  const today = new Date();
  const weekDates = Array.from({ length: 5 }, (_, i) => addDays(today, i - 4));
  const weekDateStrings = weekDates.map((d) => format(d, 'yyyy-MM-dd'));

  const tracking = useQuery(api.habits.getTracking, { dates: weekDateStrings }) ?? [];

  const canSubmit = useMemo(() => newHabitName.trim().length > 0, [newHabitName]);

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
    const trackingEntry = tracking.find((t) => t.habitId === habitId && t.date === dateString);

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

  return (
    <GestureHandlerRootView className='flex-1'>
      <ScrollView className='flex-1 bg-white'>
        <View className='mx-auto max-w-[448px] gap-8 px-6 pb-24 pt-12'>
          <View className='mb-8 flex-row items-center justify-between'>
            <Text className='text-4xl font-extrabold tracking-tight text-slate-900'>Habits</Text>
            <Pressable
              accessibilityLabel='Settings'
              accessibilityRole='button'
              className='h-10 w-10 items-center justify-center rounded-[10px]'
              onPress={() => setIsSettingsOpen(true)}
            >
              <Settings color='#101727' size={24} />
            </Pressable>
          </View>

          <DateSelector dates={weekDates} />

          {isAdding && (
            <View className='mb-8 rounded-3xl border border-slate-200 bg-white/90 p-5'>
              <View className='gap-4'>
                <View className='gap-2'>
                  <Text className='text-[11px] font-semibold tracking-[3px] text-slate-500'>NEW HABIT</Text>
                  <TextInput
                    autoFocus
                    className='w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900'
                    placeholder='Name your habit'
                    placeholderTextColor='#999'
                    value={newHabitName}
                    onChangeText={setNewHabitName}
                  />
                </View>
                <View className='flex-row items-center justify-end gap-3'>
                  <Pressable accessibilityRole='button' className='py-2' onPress={handleToggleForm}>
                    <Text className='text-[11px] font-semibold tracking-[3px] text-slate-500'>CANCEL</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole='button'
                    className={`rounded-3xl border border-slate-900 px-5 py-2 ${!canSubmit ? 'opacity-40' : ''}`}
                    disabled={!canSubmit}
                    onPress={handleSubmit}
                  >
                    <Text className='text-[11px] font-semibold tracking-[3px] text-slate-900'>ADD</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          <View className='gap-4'>
            {orderedHabits.map((habit) => {
              const weekStatus = weekDateStrings.map((ds) => getHabitStatus(habit._id, ds));

              // Calculate streak (consecutive days completed up to today)
              const calculateStreak = () => {
                const completedDates = new Set(
                  tracking.filter((t) => t.habitId === habit._id && t.completed).map((t) => t.date)
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
                  streak={streak}
                  toggleHabit={toggleHabit}
                  weekDateStrings={weekDateStrings}
                  weekStatus={weekStatus}
                />
              );
            })}
          </View>
        </View>
        <SettingsModal visible={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </ScrollView>
      <View pointerEvents='box-none' className='absolute bottom-8 right-6'>
        <Pressable
          accessibilityHint={isAdding ? 'Close add habit form' : 'Open add habit form'}
          accessibilityLabel={isAdding ? 'Close' : 'Add habit'}
          accessibilityRole='button'
          className='h-14 w-14 items-center justify-center rounded-full bg-[#101727] shadow-lg'
          onPress={handleToggleForm}
        >
          <Plus color='#ffffff' size={24} />
        </Pressable>
      </View>
    </GestureHandlerRootView>
  );
}

export default function App() {
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
