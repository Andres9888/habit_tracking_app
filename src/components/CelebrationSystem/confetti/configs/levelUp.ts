import type { BurstConfig } from '../types';
import { colors } from '@/theme/colors';

export const LEVEL_UP_CONFIG: BurstConfig = {
  particleCount: 35,
  duration: 2200,
  colors: [
    '#8B5CF6',
    colors.premium[400],
    colors.premium[600],
    colors.premium[700],
    '#A78BFA',
    '#C4B5FD',
    '#7C3AED',
  ],
  darkColors: [
    '#A78BFA',
    '#C4B5FD',
    '#8B5CF6',
    '#7B52C4',
    '#A78BFA',
    '#C4B5FD',
    '#8B5CF6',
  ],
  physics: {
    drag: 0.98,
    gravity: 200,
    rotation: { velocity: [-240, 240] },
    velocity: { x: [-200, 200], y: [-400, -250] },
    wind: 10,
  },
  hapticPattern: 'celebration',
  soundType: 'success',
  emissionDelay: 12,
};
