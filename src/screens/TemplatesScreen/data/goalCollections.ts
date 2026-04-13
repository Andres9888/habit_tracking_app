/**
 * Goal-based collections for guided habit discovery
 * Maps user intents to curated cross-category template sets
 */

export interface GoalCollection {
  id: string;
  emoji: string;
  label: string;
  description: string;
  categories: string[];
  bgColor: string;
  textColor: string;
  darkBgColor: string;
  darkTextColor: string;
}

export const GOAL_COLLECTIONS: GoalCollection[] = [
  {
    id: 'sleep-better',
    emoji: '😴',
    label: 'Sleep Better',
    description: 'Wind down, rest deeper, wake refreshed',
    categories: ['sleep', 'recovery', 'breathing'],
    bgColor: '#EFF6FF',
    textColor: '#1E3A5F',
    darkBgColor: 'rgba(59,130,246,0.15)',
    darkTextColor: '#93C5FD',
  },
  {
    id: 'more-energy',
    emoji: '⚡',
    label: 'More Energy',
    description: 'Morning routines & physical vitality',
    categories: ['morning_routine', 'health_fitness'],
    bgColor: '#FEF3C7',
    textColor: '#78350F',
    darkBgColor: 'rgba(245,158,11,0.15)',
    darkTextColor: '#FDE68A',
  },
  {
    id: 'less-stress',
    emoji: '🧘',
    label: 'Less Stress',
    description: 'Calm your mind & regulate your system',
    categories: ['mindfulness', 'breathing', 'mental_health'],
    bgColor: '#F0FDF4',
    textColor: '#14532D',
    darkBgColor: 'rgba(5,150,105,0.15)',
    darkTextColor: '#6EE7B7',
  },
  {
    id: 'be-productive',
    emoji: '🎯',
    label: 'Be Productive',
    description: 'Focus deeper & build knowledge',
    categories: ['productivity', 'learning'],
    bgColor: '#FAF5FF',
    textColor: '#581C87',
    darkBgColor: 'rgba(139,92,246,0.15)',
    darkTextColor: '#C4B5FD',
  },
  {
    id: 'get-healthier',
    emoji: '💪',
    label: 'Get Healthier',
    description: 'Lasting physical habits for a longer life',
    categories: ['health_fitness', 'longevity'],
    bgColor: '#FFF1F2',
    textColor: '#881337',
    darkBgColor: 'rgba(244,63,94,0.15)',
    darkTextColor: '#FDA4AF',
  },
];
