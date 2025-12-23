import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  AlertTriangle,
  ChevronLeft,
  Flame,
  MoreVertical,
} from 'lucide-react-native';
import {
  Modal,
  View,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Id } from '../../convex/_generated/dataModel';
import { getEmojiAndName } from './DraggableHabit/DraggableHabit.hooks';
import { StatsCard } from './HabitCalendarModal/StatsCard';
import { ActivityLog } from './HabitCalendarModal/ActivityLog';
import { CalendarTabs } from './HabitCalendarModal/CalendarTabs';
import HeatmapCalendar from './HabitCalendarModal/HeatmapCalendar';
import HabitCalendarView from './HabitCalendarView';
import {
  calculateBestStreak,
  calculateCompletionPercentage,
} from '../utils/habitCalculations';
import HabitEditScreen from '../screens/HabitEditScreen';

type CalendarView = 'month' | 'year';

interface Habit {
  _id: Id<'habits'>;
  name: string;
  notes?: string;
  strength?: number;
  frequency?: string;
  reminderTime?: string;
  preferredTime?: string;
  [key: string]: any;
}

interface HabitCalendarModalProps {
  visible: boolean;
  onClose: () => void;
  habit: Habit | null;
  streak: number;
  tracking: Array<{
    _creationTime: number;
    habitId: Id<'habits'>;
    date: string;
    completed: boolean;
  }>;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => void;
  /** Optional callback to navigate to HabitDetail's Motivation tab for advanced features */
  onOpenMotivationTab?: () => void;
}

