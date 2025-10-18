import { useState } from 'react';
import {
  ArrowLeft,
  TrendingUp,
  Target,
  Calendar,
  Award,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import { StatusBar } from './StatusBar';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

interface StatsViewProps {
  onBack: () => void;
}

interface Note {
  id: string;
  date: string;
  content: string;
  mood?: string;
}

export function StatsView({ onBack }: StatsViewProps) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      date: '2024-10-13',
      content:
        'Completed all habits today! Meditation in the morning really helped me stay focused throughout the day.',
      mood: '😊',
    },
    {
      id: '2',
      date: '2024-10-12',
      content:
        'Struggled with exercise today but pushed through. Reading session was excellent - finished a chapter.',
      mood: '💪',
    },
  ]);
  const [newNote, setNewNote] = useState('');
  const [selectedMood, setSelectedMood] = useState('😊');
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const stats = [
    { icon: Target, label: 'Total Habits', value: '3', color: 'bg-blue-500' },
    {
      icon: TrendingUp,
      label: 'Best Streak',
      value: '5 days',
      color: 'bg-green-500',
    },
    {
      icon: Calendar,
      label: 'This Week',
      value: '85%',
      color: 'bg-purple-500',
    },
    {
      icon: Award,
      label: 'Total Completed',
      value: '127',
      color: 'bg-orange-500',
    },
  ];

  const weeklyData = [
    { day: 'Mon', completion: 67 },
    { day: 'Tue', completion: 100 },
    { day: 'Wed', completion: 67 },
    { day: 'Thu', completion: 100 },
    { day: 'Fri', completion: 100 },
    { day: 'Sat', completion: 33 },
    { day: 'Sun', completion: 100 },
  ];

  const moods = ['😊', '😔', '😴', '💪', '🎉', '😌', '🔥', '✨'];

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        content: newNote,
        mood: selectedMood,
      };
      setNotes([note, ...notes]);
      setNewNote('');
      toast.success('Note added');
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    toast.success('Note deleted');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  return (
    <div className='flex h-full flex-col bg-gray-50'>
      <StatusBar />

      <div className='border-b border-gray-100 bg-white'>
        <div className='flex items-center gap-4 px-6 py-4'>
          <button
            onClick={onBack}
            className='flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200'
          >
            <ArrowLeft className='h-5 w-5' />
          </button>
          <h1 className='text-[28px] font-semibold'>Stats & Notes</h1>
        </div>
      </div>

      <Tabs defaultValue='stats' className='flex flex-1 flex-col'>
        <div className='border-b border-gray-100 bg-white px-6'>
          <TabsList className='h-auto w-full bg-transparent p-0'>
            <TabsTrigger
              value='stats'
              className='flex-1 rounded-none border-b-2 border-transparent pb-3 data-[state=active]:border-black data-[state=active]:bg-transparent'
            >
              Statistics
            </TabsTrigger>
            <TabsTrigger
              value='notes'
              className='flex-1 rounded-none border-b-2 border-transparent pb-3 data-[state=active]:border-black data-[state=active]:bg-transparent'
            >
              Notes
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value='stats'
          className='mt-0 flex-1 space-y-6 overflow-y-auto p-6'
        >
          {/* Stats Grid */}
          <div className='grid grid-cols-2 gap-4'>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className='rounded-2xl border border-gray-100 bg-white p-4 shadow-sm'
                >
                  <div
                    className={`h-10 w-10 rounded-full ${stat.color} mb-3 flex items-center justify-center`}
                  >
                    <Icon className='h-5 w-5 text-white' />
                  </div>
                  <div className='mb-1 text-2xl font-bold'>{stat.value}</div>
                  <div className='text-sm text-gray-600'>{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Weekly Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm'
          >
            <h3 className='mb-4 text-lg font-semibold'>This Week's Progress</h3>
            <div className='flex h-40 items-end justify-between gap-2'>
              {weeklyData.map((day, index) => (
                <div
                  key={day.day}
                  className='flex flex-1 flex-col items-center gap-2'
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${day.completion}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className='w-full rounded-t-lg bg-gradient-to-t from-green-500 to-green-400'
                    style={{ minHeight: '8px' }}
                  />
                  <span className='text-xs text-gray-600'>{day.day}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className='rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-5 text-white shadow-sm'
          >
            <h3 className='mb-2 text-lg font-semibold'>🎉 Great Progress!</h3>
            <p className='text-sm opacity-90'>
              You're on a 5-day streak with Meditation. Keep up the amazing
              work!
            </p>
          </motion.div>
        </TabsContent>

        <TabsContent
          value='notes'
          className='mt-0 flex-1 space-y-4 overflow-y-auto p-6'
        >
          {/* Add Note Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm'
          >
            <h3 className='mb-4 text-lg font-semibold'>Add Today's Note</h3>

            {/* Mood Selector */}
            <div className='mb-4'>
              <label className='mb-2 block text-sm text-gray-600'>
                How are you feeling?
              </label>
              <div className='flex flex-wrap gap-2'>
                {moods.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`rounded-lg border-2 p-2 text-2xl transition-all ${selectedMood === mood ? 'scale-110 border-black bg-gray-100' : 'border-gray-200 hover:border-gray-300'} `}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder='Write about your day, how your habits went, or any reflections...'
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className='mb-4 min-h-[100px] resize-none'
            />

            <Button
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              className='w-full'
            >
              <Plus className='mr-2 h-4 w-4' />
              Add Note
            </Button>
          </motion.div>

          {/* Notes List */}
          <div className='space-y-3'>
            <AnimatePresence mode='popLayout'>
              {notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm'
                >
                  <div className='mb-3 flex items-start justify-between'>
                    <div className='flex items-center gap-2'>
                      <span className='text-2xl'>{note.mood}</span>
                      <div>
                        <div className='text-sm font-semibold'>
                          {formatDate(note.date)}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {new Date(note.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                          })}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className='text-gray-400 transition-colors hover:text-red-500'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                  <p className='text-sm leading-relaxed text-gray-700'>
                    {note.content}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>

            {notes.length === 0 && (
              <div className='py-12 text-center text-gray-400'>
                <p>No notes yet. Start journaling about your habits!</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
