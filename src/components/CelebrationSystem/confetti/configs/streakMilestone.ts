import type { BurstConfig } from '../types';
import { colors } from '@/theme/colors';

export const STREAK_MILESTONE_CONFIG: BurstConfig = {
  particleCount: 40,
  duration: 2500,
  colors: [
    '#FBBF24',
    '#F59E0B',
    colors.streak[300],
    colors.streak[500],
    colors.streak[700],
    colors.streak[100],
    '#FCD34D',
  ],
  darkColors: [
    '#FBBF24',
    '#F59E0B',
    '#E8B94D',
    '#FCD34D',
    '#FEF3CD',
    '#FBBF24',
    '#F59E0B',
  ],
  physics: {
    drag: 0.985,
    gravity: 250,
    rotation: { velocity: [-200, 200] },
    velocity: { x: [-150, 150], y: [-350, -200] },
    wind: -30,
  },
  hapticPattern: 'streak',
  soundType: 'chime',
  emissionDelay: 10,
};
