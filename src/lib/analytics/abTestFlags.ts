/**
 * A/B Test Flag System
 *
 * Simple, deterministic A/B test assignment persisted via AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXPERIMENTS } from './experiments';

export { EXPERIMENTS, type Experiment } from './experiments';

const STORAGE_KEY = '@ab_test_assignments';
let _assignments: Record<string, string> = {};

export async function loadABAssignments(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) _assignments = JSON.parse(raw) as Record<string, string>;
  } catch {
    if (__DEV__) console.warn('[ABTest] Failed to load assignments');
  }
}

async function persist(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(_assignments));
  } catch {
    if (__DEV__) console.warn('[ABTest] Failed to persist assignments');
  }
}

export function getABVariant(experimentKey: string): string {
  const exp = EXPERIMENTS[experimentKey];
  if (!exp?.active || exp.variants.length === 0) return 'control';

  if (
    _assignments[experimentKey] &&
    exp.variants.includes(_assignments[experimentKey])
  ) {
    return _assignments[experimentKey];
  }

  const variant = exp.variants[Math.floor(Math.random() * exp.variants.length)];
  _assignments[experimentKey] = variant;
  void persist();
  if (__DEV__) console.warn(`[ABTest] Assigned ${experimentKey} → ${variant}`);
  return variant;
}

export function getAllAssignments(): Readonly<Record<string, string>> {
  return { ..._assignments };
}

export function overrideVariant(experimentKey: string, variant: string): void {
  _assignments[experimentKey] = variant;
  void persist();
}

export async function resetAllAssignments(): Promise<void> {
  _assignments = {};
  await AsyncStorage.removeItem(STORAGE_KEY);
}
