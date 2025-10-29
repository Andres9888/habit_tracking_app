import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, {
  ScaleDecorator,
  type RenderItemParams,
} from 'react-native-draggable-flatlist';
import {
  addDays,
  eachDayOfInterval,
  format,
  startOfDay,
  subMonths,
} from 'date-fns';
import { Plus, Settings } from 'lucide-react-native';
import { useMutation, useQuery } from 'convex/react';
import type { Id } from '../../../convex/_generated/dataModel';
import { api } from '../../../convex/_generated/api';
import { CalendarTimeline } from '../../components/CalendarTimeline';
import SettingsModal from '../../components/SettingsModal';
import { HapticTest } from '../../components/HapticTest';
import CreateHabitModal from '../../components/CreateHabitModal';
import DraggableHabit from '../../components/DraggableHabit';
import HabitCalendarModal from '../../components/HabitCalendarModal';
import HabitDetailScreen from '../../screens/HabitDetailScreen';
import MilestoneCelebration from '../../components/MilestoneCelebration';
import { useMilestoneDetection } from '../../hooks/useMilestoneDetection';
import PauseHabitModal from '../../components/PauseHabitModal';
import HabitsAtRiskWidget from '../../components/HabitsAtRiskWidget';
import type {
  ShareCardData,
  ShareCardGeneratorProps,
} from '../../components/ShareCardGenerator';

type HabitStatus = 'done' | 'missed' | 'planned';

const WebToaster = () => {
  const [ToasterComponent, setToasterComponent] =
    useState<ComponentType | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    void import('sonner').then((module) => {
      setToasterComponent(() => module.Toaster as ComponentType);
    });
  }, []);

  if (Platform.OS !== 'web' || !ToasterComponent) {
    return null;
  }

  const Toaster = ToasterComponent;
  return <Toaster />;
};

