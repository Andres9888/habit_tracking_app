import type { AlgorithmMode } from '../components/AlgorithmPicker/algorithmCopy';

const QUICK_WIN_MAX_MINUTES = 2;
const TEXTBOOK_MAX_MINUTES = 20;

export function algorithmForMinutes(minutes: number): AlgorithmMode {
  if (minutes <= QUICK_WIN_MAX_MINUTES) return 'forgiving';
  if (minutes <= TEXTBOOK_MAX_MINUTES) return 'balanced';
  return 'strict';
}
