/**
 * Strength Levels Constants
 *
 * Level threshold configuration for habit strength display.
 */

import type { LevelThreshold } from './data.types';
import { colors } from '@/theme/colors';

export const STRENGTH_LEVELS: LevelThreshold[] = [
  {
    bgColor: colors.strength.startingLight,
    color: colors.strength.starting,
    description: 'Just getting started',
    emoji: '🌱',
    label: 'Starting Out',
    max: 20,
    min: 0,
  },
  {
    bgColor: colors.strength.buildingLight,
    color: colors.strength.building,
    description: 'Building momentum',
    emoji: '🌿',
    label: 'Building',
    max: 40,
    min: 20,
  },
  {
    bgColor: colors.primary[100],
    color: colors.primary[600],
    description: 'Habit is taking root',
    emoji: '🌳',
    label: 'Growing',
    max: 60,
    min: 40,
  },
  {
    bgColor: colors.strength.strongLight,
    color: colors.strength.strong,
    description: 'Solid consistency',
    emoji: '💪',
    label: 'Strong',
    max: 80,
    min: 60,
  },
  {
    bgColor: '#ede9fe',
    color: '#7c3aed',
    description: 'Habit mastery achieved',
    emoji: '⚡',
    label: 'Unbreakable',
    max: 101,
    min: 80,
  },
];
