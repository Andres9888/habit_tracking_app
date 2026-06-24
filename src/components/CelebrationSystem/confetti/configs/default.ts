import type { BurstConfig, ConfettiPhysics } from '../types';
import { colors } from '@/theme/colors';

const DEFAULT_PHYSICS: ConfettiPhysics = {
  drag: 0.99,
  gravity: 200,
  rotation: { velocity: [-180, 180] },
  velocity: { x: [-100, 100], y: [-300, -150] },
  wind: 0,
};

export const DEFAULT_CONFIG: BurstConfig = {
  particleCount: 15,
  duration: 1500,
  colors: [
    colors.primary[500],
    colors.primary[400],
    colors.primary[300],
    colors.primary[100],
  ],
  darkColors: ['#34D399', '#6EE7B7', '#A7F3D0', '#10B981'],
  physics: DEFAULT_PHYSICS,
  hapticPattern: 'tap',
  soundType: 'pop',
};
