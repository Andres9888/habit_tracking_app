import { colors } from '@/theme/colors';
import type { QuickPickTemplate } from './types';

export const QUICK_PICK_TEMPLATES: QuickPickTemplate[] = [
  {
    color: '#8B5CF6',
    emoji: '🧘',
    id: 'meditate',
    name: 'Meditate', // Purple
    timeOfDay: 'phase1_push',
  },
  {
    color: colors.secondary[500],
    emoji: '📖',
    id: 'read',
    name: 'Read', // Blue
    timeOfDay: 'phase3_pull',
  },
  {
    color: '#22C55E',
    emoji: '💪',
    id: 'exercise',
    name: 'Exercise', // Green
    timeOfDay: 'phase1_push',
  },
  {
    color: '#06B6D4',
    emoji: '💧',
    id: 'hydrate',
    name: 'Hydrate', // Cyan
    timeOfDay: 'phase1_push',
  },
  {
    color: '#F97316',
    emoji: '✍️',
    id: 'journal',
    name: 'Journal', // Orange
    timeOfDay: 'phase3_pull',
  },
];
