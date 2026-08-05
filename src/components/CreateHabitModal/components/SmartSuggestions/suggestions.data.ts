import { colors } from '@/theme/colors';
import type { Suggestion } from './types';

/**
 * Curated list of habit suggestions for quick selection.
 * Each suggestion includes keywords for search matching.
 */
export const SUGGESTIONS: Suggestion[] = [
  // Health & Fitness
  {
    color: '#60a5fa',
    emoji: '💧',
    keywords: ['water', 'drink', 'hydrate'],
    name: 'Drink water',
  },
  {
    color: '#10b981',
    emoji: '🚶',
    keywords: ['walk', 'steps', 'outside'],
    name: 'Walk 15 minutes',
  },
  {
    color: '#22c55e',
    emoji: '🏃',
    keywords: ['run', 'jog', 'cardio'],
    name: 'Run 20 minutes',
  },
  {
    color: '#14b8a6',
    emoji: '💪',
    keywords: ['workout', 'gym', 'exercise', 'lift'],
    name: 'Workout 30 minutes',
  },
  {
    color: '#a78bfa',
    emoji: '🧘',
    keywords: ['meditate', 'mindful', 'calm', 'breathe'],
    name: 'Meditate 5 minutes',
  },
  {
    color: '#06b6d4',
    emoji: '🚴',
    keywords: ['bike', 'cycle', 'cycling'],
    name: 'Bike ride',
  },
  {
    color: '#8b5cf6',
    emoji: '🤸',
    keywords: ['stretch', 'yoga', 'flexible'],
    name: 'Stretch 10 minutes',
  },
  {
    color: '#6366f1',
    emoji: '😴',
    keywords: ['sleep', 'rest', 'bed'],
    name: 'Sleep 8 hours',
  },
  {
    color: '#f59e0b',
    emoji: '🌅',
    keywords: ['wake', 'morning', 'early'],
    name: 'Wake up early',
  },

  // Nutrition
  {
    color: '#ef4444',
    emoji: '🍎',
    keywords: ['healthy', 'snack', 'fruit'],
    name: 'Eat a healthy snack',
  },
  {
    color: '#84cc16',
    emoji: '🥗',
    keywords: ['vegetable', 'salad', 'greens'],
    name: 'Eat vegetables',
  },
  {
    color: '#fb923c',
    emoji: '🍊',
    keywords: ['vitamin', 'supplement'],
    name: 'Take vitamins',
  },
  {
    color: '#78716c',
    emoji: '☕',
    keywords: ['coffee', 'caffeine'],
    name: 'No coffee after 2pm',
  },
  {
    color: '#78716c',
    emoji: '🥤',
    keywords: ['soda', 'sugar', 'drink'],
    name: 'No soda today',
  },

  // Mental & Learning
  {
    color: '#f59e0b',
    emoji: '📖',
    keywords: ['read', 'book', 'reading'],
    name: 'Read 10 minutes',
  },
  {
    color: '#f97316',
    emoji: '📝',
    keywords: ['journal', 'write', 'diary'],
    name: 'Journal 3 lines',
  },
  {
    color: '#ec4899',
    emoji: '🙏',
    keywords: ['gratitude', 'grateful', 'thankful'],
    name: 'Practice gratitude',
  },
  {
    color: colors.secondary[500],
    emoji: '🧠',
    keywords: ['learn', 'study', 'knowledge'],
    name: 'Learn something new',
  },
  {
    color: '#eab308',
    emoji: '📚',
    keywords: ['study', 'school', 'course'],
    name: 'Study 30 minutes',
  },
  {
    color: '#a855f7',
    emoji: '✍️',
    keywords: ['write', 'writing', 'words'],
    name: 'Write 100 words',
  },

  // Productivity & Focus
  {
    color: '#78716c',
    emoji: '📱',
    keywords: ['phone', 'screen', 'digital', 'detox'],
    name: 'No phone for 1 hour',
  },
  {
    color: '#dc2626',
    emoji: '🎯',
    keywords: ['goal', 'task', 'complete'],
    name: 'Complete daily goal',
  },
  {
    color: '#0891b2',
    emoji: '📅',
    keywords: ['plan', 'tomorrow', 'schedule'],
    name: 'Plan tomorrow',
  },
  {
    color: '#06b6d4',
    emoji: '🧹',
    keywords: ['clean', 'tidy', 'organize'],
    name: 'Clean for 10 minutes',
  },
  {
    color: '#10b981',
    emoji: '✅',
    keywords: ['bed', 'make', 'morning'],
    name: 'Make my bed',
  },
  {
    color: '#7c3aed',
    emoji: '⏰',
    keywords: ['time', 'block', 'focus'],
    name: 'Time block work',
  },

  // Social & Creative
  {
    color: '#f472b6',
    emoji: '👨‍👩‍👧‍👦',
    keywords: ['family', 'call', 'parents'],
    name: 'Call family',
  },
  {
    color: '#fb7185',
    emoji: '💌',
    keywords: ['friend', 'text', 'message'],
    name: 'Text a friend',
  },
  {
    color: '#ec4899',
    emoji: '🎨',
    keywords: ['creative', 'art', 'draw'],
    name: 'Creative time',
  },
  {
    color: '#a855f7',
    emoji: '🎸',
    keywords: ['instrument', 'music', 'practice', 'guitar', 'piano'],
    name: 'Practice instrument',
  },
  {
    color: '#6366f1',
    emoji: '📷',
    keywords: ['photo', 'picture', 'camera'],
    name: 'Take a photo',
  },
  {
    color: '#22c55e',
    emoji: '🌱',
    keywords: ['plant', 'garden', 'water'],
    name: 'Tend to plants',
  },
];
