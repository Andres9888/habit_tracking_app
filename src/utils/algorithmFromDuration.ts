import type { AlgorithmMode } from '../components/AlgorithmPicker/algorithmCopy';

const SIMPLE_MAX_MINUTES = 2;
const AVERAGE_MAX_MINUTES = 20;

export function algorithmForMinutes(minutes: number): AlgorithmMode {
  if (minutes <= SIMPLE_MAX_MINUTES) return 'forgiving';
  if (minutes <= AVERAGE_MAX_MINUTES) return 'balanced';
  return 'strict';
}
