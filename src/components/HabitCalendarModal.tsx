import { ChevronLeft, MoreVertical } from 'lucide-react-native';
import {
  Modal,
  View,
  Pressable,
  ScrollView,
  Text,
  SafeAreaView,
} from 'react-native';
import type { Id } from '../../convex/_generated/dataModel';
import HabitCalendarView from './HabitCalendarView';
import { getEmojiAndName } from './DraggableHabit/DraggableHabit.hooks';
import { StatsCard } from './HabitCalendarModal/StatsCard';
import { ActivityLog } from './HabitCalendarModal/ActivityLog';
import {
  calculateBestStreak,
  calculateCompletionPercentage,
} from '../utils/habitCalculations';

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
  if (!habit) return null;

  const { emoji, name } = getEmojiAndName(habit.name);

  // Calculate stats
  const habitTracking = tracking
    .filter((t) => t.habitId === habit._id)
    .map((t) => ({ date: t.date, completed: t.completed }));

  const bestStreak = calculateBestStreak(habitTracking);
  const completionPercentage = calculateCompletionPercentage(
    habit.createdAt || Date.now(),
    habitTracking
  );

  // Filter tracking for activity log
  const activityTracking = tracking.filter((t) => t.habitId === habit._id);

  return (
    <Modal
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView className='flex-1 bg-[#F8F5F1]'>
        {/* Navigation Header */}
        <View className='flex-row items-center justify-between border-b border-slate-100 bg-[#F8F5F1] px-4 pb-4 pt-2'>
          <Pressable
            className='h-10 w-10 items-center justify-center rounded-full'
            onPress={onClose}
          >
            <ChevronLeft color='#1a1a1a' size={24} />
          </Pressable>
          <Text className='text-xl font-bold text-slate-900'>{name}</Text>
          <Pressable className='h-10 w-10 items-center justify-center rounded-full'>
            <MoreVertical color='#1a1a1a' size={24} />
          </Pressable>
        </View>

        <ScrollView className='px-4' showsVerticalScrollIndicator={false}>
          {/* Stats Card */}
          <View className='mt-5'>
            <StatsCard
              habitName={habit.name}
              habitNotes={habit.notes}
              emoji={emoji}
              currentStreak={streak}
              bestStreak={bestStreak}
              completionPercentage={completionPercentage}
            />
          </View>

          {/* Monthly Calendar */}
          <View className='mt-8'>
            <HabitCalendarView
              habitId={habit._id}
              toggleHabit={toggleHabit}
              tracking={tracking}
            />
          </View>

          {/* Activity Log */}
          <View className='pb-6'>
            <ActivityLog tracking={activityTracking} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