export default function HabitCalendarModal({
  visible,
  onClose,
  habit,
  streak,
  tracking,
  toggleHabit,
  onOpenMotivationTab,
}: HabitCalendarModalProps) {
  const [showEditScreen, setShowEditScreen] = useState(false);
  const [calendarView, setCalendarView] = useState<CalendarView>('month');

  if (!habit) return null;

  const { emoji, name } = getEmojiAndName(habit.name);
  const scheduleLabel = buildScheduleLabel(habit);
  const todayDateString = format(new Date(), 'yyyy-MM-dd');
  const habitTrackingEntries = tracking.filter((t) => t.habitId === habit._id);
  const habitTracking = habitTrackingEntries.map((t) => ({
    completed: t.completed,
    date: t.date,
  }));
  const todayTracking = habitTrackingEntries.find(
    (t) => t.date === todayDateString
  );
  const isTodayCompleted = Boolean(todayTracking?.completed);
  const recentMissBadge = getLatestMissedBadge(
    habitTrackingEntries,
    todayDateString
  );
  const markTodayLabel = isTodayCompleted ? 'Completed today' : 'Mark Today Done';

  const handleEditPress = () => {
    setShowEditScreen(true);
  };

  const handleCloseEdit = () => {
    setShowEditScreen(false);
  };

  const bestStreak = calculateBestStreak(habitTracking);
  const completionPercentage = calculateCompletionPercentage(
    habit.createdAt || Date.now(),
    habitTracking
  );

  // Filter tracking for activity log
  const activityTracking = habitTrackingEntries;

  const handleQuickLogPress = () => {
    if (isTodayCompleted) return;
    toggleHabit({ habitId: habit._id, date: todayDateString });
  };

  // Handler for navigating to advanced features (Cue, Affirmations, Vision Board)
  // This closes the edit screen, closes this modal, and opens HabitDetail's Motivation tab
  const handleOpenAdvancedFeatures = () => {
    setShowEditScreen(false);
    onClose();
    onOpenMotivationTab?.();
  };

  return (
    <Modal animationType='slide' visible={visible} onRequestClose={onClose}>
      <SafeAreaView className='flex-1 bg-[#F8F5F1]'>
        {/* Navigation Header */}
        <View className='flex-row items-center justify-between px-4 pb-4 pt-2'>
          <Pressable
            accessibilityHint='Return to the previous screen'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center rounded-full active:bg-stone-200'
            onPress={onClose}
          >
            <ChevronLeft color='#1a1a1a' size={24} />
          </Pressable>
          <Text className='text-xl font-bold text-stone-900'>{name}</Text>
          <Pressable
            accessibilityLabel='Habit options'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center rounded-full active:bg-stone-200'
            onPress={handleEditPress}
          >
            <MoreVertical color='#1a1a1a' size={20} />
          </Pressable>
        </View>

        <ScrollView className='px-4' showsVerticalScrollIndicator={false}>
          {/* Status Ribbon */}
          <View className='mt-2'>
            <View
              className='rounded-3xl bg-white p-5'
              style={{
                shadowColor: '#1c1917',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.08,
                shadowRadius: 24,
              }}
            >
              <View className='flex-row gap-4'>
                <View className='items-center'>
                  <View className='h-16 w-16 items-center justify-center rounded-2xl bg-blue-50'>
                    <Text className='text-4xl'>{emoji}</Text>
                  </View>
                </View>

                <View className='flex-1'>
                  <View className='flex-row items-start justify-between'>
                    <View className='flex-1 pr-4'>
                      <Text className='text-xl font-semibold text-stone-900'>
                        {name}
                      </Text>
                      {scheduleLabel ? (
                        <Text className='mt-1 text-sm text-stone-500'>
                          {scheduleLabel}
                        </Text>
                      ) : null}
                      {habit.notes ? (
                        <Text
                          className='mt-2 text-sm text-stone-500'
                          numberOfLines={2}
                        >
                          {habit.notes}
                        </Text>
                      ) : null}
                    </View>

                    <View className='items-end'>
                      <View className='flex-row items-center rounded-full bg-orange-50 px-3 py-1'>
                        <Flame color='#ea580c' size={16} />
                        <Text className='ml-1 text-xs font-semibold text-orange-700'>
                          Current streak
                        </Text>
                      </View>
                      <Text className='mt-2 text-lg font-semibold text-stone-900'>
                        {streak} days
                      </Text>
                      <Text className='text-xs text-stone-400'>
                        Best {bestStreak} {bestStreak === 1 ? 'day' : 'days'}
                      </Text>
                    </View>
                  </View>

                  {recentMissBadge ? (
                    <View className='mt-3 flex-row items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1'>
                      <AlertTriangle color='#b45309' size={14} />
                      <Text className='text-xs font-medium text-amber-700'>
                        {recentMissBadge} · Tap to review
                      </Text>
                    </View>
                  ) : null}

                  <View className='mt-4 flex-row gap-3'>
                    <TouchableOpacity
                      accessibilityLabel={
                        isTodayCompleted
                          ? 'Today already completed'
                          : 'Mark this habit as done today'
                      }
                      accessibilityRole='button'
                      className={`flex-1 rounded-2xl px-4 py-3 ${
                        isTodayCompleted ? 'bg-stone-200' : 'bg-blue-500'
                      }`}
                      disabled={isTodayCompleted}
                      onPress={handleQuickLogPress}
                    >
                      <Text
                        className={`text-center text-base font-semibold ${
                          isTodayCompleted ? 'text-stone-600' : 'text-white'
                        }`}
                      >
                        {markTodayLabel}
                      </Text>
                    </TouchableOpacity>

                    <Pressable
                      accessibilityLabel='Edit habit'
                      accessibilityRole='button'
                      className='w-[110px] items-center justify-center rounded-2xl border border-stone-200 px-3'
                      onPress={handleEditPress}
                    >
                      <Text className='text-sm font-semibold text-stone-700'>
                        Edit habit
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Stats Card */}
          <View className='mt-5'>
            <StatsCard
              bestStreak={bestStreak}
              completionPercentage={completionPercentage}
              currentStreak={streak}
              emoji={emoji}
              habitName={habit.name}
              habitNotes={habit.notes}
              showHeader={false}
            />
          </View>

          {/* Calendar Tabs - Switch between Month and Year view */}
          <View className='mt-8'>
            <CalendarTabs
              activeView={calendarView}
              onViewChange={setCalendarView}
            />

            {/* Conditional Calendar Rendering */}
            {calendarView === 'month' ? (
              <HabitCalendarView
                habitId={habit._id}
                toggleHabit={toggleHabit}
                tracking={tracking}
              />
            ) : (
              <HeatmapCalendar
                habitId={habit._id}
                monthsToShow={6}
                tracking={tracking}
              />
            )}
          </View>

          {/* Activity Log - Matches Figma styling */}
          <View className='mt-8 pb-6'>
            <ActivityLog tracking={activityTracking} />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Habit Edit Screen */}
      <HabitEditScreen
        habitId={habit._id}
        visible={showEditScreen}
        onClose={handleCloseEdit}
        onOpenCueEditor={onOpenMotivationTab ? handleOpenAdvancedFeatures : undefined}
        onOpenAffirmationsEditor={onOpenMotivationTab ? handleOpenAdvancedFeatures : undefined}
        onOpenVisionBoard={onOpenMotivationTab ? handleOpenAdvancedFeatures : undefined}
      />
    </Modal>
  );
}

const FREQUENCY_LABELS: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  custom: 'Custom',
};

function buildScheduleLabel(habit: Habit) {
  const { frequency, reminderTime, preferredTime } = habit;
  const formattedFrequency = frequency
    ? FREQUENCY_LABELS[frequency] ||
      frequency
        .split('_')
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ')
    : undefined;
  const formattedTime = reminderTime
    ? reminderTime
    : preferredTime
    ? preferredTime.charAt(0).toUpperCase() + preferredTime.slice(1)
    : undefined;

  if (formattedFrequency && formattedTime) {
    return `${formattedFrequency} · ${formattedTime}`;
  }

  return formattedFrequency || formattedTime;
}

type TrackingEntry = HabitCalendarModalProps['tracking'][number];

function getLatestMissedBadge(
  trackingEntries: TrackingEntry[],
  todayDate: string
) {
  const previousMiss = trackingEntries
    .filter((entry) => !entry.completed && entry.date < todayDate)
    .sort((a, b) => (a.date < b.date ? 1 : -1))[0];

  if (!previousMiss) {
    return null;
  }

  return `Missed ${format(parseISO(previousMiss.date), 'EEE')}`;
}
