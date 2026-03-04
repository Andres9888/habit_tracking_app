import type { BurstConfig } from '../types';
import { colors } from '@/theme/colors';

export const CHAIN_COMPLETION_CONFIG: BurstConfig = {
  particleCount: 25,
  duration: 2000,
  colors: [
    colors.primary[500],
    colors.primary[400],
    colors.primary[300],
    colors.primary[100],
    colors.primary[600],
    colors.primary[700],
  ],
  darkColors: [
    '#34D399',
    '#6EE7B7',
    '#A7F3D0',
    '#10B981',
    '#6EE7B7',
    '#34D399',
  ],
  physics: {
    drag: 0.99,
    gravity: 150,
    rotation: { velocity: [-120, 120] },
    velocity: { x: [-80, 80], y: [-250, -120] },
    wind: 20,
  },
  hapticPattern: 'success',
  soundType: 'pop',
  emissionDelay: 15,
};
