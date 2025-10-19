import { X } from 'lucide-react-native';
import { Modal, View, Pressable, ScrollView } from 'react-native';
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
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 justify-end bg-black/50'>
        <Pressable className='flex-1' onPress={onClose} />
        <View className='max-h-[90%] rounded-t-[24px] bg-white'>
          {/* Drag Handle */}
          <View className='items-center py-3'>
            <View className='h-1 w-12 rounded-full bg-slate-300' />
          </View>

          {/* Header */}
          <View className='border-b border-slate-100 px-4 pb-4'>
            <View className='flex-row items-start justify-between'>
              <View className='flex-1'>
                <View />
              </View>
              <Pressable
                className='h-10 w-10 items-center justify-center'
                onPress={onClose}
              >
                <X color='#64748b' size={24} />
              </Pressable>
            </View>
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
            <View className='mt-6'>
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
        </View>
      </View>
    </Modal>
  );
}
