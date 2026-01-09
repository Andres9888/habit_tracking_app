import type {
  HabitSuggestion,
  TemplatePreview,
} from './HabitsEmptyState.types';

export const MORNING_HABITS: HabitSuggestion[] = [
  {
    duration: '~5 min',
    emoji: '💪',
    fullName: '💪 Morning Boost',
    name: 'Morning Boost',
    timeHint: 'Perfect for now',
  },
  {
    duration: '~2 min',
    emoji: '🍋',
    fullName: '🍋 Hydrate First',
    name: 'Hydrate First',
    timeHint: 'Start fresh',
  },
  {
    duration: '~3 min',
    emoji: '🧘',
    fullName: '🧘 Mindful Minute',
    name: 'Mindful Minute',
    timeHint: 'Set your intention',
  },
  {
    duration: '~10 min',
    emoji: '📝',
    fullName: '📝 Morning Pages',
    name: 'Morning Pages',
    timeHint: 'Clear your mind',
  },
];

export const AFTERNOON_HABITS: HabitSuggestion[] = [
  {
    duration: '~8 min',
    emoji: '🚶',
    fullName: '🚶 Walk Break',
    name: 'Walk Break',
    timeHint: 'Recharge now',
  },
  {
    duration: '~10 min',
    emoji: '📚',
    fullName: '📚 Read 10 Min',
    name: 'Read 10 Min',
    timeHint: 'Afternoon wisdom',
  },
  {
    duration: '~1 min',
    emoji: '💧',
    fullName: '💧 Hydrate Check',
    name: 'Hydrate Check',
    timeHint: 'Stay sharp',
  },
  {
    duration: '~5 min',
    emoji: '🧘',
    fullName: '🧘 Desk Stretch',
    name: 'Desk Stretch',
    timeHint: 'Release tension',
  },
];

export const EVENING_HABITS: HabitSuggestion[] = [
  {
    duration: '~5 min',
    emoji: '📝',
    fullName: '📝 Daily Gratitude',
    name: 'Daily Gratitude',
    timeHint: 'End on a high',
  },
  {
    duration: '~10 min',
    emoji: '🧘',
    fullName: '🧘 Wind Down',
    name: 'Wind Down',
    timeHint: 'Prepare for rest',
  },
  {
    duration: '~30 min',
    emoji: '📵',
    fullName: '📵 Screen Break',
    name: 'Screen Break',
    timeHint: 'Better sleep',
  },
  {
    duration: '~15 min',
    emoji: '📚',
    fullName: '📚 Bedtime Read',
    name: 'Bedtime Read',
    timeHint: 'Unwind gently',
  },
];

export const ALL_HABITS: HabitSuggestion[] = [
  ...MORNING_HABITS,
  ...AFTERNOON_HABITS,
  ...EVENING_HABITS,
];

export const TEMPLATE_PREVIEWS: TemplatePreview[] = [
  { tagline: 'Prime your AM energy', title: 'Morning Momentum' },
  { tagline: 'Deep work ritual', title: 'Focus Flow' },
];

export const COLORS = {
  accent: {
    amber: '#d97706',
    amberLight: '#fef3c7',
    indigo: '#4f46e5',
    indigoLight: '#e0e7ff',
    purple: '#7c3aed',
    purpleLight: '#ede9fe',
  },
  border: {
    light: '#e7e5e4',
    medium: '#d6d3d1',
  },
  surface: {
    primary: '#ffffff',
    secondary: '#fafaf9',
    warm: '#fffbeb',
  },
  text: {
    muted: '#a8a29e',
    primary: '#1c1917',
    secondary: '#57534e',
    tertiary: '#78716c',
  },
} as const;

export const BASE_CARD_CLASS =
  'w-full rounded-2xl border border-stone-200 bg-white px-5 py-5';
