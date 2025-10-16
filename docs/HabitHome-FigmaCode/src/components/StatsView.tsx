import { useState } from 'react';
import { ArrowLeft, TrendingUp, Target, Calendar, Award, Plus, Edit2, Trash2 } from 'lucide-react';
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
      content: 'Completed all habits today! Meditation in the morning really helped me stay focused throughout the day.',
      mood: '😊',
    },
    {
      id: '2',
      date: '2024-10-12',
      content: 'Struggled with exercise today but pushed through. Reading session was excellent - finished a chapter.',
      mood: '💪',
    },
  ]);
  const [newNote, setNewNote] = useState('');
  const [selectedMood, setSelectedMood] = useState('😊');
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const stats = [
    { icon: Target, label: 'Total Habits', value: '3', color: 'bg-blue-500' },
    { icon: TrendingUp, label: 'Best Streak', value: '5 days', color: 'bg-green-500' },
    { icon: Calendar, label: 'This Week', value: '85%', color: 'bg-purple-500' },
    { icon: Award, label: 'Total Completed', value: '127', color: 'bg-orange-500' },
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
    setNotes(notes.filter(n => n.id !== id));
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
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <StatusBar />
      
      <div className="bg-white border-b border-gray-100">
        <div className="flex items-center gap-4 px-6 py-4">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[28px] font-semibold">Stats & Notes</h1>
        </div>
      </div>

      <Tabs defaultValue="stats" className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-100 px-6">
          <TabsList className="w-full bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="stats" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent pb-3"
            >
              Statistics
            </TabsTrigger>
            <TabsTrigger 
              value="notes"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent pb-3"
            >
              Notes
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="stats" className="flex-1 overflow-y-auto p-6 space-y-6 mt-0">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Weekly Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold mb-4">This Week's Progress</h3>
            <div className="flex items-end justify-between gap-2 h-40">
              {weeklyData.map((day, index) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${day.completion}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg"
                    style={{ minHeight: '8px' }}
                  />
                  <span className="text-xs text-gray-600">{day.day}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-5 text-white shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-2">🎉 Great Progress!</h3>
            <p className="text-sm opacity-90">
              You're on a 5-day streak with Meditation. Keep up the amazing work!
            </p>
          </motion.div>
        </TabsContent>

        <TabsContent value="notes" className="flex-1 overflow-y-auto p-6 space-y-4 mt-0">
          {/* Add Note Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold mb-4">Add Today's Note</h3>
            
            {/* Mood Selector */}
            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-2 block">How are you feeling?</label>
              <div className="flex gap-2 flex-wrap">
                {moods.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`
                      text-2xl p-2 rounded-lg border-2 transition-all
                      ${selectedMood === mood ? 'border-black bg-gray-100 scale-110' : 'border-gray-200 hover:border-gray-300'}
                    `}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Write about your day, how your habits went, or any reflections..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[100px] mb-4 resize-none"
            />
            
            <Button 
              onClick={handleAddNote} 
              disabled={!newNote.trim()}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </motion.div>

          {/* Notes List */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{note.mood}</span>
                      <div>
                        <div className="text-sm font-semibold">{formatDate(note.date)}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(note.date).toLocaleDateString('en-US', { weekday: 'long' })}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{note.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>

            {notes.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p>No notes yet. Start journaling about your habits!</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
