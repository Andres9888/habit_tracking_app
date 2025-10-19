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
        <View className='max-h-[90%] rounded-t-[24px] bg-white'>
          {/* Drag Handle */}
          <View className='items-center py-3'>
            <View className='h-1 w-12 rounded-full bg-slate-300' />
          </View>

          {/* Header */}
          <View className='border-b border-slate-100 px-6 pb-4'>
            <View className='flex-row items-start justify-between'>
              <View className='flex-1 flex-row items-start gap-3'>
                {emoji && (
                  <View className='h-14 w-14 items-center justify-center rounded-2xl bg-orange-100'>
                    <Text className='text-3xl'>{emoji}</Text>
                  </View>
                )}
                <View className='flex-1'>
                  <Text className='text-lg font-bold text-slate-900'>
                    {name}
                  </Text>
                  {habit.notes && (
                    <Text className='mt-0.5 text-sm text-slate-500'>
                      {habit.notes}
                    </Text>
                  )}
                </View>
              </View>
              <Pressable
                className='ml-2 h-8 w-8 items-center justify-center'
                onPress={onClose}
              >
                <X color='#64748b' size={20} />
              </Pressable>
            </View>
          </View>

          <ScrollView className='px-6' showsVerticalScrollIndicator={false}>
            {/* Heatmap Calendar */}
            <View className='mb-5 mt-5'>
              <HeatmapCalendar habitId={habit._id} tracking={tracking} />
            </View>

            {/* Streak Goal Section */}
            <View className='mb-5 flex-row items-center justify-between'>
              <Text className='text-base font-semibold text-slate-700'>
                Streak Goal
              </Text>
              <View className='flex-row items-center gap-3'>
                <View className='flex-row items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5'>
                  <Flame color='#f97316' size={16} fill='#f97316' />
                  <Text className='text-base font-bold text-slate-900'>
                    {streak}
                  </Text>
                </View>
                <Pressable className='h-8 w-8 items-center justify-center'>
                  <Edit2 color='#64748b' size={18} />
                </Pressable>
                <Pressable className='h-8 w-8 items-center justify-center'>
                  <Settings color='#64748b' size={18} />
                </Pressable>
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
