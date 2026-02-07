import { colors } from '@/theme/colors';

export interface SuggestionItem {
  emoji: string | null;
  name: string;
  color: string;
}

export const SUGGESTIONS: SuggestionItem[] = [
  // Health & Fitness
  { color: '#60a5fa', emoji: '💧', name: 'Drink water' },
  { color: '#10b981', emoji: '🚶', name: 'Walk 15 minutes' },
  { color: '#22c55e', emoji: '🏃', name: 'Run 20 minutes' },
  { color: '#14b8a6', emoji: '💪', name: 'Workout 30 minutes' },
  { color: '#a78bfa', emoji: '🧘', name: 'Meditate 5 minutes' },
  { color: '#06b6d4', emoji: '🚴', name: 'Bike ride' },
  { color: '#8b5cf6', emoji: '🤸', name: 'Stretch 10 minutes' },
  { color: '#6366f1', emoji: '😴', name: 'Sleep 8 hours' },
  { color: '#f59e0b', emoji: '🌅', name: 'Wake up early' },

  // Nutrition
  { color: '#ef4444', emoji: '🍎', name: 'Eat a healthy snack' },
  { color: '#84cc16', emoji: '🥗', name: 'Eat vegetables' },
  { color: '#fb923c', emoji: '🍊', name: 'Take vitamins' },
  { color: '#78716c', emoji: '☕', name: 'No coffee after 2pm' },
  { color: '#78716c', emoji: '🥤', name: 'No soda today' },

  // Mental & Learning
  { color: '#f59e0b', emoji: '📖', name: 'Read 10 minutes' },
  { color: '#f97316', emoji: '📝', name: 'Journal 3 lines' },
  { color: '#ec4899', emoji: '🙏', name: 'Practice gratitude' },
  { color: colors.secondary[500], emoji: '🧠', name: 'Learn something new' },
  { color: '#eab308', emoji: '📚', name: 'Study 30 minutes' },
  { color: '#a855f7', emoji: '✍️', name: 'Write 100 words' },

  // Productivity & Focus
  { color: '#78716c', emoji: '📱', name: 'No phone for 1 hour' },
  { color: '#dc2626', emoji: '🎯', name: 'Complete daily goal' },
  { color: '#0891b2', emoji: '📅', name: 'Plan tomorrow' },
  { color: '#06b6d4', emoji: '🧹', name: 'Clean for 10 minutes' },
  { color: '#10b981', emoji: '✅', name: 'Make my bed' },
  { color: '#7c3aed', emoji: '⏰', name: 'Time block work' },

  // Social & Creative
  { color: '#f472b6', emoji: '👨‍👩‍👧‍👦', name: 'Call family' },
  { color: '#fb7185', emoji: '💌', name: 'Text a friend' },
  { color: '#ec4899', emoji: '🎨', name: 'Creative time' },
  { color: '#a855f7', emoji: '🎸', name: 'Practice instrument' },
  { color: '#6366f1', emoji: '📷', name: 'Take a photo' },
  { color: '#22c55e', emoji: '🌱', name: 'Tend to plants' },
];
