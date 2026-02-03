/**
 * Onboarding Constants
 */

import type { HabitSuggestion, OnboardingStep, ReminderPreset } from './types';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  'welcome',
  'createHabit',
  'chainExplained',
  'reminder',
  'ready',
];

export const HABIT_SUGGESTIONS: HabitSuggestion[] = [
  { id: 'exercise', emoji: '🏃', name: 'Exercise' },
  { id: 'read', emoji: '📚', name: 'Read' },
  { id: 'meditate', emoji: '🧘', name: 'Meditate' },
  { id: 'water', emoji: '💧', name: 'Drink Water' },
];

export const REMINDER_PRESETS: { id: ReminderPreset; label: string; time: string }[] = [
  { id: 'morning', label: 'Morning', time: '08:00' },
  { id: 'afternoon', label: 'Afternoon', time: '14:00' },
  { id: 'evening', label: 'Evening', time: '20:00' },
];

export const MILESTONES = [
  { days: 7, label: 'First Week' },
  { days: 30, label: 'One Month' },
  { days: 100, label: 'Unstoppable' },
];

// Onboarding theme colors (dark mode with purple accent)
export const ONBOARDING_COLORS = {
  background: {
    start: '#0f0f23',
    end: '#1a1a3e',
  },
  accent: {
    primary: '#6366f1', // Indigo
    secondary: '#8b5cf6', // Violet
    light: '#a5b4fc', // Light indigo
  },
  surface: {
    default: 'rgba(255, 255, 255, 0.08)',
    elevated: 'rgba(255, 255, 255, 0.12)',
    border: 'rgba(99, 102, 241, 0.3)',
    borderLight: 'rgba(255, 255, 255, 0.2)',
  },
  text: {
    primary: '#ffffff',
    secondary: '#8b8ba7',
    accent: '#a5b4fc',
  },
  success: '#22c55e',
  successDark: '#16a34a',
};

export const ASYNC_STORAGE_KEYS = {
  ONBOARDING_COMPLETED: '@chainday:onboarding_completed',
  ONBOARDING_DATA: '@chainday:onboarding_data',
};
