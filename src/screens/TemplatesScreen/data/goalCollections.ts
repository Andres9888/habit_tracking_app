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
  },
  {
    id: 'more-energy',
    emoji: '⚡',
    label: 'More Energy',
    description: 'Morning routines & physical vitality',
    categories: ['morning_routine', 'health_fitness'],
    bgColor: '#FEF3C7',
    textColor: '#78350F',
  },
  {
    id: 'less-stress',
    emoji: '🧘',
    label: 'Less Stress',
    description: 'Calm your mind & regulate your system',
    categories: ['mindfulness', 'breathing', 'mental_health'],
    bgColor: '#F0FDF4',
    textColor: '#14532D',
  },
  {
    id: 'be-productive',
    emoji: '🎯',
    label: 'Be Productive',
    description: 'Focus deeper & build knowledge',
    categories: ['productivity', 'learning'],
    bgColor: '#FAF5FF',
    textColor: '#581C87',
  },
  {
    id: 'get-healthier',
    emoji: '💪',
    label: 'Get Healthier',
    description: 'Lasting physical habits for a longer life',
    categories: ['health_fitness', 'longevity'],
    bgColor: '#FFF1F2',
    textColor: '#881337',
  },
];
