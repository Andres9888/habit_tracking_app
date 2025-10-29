import { useState } from 'react';
import { ChevronLeft } from 'lucide-react-native';
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
}

export default function HabitCalendarModal({
  visible,
  onClose,
  habit,
  streak,
  tracking,
  toggleHabit,
}: HabitCalendarModalProps) {
  const [showEditScreen, setShowEditScreen] = useState(false);
  const [calendarView, setCalendarView] = useState<CalendarView>('month');

  if (!habit) return null;

  const { emoji, name } = getEmojiAndName(habit.name);

  const handleEditPress = () => {
    setShowEditScreen(true);
  };

  const handleCloseEdit = () => {
    setShowEditScreen(false);
  };

  // Calculate stats
  const habitTracking = tracking
    .filter((t) => t.habitId === habit._id)
    .map((t) => ({ completed: t.completed, date: t.date }));

  const bestStreak = calculateBestStreak(habitTracking);
  const completionPercentage = calculateCompletionPercentage(
    habit.createdAt || Date.now(),
    habitTracking
  );

  // Filter tracking for activity log
  const activityTracking = tracking.filter((t) => t.habitId === habit._id);

  return (
    <Modal animationType='slide' visible={visible} onRequestClose={onClose}>
      <SafeAreaView className='flex-1 bg-[#F8F5F1]'>
        {/* Navigation Header - Matches Figma */}
        <View className='flex-row items-center justify-between px-4 pb-4 pt-2'>
          <Pressable
            className='h-10 w-10 items-center justify-center rounded-full active:bg-slate-200'
            onPress={onClose}
          >
            <ChevronLeft color='#1a1a1a' size={24} />
          </Pressable>
          <Text className='text-xl font-bold text-slate-900'>{name}</Text>
          <TouchableOpacity
            className='rounded-lg bg-blue-500 px-4 py-2'
            onPress={handleEditPress}
          >
            <Text className='text-sm font-semibold text-white'>Edit</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className='px-4' showsVerticalScrollIndicator={false}>
          {/* Stats Card - Already matches Figma design */}
          <View className='mt-4'>
            <StatsCard
              bestStreak={bestStreak}
              completionPercentage={completionPercentage}
              currentStreak={streak}
              emoji={emoji}
              habitName={habit.name}
              habitNotes={habit.notes}
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
      />
    </Modal>
  );
}
