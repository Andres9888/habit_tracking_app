/**
 * TodaysFocusCard Constants
 *
 * Animation timings, colors, and focus state configurations.
 */

import {
  CheckCircle2,
  Crosshair,
  Heart,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Trophy,
} from 'lucide-react-native';

import type { FocusState, FocusStateConfig } from '../TodaysFocusCardTypes';

/** Animation timing constants */
export const ENTRANCE_DURATION = 300;
export const SHIMMER_DURATION = 2500;
export const NUMBER_COUNT_DURATION = 800;
export const CONFETTI_DURATION = 700;
export const CONFETTI_PARTICLE_COUNT = 16;

/**
 * Confetti colors - celebratory gold/amber theme with accent colors
 */
export const CONFETTI_COLORS = [
  '#F59E0B', // Amber 500 (primary celebration)
  '#FBBF24', // Amber 400
  '#FCD34D', // Amber 300
  '#D97706', // Amber 600
  '#10B981', // Emerald 500 (success accent)
  '#34D399', // Emerald 400
];

/**
 * Focus state configurations
 * Each state has specific gradient colors, icon, and messaging
 */
export const FOCUS_STATE_CONFIGS: Record<FocusState, FocusStateConfig> = {
  building: {
    getGoalLabel: () => '7 days',
    getMessage: (streak: number) => `${streak} days strong - keep going!`,
    gradientColors: ['#14b8a6', '#06b6d4'], // teal-500 → cyan-500
    icon: TrendingUp,
    iconColor: '#ffffff',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    textColor: '#ffffff',
  },
  celebrating: {
    getGoalLabel: () => 'next',
    getMessage: (milestone: number) => `🎉 You hit ${milestone} days!`,
    gradientColors: ['#F59E0B', '#D97706'], // amber-500 → amber-600
    icon: Trophy,
    iconColor: '#ffffff',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    textColor: '#ffffff',
  },
  completed: {
    getGoalLabel: () => '🔥',
    getMessage: (streak: number) => `${streak} day streak and counting!`,
    gradientColors: ['#22c55e', '#10b981'], // green-500 → success
    icon: CheckCircle2,
    iconColor: '#ffffff',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    textColor: '#ffffff',
  },
  recovering: {
    getGoalLabel: () => 'best streak',
    getMessage: (bestStreak: number) =>
      `You've done ${bestStreak} before. Do it again!`,
    gradientColors: ['#8b5cf6', '#a855f7'], // violet-500 → purple-500
    icon: RefreshCw,
    iconColor: '#ffffff',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    textColor: '#ffffff',
  },
  starting: {
    getGoalLabel: () => '3 days',
    getMessage: () => '3 days unlocks momentum!',
    gradientColors: ['#3b82f6', '#6366f1'], // blue-500 → indigo-500
    icon: Sparkles,
    iconColor: '#ffffff',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    textColor: '#ffffff',
  },
  struggling: {
    getGoalLabel: () => '1 day',
    getMessage: () => 'Every day is a fresh start!',
    gradientColors: ['#f59e0b', '#f97316'], // amber-500 → orange-500
    icon: Heart,
    iconColor: '#ffffff',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    textColor: '#ffffff',
  },
  thriving: {
    getGoalLabel: () => 'next milestone',
    getMessage: (goal: number) => `Complete today to hit ${goal} days!`,
    gradientColors: ['#10b981', '#14b8a6'], // success → teal-500
    icon: Crosshair,
    iconColor: '#ffffff',
    subTextColor: 'rgba(255, 255, 255, 0.9)',
    textColor: '#ffffff',
  },
};
