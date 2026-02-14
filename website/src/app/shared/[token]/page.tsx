'use client';

/**
 * Shared Dashboard Page
 * Public page showing a user's habit progress
 * Accessed via: /shared/[token]
 * 
 * In production, this would fetch real data from Convex.
 * For demo purposes, this shows a sample dashboard.
 */

import { useParams } from 'next/navigation';
import { Flame, Target, TrendingUp, CheckCircle2, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HabitStats {
  id: string;
  name: string;
  icon?: string;
  iconColor?: string;
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  last7DaysRate: number;
  last30DaysRate: number;
  strengthLevel?: string;
}

interface DashboardData {
  displayName: string;
  enabledAt?: number;
  stats: {
    totalActiveHabits: number;
    totalCurrentStreaks: number;
    avgCompletionRate: number;
  };
  habits: HabitStats[];
}

// Demo data for demonstration
const DEMO_DASHBOARD: DashboardData = {
  displayName: "Alex's Habits",
  stats: {
    totalActiveHabits: 5,
    totalCurrentStreaks: 42,
    avgCompletionRate: 86,
  },
  habits: [
    {
      id: '1',
      name: 'Morning Meditation',
      icon: '🧘',
      iconColor: '#8b5cf6',
      currentStreak: 15,
      bestStreak: 45,
      totalCompletions: 89,
      last7DaysRate: 100,
      last30DaysRate: 93,
      strengthLevel: 'strong',
    },
    {
      id: '2',
      name: 'Read 30 minutes',
      icon: '📚',
      iconColor: '#3b82f6',
      currentStreak: 12,
      bestStreak: 30,
      totalCompletions: 156,
      last7DaysRate: 86,
      last30DaysRate: 77,
      strengthLevel: 'developing',
    },
    {
      id: '3',
      name: 'Workout',
      icon: '💪',
      iconColor: '#f59e0b',
      currentStreak: 8,
      bestStreak: 21,
      totalCompletions: 67,
      last7DaysRate: 71,
      last30DaysRate: 63,
      strengthLevel: 'building',
    },
    {
      id: '4',
      name: 'Drink 8 glasses of water',
      icon: '💧',
      iconColor: '#06b6d4',
      currentStreak: 7,
      bestStreak: 15,
      totalCompletions: 45,
      last7DaysRate: 100,
      last30DaysRate: 90,
      strengthLevel: 'strong',
    },
    {
      id: '5',
      name: 'No social media before noon',
      icon: '📵',
      iconColor: '#ef4444',
      currentStreak: 0,
      bestStreak: 10,
      totalCompletions: 23,
      last7DaysRate: 43,
      last30DaysRate: 33,
      strengthLevel: 'starting',
    },
  ],
};

function getStrengthLabel(level?: string): string {
  switch (level) {
    case 'starting':
      return 'Just starting';
    case 'building':
      return 'Building';
    case 'developing':
      return 'Developing';
    case 'strong':
      return 'Strong';
    case 'automatic':
      return 'Automatic';
    default:
      return 'Unknown';
  }
}

function HabitCard({ habit }: { habit: HabitStats }) {
  return (
    <div className='rounded-xl border border-stone-200 bg-white p-4 shadow-sm'>
      <div className='flex items-center gap-3'>
        {/* Icon */}
        <div
          className='flex h-12 w-12 items-center justify-center rounded-xl text-xl'
          style={{
            backgroundColor: habit.iconColor ? `${habit.iconColor}20` : '#f5f5f4',
          }}
        >
          {habit.icon || '📌'}
        </div>

        {/* Info */}
        <div className='flex-1'>
          <h3 className='font-semibold text-stone-800'>{habit.name}</h3>
          <p className='text-xs text-stone-500'>
            {getStrengthLabel(habit.strengthLevel)}
          </p>
        </div>

        {/* Streak */}
        <div className='text-right'>
          <div className='flex items-center gap-1 text-orange-500'>
            <Flame className='h-4 w-4' />
            <span className='font-bold'>{habit.currentStreak}</span>
          </div>
          <p className='text-xs text-stone-500'>day streak</p>
        </div>
      </div>

      {/* Stats */}
      <div className='mt-3 flex gap-4 text-sm'>
        <div>
          <span className='text-stone-500'>7 days:</span>{' '}
          <span className='font-semibold text-emerald-600'>{habit.last7DaysRate}%</span>
        </div>
        <div>
          <span className='text-stone-500'>30 days:</span>{' '}
          <span className='font-semibold text-emerald-600'>{habit.last30DaysRate}%</span>
        </div>
        <div>
          <span className='text-stone-500'>Best:</span>{' '}
          <span className='font-semibold text-stone-700'>{habit.bestStreak}</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Flame;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className='flex flex-col items-center rounded-xl border border-stone-200 bg-white p-4 shadow-sm'>
      <Icon className={`h-6 w-6 ${color}`} />
      <p className='mt-2 text-2xl font-bold text-stone-800'>{value}</p>
      <p className='text-xs text-stone-500'>{label}</p>
    </div>
  );
}

export default function SharedDashboardPage() {
  const params = useParams();
  const token = params?.token as string;
  const [copied, setCopied] = useState(false);

  // In production, this would fetch real data from Convex
  // For now, we use demo data
  const data = DEMO_DASHBOARD;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-stone-50 to-stone-100'>
      <div className='mx-auto max-w-md px-4 py-8'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <div className='mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700'>
            <CheckCircle2 className='h-3 w-3' />
            Shared Dashboard
          </div>
          <h1 className='text-2xl font-bold text-stone-800'>
            {data.displayName}'s Habits
          </h1>
          <p className='mt-1 text-stone-600'>
            {data.stats.totalActiveHabits} active habit
            {data.stats.totalActiveHabits !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Overall Stats */}
        <div className='mb-6 grid grid-cols-3 gap-3'>
          <StatCard
            icon={Flame}
            label='Total Streaks'
            value={data.stats.totalCurrentStreaks}
            color='text-orange-500'
          />
          <StatCard
            icon={TrendingUp}
            label='Avg Completion'
            value={`${data.stats.avgCompletionRate}%`}
            color='text-emerald-500'
          />
          <StatCard
            icon={Target}
            label='Active Habits'
            value={data.stats.totalActiveHabits}
            color='text-blue-500'
          />
        </div>

        {/* Habits List */}
        <div className='space-y-3'>
          <h2 className='mb-3 text-lg font-semibold text-stone-800'>
            Habit Progress
          </h2>
          {data.habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>

        {/* Share This Page */}
        <div className='mt-8 rounded-xl border border-stone-200 bg-white p-4 shadow-sm'>
          <p className='mb-3 text-sm text-stone-600'>
            Like what you see? Share your own habit progress with friends!
          </p>
          <button
            onClick={handleCopyLink}
            className='flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700'
          >
            <Copy className='h-4 w-4' />
            {copied ? 'Copied!' : 'Copy Link to Share'}
          </button>
        </div>

        {/* Footer */}
        <div className='mt-8 text-center'>
          <p className='text-xs text-stone-500'>
            Powered by{' '}
            <a
              href='https://chainday.app'
              className='font-semibold text-emerald-600 hover:underline'
            >
              Chain Day
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
