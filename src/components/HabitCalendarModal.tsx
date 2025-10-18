import { X, Flame, Edit2, Settings } from 'lucide-react-native';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import type { Id } from '../../convex/_generated/dataModel';
import HabitCalendarView from './HabitCalendarView';
import { getEmojiAndName } from './DraggableHabit/DraggableHabit.hooks';
import HeatmapCalendar from './HabitCalendarModal/HeatmapCalendar';

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
  tracking: Array<{ habitId: Id<'habits'>; date: string; completed: boolean }>;
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

  return (
    <Modal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 justify-end bg-black/50'>
        <Pressable className='flex-1' onPress={onClose} />
        <View className='max-h-[85%] rounded-t-[28px] bg-white'>
          {/* Header */}
          <View className='border-b border-slate-100 px-6 pb-4 pt-6'>
            <View className='mb-4 flex-row items-start justify-between'>
              <View className='flex-1 flex-row items-start gap-3'>
                {emoji && (
                  <Text className='text-4xl'>{emoji}</Text>
                )}
                <View className='flex-1'>
                  <Text className='text-xl font-bold tracking-tight text-slate-900'>
                    {name}
                  </Text>
                  {habit.notes && (
                    <Text className='mt-1 text-sm text-slate-500'>
                      {habit.notes}
                    </Text>
                  )}
                </View>
              </View>
              <Pressable
                className='ml-2 rounded-xl bg-slate-50 p-2'
                onPress={onClose}
              >
                <X color='#64748b' size={20} />
              </Pressable>
            </View>
          </View>

          <ScrollView className='px-6' showsVerticalScrollIndicator={false}>
            {/* Heatmap Calendar */}
            <View className='mb-6 mt-6'>
              <HeatmapCalendar habitId={habit._id} tracking={tracking} />
            </View>

            {/* Streak Goal Section */}
            <View className='mb-6 flex-row items-center justify-between rounded-2xl bg-slate-50 px-5 py-4'>
              <Text className='text-sm font-semibold uppercase tracking-wide text-slate-500'>
                Streak Goal
              </Text>
              <View className='flex-row items-center gap-4'>
                <View className='flex-row items-center gap-2'>
                  <Flame color='#f97316' size={20} fill='#f97316' />
                  <Text className='text-lg font-bold text-slate-900'>
                    {streak}
                  </Text>
                </View>
                <View className='flex-row gap-2'>
                  <Pressable className='rounded-lg bg-white p-2'>
                    <Edit2 color='#64748b' size={16} />
                  </Pressable>
                  <Pressable className='rounded-lg bg-white p-2'>
                    <Settings color='#64748b' size={16} />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Monthly Calendar */}
            <View className='pb-6'>
              <HabitCalendarView
                habitId={habit._id}
                toggleHabit={toggleHabit}
                tracking={tracking}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
