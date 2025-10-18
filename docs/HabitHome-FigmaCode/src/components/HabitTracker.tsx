import { useState } from 'react';
import { StatusBar } from './StatusBar';
import { DateSelector } from './DateSelector';
import { HabitCard } from './HabitCard';
import { AddHabitButton } from './AddHabitButton';
import { Settings, BarChart3 } from 'lucide-react';
import { AddHabitDialog } from './AddHabitDialog';
import type { Habit } from './types';

interface HabitTrackerProps {
  onViewStats: () => void;
}

export function HabitTracker({ onViewStats }: HabitTrackerProps) {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Meditation',
      emoji: '🧘',
      color: '#4ADE80',
      completedDates: [
        '2024-10-01',
        '2024-10-02',
        '2024-10-03',
        '2024-10-04',
        '2024-10-05',
      ],
      createdAt: '2024-09-30',
    },
    {
      id: '2',
      name: 'Reading',
      emoji: '📚',
      color: '#60A5FA',
      completedDates: ['2024-10-01', '2024-10-03', '2024-10-05'],
      createdAt: '2024-09-30',
    },
    {
      id: '3',
      name: 'Exercise',
      emoji: '💪',
      color: '#F59E0B',
      completedDates: ['2024-10-02', '2024-10-04'],
      createdAt: '2024-09-30',
    },
  ]);

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === habitId) {
          const isCompleted = habit.completedDates.includes(date);
          return {
            ...habit,
            completedDates: isCompleted
              ? habit.completedDates.filter((d) => d !== date)
              : [...habit.completedDates, date].sort(),
          };
        }
        return habit;
      })
    );
  };

  const addHabit = (name: string, emoji: string, color: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      emoji,
      color,
      completedDates: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter((h) => h.id !== habitId));
  };

  return (
    <div className='flex h-full flex-col'>
      <StatusBar />

      <div className='flex items-center justify-between px-6 py-4'>
        <h1 className='text-[28px] font-semibold'>Habits</h1>
        <div className='flex gap-3'>
          <button
            onClick={onViewStats}
            className='flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200'
          >
            <BarChart3 className='h-5 w-5' />
          </button>
          <button className='flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200'>
            <Settings className='h-5 w-5' />
          </button>
        </div>
      </div>

      <DateSelector
        currentWeekOffset={currentWeekOffset}
        onWeekChange={setCurrentWeekOffset}
      />

      <div className='flex-1 space-y-4 overflow-y-auto px-6 py-4'>
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            currentWeekOffset={currentWeekOffset}
            onToggle={toggleHabitCompletion}
            onDelete={deleteHabit}
          />
        ))}
      </div>

      <AddHabitButton onClick={() => setShowAddDialog(true)} />

      <AddHabitDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={addHabit}
      />
    </div>
  );
}
