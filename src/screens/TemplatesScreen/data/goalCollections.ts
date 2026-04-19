/**
 * Goal-based collections for guided habit discovery
 * Maps user transformation intents to curated cross-category template sets
 */

export interface GoalCollection {
  id: string;
  emoji: string;
  label: string;
  description: string;
  promise: string;
  categories: string[];
  bgColor: string;
  textColor: string;
  darkBgColor: string;
  darkTextColor: string;
}

export const GOAL_COLLECTIONS: GoalCollection[] = [
  {
    id: 'more-energy',
    emoji: '⚡',
    label: 'Wake up energized',
    description: 'Morning routines & physical vitality',
    promise: 'Build a morning routine that gives you steady energy until evening',
    categories: ['morning_routine', 'health_fitness'],
    bgColor: '#FEF3C7',
    textColor: '#78350F',
    darkBgColor: 'rgba(245,158,11,0.15)',
    darkTextColor: '#FDE68A',
  },
  {
    id: 'sleep-better',
    emoji: '😴',
    label: 'Sleep deeper',
    description: 'Wind down, rest deeper, wake refreshed',
    promise: 'Wind down, rest fully, wake refreshed',
    categories: ['sleep', 'recovery', 'breathing'],
    bgColor: '#EFF6FF',
    textColor: '#1E3A5F',
    darkBgColor: 'rgba(59,130,246,0.15)',
    darkTextColor: '#93C5FD',
  },
  {
    id: 'less-stress',
    emoji: '🧘',
    label: 'Stress less',
    description: 'Calm your mind & regulate your system',
    promise: 'Calm your mind, regulate your system',
    categories: ['mindfulness', 'breathing', 'mental_health'],
    bgColor: '#F0FDF4',
    textColor: '#14532D',
    darkBgColor: 'rgba(5,150,105,0.15)',
    darkTextColor: '#6EE7B7',
  },
  {
    id: 'be-productive',
    emoji: '🎯',
    label: 'Focus deeper',
    description: 'Focus deeper & build knowledge',
    promise: 'Build knowledge, beat distraction',
    categories: ['productivity', 'learning'],
    bgColor: '#FAF5FF',
    textColor: '#581C87',
    darkBgColor: 'rgba(139,92,246,0.15)',
    darkTextColor: '#C4B5FD',
  },
  {
    id: 'get-healthier',
    emoji: '💪',
    label: 'Get healthier',
    description: 'Lasting physical habits for a longer life',
    promise: 'Lasting habits for a longer life',
    categories: ['health_fitness', 'longevity'],
    bgColor: '#FFF1F2',
    textColor: '#881337',
    darkBgColor: 'rgba(244,63,94,0.15)',
    darkTextColor: '#FDA4AF',
  },
];

/** Returns the goal id that should be featured based on time of day. */
export function getFeaturedGoalId(now: Date = new Date()): string {
  const hour = now.getHours();
  if (hour >= 5 && hour < 12) return 'more-energy';
  if (hour >= 12 && hour < 17) return 'be-productive';
  if (hour >= 17 && hour < 22) return 'less-stress';
  return 'sleep-better';
}
