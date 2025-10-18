import { motion } from 'motion/react';
import { Check, Flame, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { Habit } from './types';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from './ui/context-menu';

interface HabitCardProps {
  habit: Habit;
  currentWeekOffset: number;
  onToggle: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
}

export function HabitCard({
  habit,
  currentWeekOffset,
  onToggle,
  onDelete,
}: HabitCardProps) {
  const getDatesForWeek = (offset: number) => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + offset * 7);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  };

  const weekDates = getDatesForWeek(currentWeekOffset);

  const calculateStreak = () => {
    const sortedDates = [...habit.completedDates].sort().reverse();
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const dateStr of sortedDates) {
      const completedDate = new Date(dateStr);
      completedDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(currentDate);
      expectedDate.setDate(currentDate.getDate() - streak);

      if (completedDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const streak = calculateStreak();
  const completionRate = weekDates.filter((date) =>
    habit.completedDates.includes(date)
  ).length;

  const handleToggle = (date: string) => {
    const isCompleting = !habit.completedDates.includes(date);
    onToggle(habit.id, date);

    if (isCompleting) {
      toast.success(`${habit.emoji} Great job on ${habit.name}!`);
    }
  };

  const handleDelete = () => {
    onDelete(habit.id);
    toast.success('Habit deleted');
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md'
        >
          <div className='mb-4 flex items-start justify-between'>
            <div className='flex items-center gap-3'>
              <div className='text-3xl'>{habit.emoji}</div>
              <div>
                <h3 className='text-[17px] font-semibold'>{habit.name}</h3>
                {streak > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className='mt-1 flex items-center gap-1'
                  >
                    <Flame className='h-3.5 w-3.5 text-orange-500' />
                    <span className='text-[11px] font-semibold uppercase tracking-wide text-orange-500'>
                      {streak} Day Streak
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
            <div className='text-sm text-gray-500'>{completionRate}/7</div>
          </div>

          <div className='flex justify-between gap-2'>
            {weekDates.map((date, index) => {
              const isCompleted = habit.completedDates.includes(date);
              const isFuture = new Date(date) > new Date();

              return (
                <motion.button
                  key={date}
                  onClick={() => !isFuture && handleToggle(date)}
                  disabled={isFuture}
                  whileTap={{ scale: 0.9 }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                    isFuture
                      ? 'cursor-not-allowed bg-gray-100 opacity-50'
                      : isCompleted
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-200 hover:bg-gray-300'
                  } `}
                >
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                      }}
                    >
                      <Check className='h-5 w-5 text-white' />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleDelete} className='text-red-600'>
          <Trash2 className='mr-2 h-4 w-4' />
          Delete Habit
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