export function HabitsApp() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateHabitOpen, setIsCreateHabitOpen] = useState(false);
  const [showHabitStrengthPercentage, setShowHabitStrengthPercentage] =
    useState(true);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isHabitCalendarOpen, setIsHabitCalendarOpen] = useState(false);
  const [isHabitDetailOpen, setIsHabitDetailOpen] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareCardData, setShareCardData] = useState<ShareCardData | null>(
    null
  );
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [habitToPause, setHabitToPause] = useState<Habit | null>(null);
  const [habitToEdit, setHabitToEdit] = useState<any>(null);
  const [showHapticTest, setShowHapticTest] = useState(false);
  const [ShareCardGeneratorComponent, setShareCardGeneratorComponent] =
    useState<ComponentType<ShareCardGeneratorProps> | null>(null);

  const toggleHabit = useMutation(api.habits.toggleHabit);
  const archiveHabit = useMutation(api.habits.archive);
  const pauseHabit = useMutation(api.habits.pause);
  const removeHabit = useMutation(api.habits.remove);
  const reorderHabits = useMutation(api.habits.reorderHabits);
  const updateSettings = useMutation(api.settings.update);
  const habitsQuery = useQuery(api.habits.list);
  const habits = habitsQuery ?? [];
  const isHabitsLoading = habitsQuery === undefined;
  const settings = useQuery(api.settings.get);

  type Habit = (typeof habits)[number];

  const [lastUpdatedHabit, setLastUpdatedHabit] = useState<{
    id: string;
    name: string;
    strength: number;
  } | null>(null);

  useEffect(() => {
    if (!showShareCard || ShareCardGeneratorComponent) {
      return;
    }

    void import('../../components/ShareCardGenerator').then((module) => {
      setShareCardGeneratorComponent(() => module.ShareCardGenerator);
    });
  }, [ShareCardGeneratorComponent, showShareCard]);

  const { milestone, clearMilestone } = useMilestoneDetection(
    lastUpdatedHabit?.id,
    lastUpdatedHabit?.name,
    lastUpdatedHabit?.strength ? lastUpdatedHabit.strength * 100 : undefined
  );

  useEffect(() => {
    if (milestone) {
      console.log('🎉 MILESTONE DETECTED!', {
        habitName: milestone.habitName,
        level: milestone.level,
        strength: milestone.strength + '%',
      });
    }
  }, [milestone]);

  const prevStrengthsRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (isHabitsLoading) return;

    for (const habit of habits) {
      const prevStrength = prevStrengthsRef.current.get(habit._id) || 0;
      const currentStrength = habit.strength || 0;

      if (currentStrength > prevStrength) {
        console.log('🎯 Strength increased!', {
          currentStrength: (currentStrength * 100).toFixed(1) + '%',
          habitName: habit.name,
          prevStrength: (prevStrength * 100).toFixed(1) + '%',
        });
        setLastUpdatedHabit({
          id: habit._id,
          name: habit.name,
          strength: currentStrength,
        });
      }

      prevStrengthsRef.current.set(habit._id, currentStrength);
    }
  }, [habits, isHabitsLoading]);

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

  const extendedDateRange = useMemo(() => {
    const endDate = today;
    const startDate = subMonths(endDate, 12);
    return eachDayOfInterval({ end: endDate, start: startDate });
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

      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      const todayString = format(todayDate, 'yyyy-MM-dd');
      const currentDate = completedDates.has(todayString)
        ? new Date(todayDate)
        : new Date(todayDate.getTime() - 24 * 60 * 60 * 1000);

      let streak = 0;
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

  const getHabitStatus = useCallback(
    (habitId: string, dateString: string): HabitStatus => {
      const trackingEntry = tracking.find(
        (t) => t.habitId === habitId && t.date === dateString
      );

      if (trackingEntry?.completed) return 'done';

      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);

      if (date < today) return 'missed';
      return 'planned';
    },
    [tracking, today]
  );

  const handleDragEnd = useCallback(
    async ({ data }: { data: Habit[] }) => {
      try {
        const habitIds = data.map((h) => h._id);
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

  const handleDeleteHabit = useCallback(
    async (habitId: Id<'habits'>) => {
      if (Platform.OS === 'web') {
        if (
          !confirm(
            'Are you sure you want to delete this habit? This cannot be undone.'
          )
        ) {
          return;
        }
        await removeHabit({ habitId });
        setIsHabitDetailOpen(false);
        setSelectedHabit(null);
      } else {
        Alert.alert(
          'Delete Habit',
          'Are you sure you want to delete this habit? This cannot be undone.',
          [
            { style: 'cancel', text: 'Cancel' },
            {
              onPress: async () => {
                await removeHabit({ habitId });
                setIsHabitDetailOpen(false);
                setSelectedHabit(null);
              },
              style: 'destructive',
              text: 'Delete',
            },
          ]
        );
      }
    },
    [removeHabit]
  );

  const handleHabitLongPress = useCallback((habit: Habit) => {
    setSelectedHabit(habit);
    setIsHabitCalendarOpen(true);
  }, []);

  const handleHabitPress = useCallback((habit: Habit) => {
    setSelectedHabit(habit);
    setIsHabitCalendarOpen(true);
  }, []);

  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: 96,
      paddingHorizontal: 24,
      paddingTop: 48,
    }),
    []
  );

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Habit>) => {
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
      getHabitStatus,
    ]
  );

  const renderEmptyState = useCallback(() => {
    if (isHabitsLoading) {
      return (
        <View className='items-center justify-center gap-3 py-20'>
          <ActivityIndicator color='#101727' size='small' />
          <Text className='text-sm font-medium text-[#475467]'>
            Loading your habits…
          </Text>
        </View>
      );
    }

    return (
      <View className='items-center justify-center gap-4 px-8 py-24'>
        <Text className='text-center text-lg font-semibold text-[#101727]'>
          Create your first habit
        </Text>
        <Text className='text-center text-sm text-[#475467]'>
          Add a habit to start tracking your progress and building streaks.
        </Text>
        <Pressable
          accessibilityHint='Open create habit modal'
          accessibilityLabel='Add habit'
          accessibilityRole='button'
          className='h-11 flex-row items-center gap-2 rounded-full bg-[#101828] px-5'
          onPress={handleToggleForm}
        >
          <Plus color='#ffffff' size={18} strokeWidth={2.25} />
          <Text className='text-base font-medium tracking-tight text-white'>
            New Habit
          </Text>
        </Pressable>
      </View>
    );
  }, [handleToggleForm, isHabitsLoading]);

  const renderHeader = useCallback(
    () => (
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

        <CalendarTimeline
          canNavigateForward={canNavigateForward}
          dates={weekDates}
          onNextWeek={handleNextWeek}
          onPreviousWeek={handlePreviousWeek}
          showSeparator
        />

        <HabitsAtRiskWidget
          onHabitPress={(habitId) => {
            const habit = habits.find((h) => h._id === habitId);
            if (habit) {
              handleHabitPress(habit);
            }
          }}
        />
      </View>
    ),
    [
      canNavigateForward,
      handleNextWeek,
      handlePreviousWeek,
      handleToggleForm,
      handleHabitPress,
      habits,
      weekDates,
    ]
  );

  return (
    <GestureHandlerRootView className='flex-1'>
      <View className='flex-1 items-center bg-background'>
        <View className='w-full max-w-[448px] flex-1'>
          <DraggableFlatList
            activationDistance={10}
            contentContainerStyle={contentContainerStyle}
            data={habits}
            keyExtractor={(item: Habit) => item._id}
            ListEmptyComponent={renderEmptyState}
            ListHeaderComponent={renderHeader}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            onDragEnd={handleDragEnd}
          />
        </View>
        <WebToaster />
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
      </View>

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
        onOpenHapticTest={() => {
          setIsSettingsOpen(false);
          setShowHapticTest(true);
        }}
      />
      <CreateHabitModal
        habitToEdit={habitToEdit || undefined}
        visible={isCreateHabitOpen || habitToEdit !== null}
        onClose={() => {
          setIsCreateHabitOpen(false);
          setHabitToEdit(null);
        }}
      />

      <Modal
        animationType='slide'
        visible={showHapticTest}
        onRequestClose={() => setShowHapticTest(false)}
      >
        <View className='flex-1'>
          <View className='px-4 py-4' style={{ backgroundColor: '#111827' }}>
            <Pressable onPress={() => setShowHapticTest(false)}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                ← Back to App
              </Text>
            </Pressable>
          </View>
          <HapticTest />
        </View>
      </Modal>

      <HabitCalendarModal
        habit={selectedHabit}
        streak={selectedHabit ? getStreak(selectedHabit._id) : 0}
        toggleHabit={toggleHabit}
        tracking={tracking}
        visible={isHabitCalendarOpen}
        onClose={() => setIsHabitCalendarOpen(false)}
      />
      <HabitDetailScreen
        habit={selectedHabit}
        isPremium={process.env.EXPO_PUBLIC_ENABLE_PREMIUM === 'true' || true}
        visible={isHabitDetailOpen}
        onArchive={handleArchive}
        onClose={() => setIsHabitDetailOpen(false)}
        onDelete={handleDeleteHabit}
        onEdit={(habit) => {
          setIsHabitDetailOpen(false);
          setHabitToEdit(habit);
        }}
        onOpenCalendar={(habit) => {
          setSelectedHabit(habit);
          setIsHabitCalendarOpen(true);
        }}
        onPause={(habitId) => {
          const habit = habits.find((h) => h._id === habitId);
          if (habit) {
            setHabitToPause(habit);
            setShowPauseModal(true);
          }
        }}
        onUpgrade={() => {
          console.log('Upgrade to premium');
        }}
      />

      {milestone && (
        <MilestoneCelebration
          visible
          habitName={milestone.habitName}
          level={milestone.level}
          strength={milestone.strength}
          onClose={() => {
            clearMilestone();
            setLastUpdatedHabit(null);
          }}
          onShare={() => {
            setShareCardData({
              habitName: milestone.habitName,
              milestoneLevel: milestone.level,
              strengthPercentage: milestone.strength,
            });
            setShowShareCard(true);
          }}
        />
      )}

      {showShareCard && shareCardData && ShareCardGeneratorComponent && (
        <ShareCardGeneratorComponent
          data={shareCardData}
          visible={showShareCard}
          onClose={() => {
            setShowShareCard(false);
            setShareCardData(null);
            clearMilestone();
            setLastUpdatedHabit(null);
          }}
        />
      )}

      <PauseHabitModal
        habitName={habitToPause?.name || ''}
        visible={showPauseModal}
        onCancel={() => {
          setShowPauseModal(false);
          setHabitToPause(null);
        }}
        onConfirm={async () => {
          if (habitToPause) {
            await pauseHabit({ habitId: habitToPause._id });
            setShowPauseModal(false);
            setHabitToPause(null);
            setIsHabitDetailOpen(false);
          }
        }}
      />
    </GestureHandlerRootView>
  );
}
