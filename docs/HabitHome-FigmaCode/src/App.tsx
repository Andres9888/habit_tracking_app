import { useState } from 'react';
import { HabitTracker } from './components/HabitTracker';
import { StatsView } from './components/StatsView';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [view, setView] = useState<'tracker' | 'stats'>('tracker');

  return (
    <div className='flex size-full items-center justify-center bg-gray-50'>
      <div className='h-full w-full max-w-md bg-white'>
        {view === 'tracker' ? (
          <HabitTracker onViewStats={() => setView('stats')} />
        ) : (
          <StatsView onBack={() => setView('tracker')} />
        )}
      </div>
      <Toaster />
    </div>
  );
}
