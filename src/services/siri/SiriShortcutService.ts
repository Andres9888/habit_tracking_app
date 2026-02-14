/**
 * SiriShortcutService - Manages Siri Shortcuts for habit completion.
 *
 * Enables "Hey Siri, I did my workout" style quick habit logging.
 * Uses react-native-siri-shortcut under the hood.
 */
import { Platform } from 'react-native';
import type { HabitId } from '../../features/habits/types';

/** Shortcut activity type prefix for habit completions */
const ACTIVITY_TYPE_PREFIX = 'com.chainday.app.complete-habit';

/** Build the unique activity type for a habit */
export function buildActivityType(habitId: string): string {
  return `${ACTIVITY_TYPE_PREFIX}.${habitId}`;
}

/** Shortcut options for react-native-siri-shortcut */
export interface ShortcutOptions {
  activityType: string;
  title: string;
  suggestedInvocationPhrase: string;
  userInfo: Record<string, string>;
  isEligibleForSearch: boolean;
  isEligibleForPrediction: boolean;
  needsSave: boolean;
  description?: string;
}

/** Build shortcut options for a habit */
export function buildHabitShortcut(
  habitId: string,
  habitName: string,
  habitEmoji?: string
): ShortcutOptions {
  const emoji = habitEmoji ?? '✅';
  return {
    activityType: buildActivityType(habitId),
    title: `${emoji} Complete "${habitName}"`,
    suggestedInvocationPhrase: `I did my ${habitName.toLowerCase()}`,
    userInfo: { habitId, habitName },
    isEligibleForSearch: true,
    isEligibleForPrediction: true,
    needsSave: true,
    description: `Mark "${habitName}" as done in ChainDay`,
  };
}

/**
 * Lazy-loaded native module reference.
 * Returns null on non-iOS or if the native module isn't available.
 */
function getNativeModule(): typeof import('react-native-siri-shortcut') | null {
  if (Platform.OS !== 'ios') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('react-native-siri-shortcut');
  } catch {
    console.warn('[SiriShortcut] Native module not available');
    return null;
  }
}

/**
 * Donate a habit completion shortcut to Siri.
 * Call this every time a habit is completed so Siri learns the pattern.
 */
export async function donateShortcut(
  habitId: string,
  habitName: string,
  habitEmoji?: string
): Promise<void> {
  const mod = getNativeModule();
  if (!mod) return;

  const opts = buildHabitShortcut(habitId, habitName, habitEmoji);
  try {
    mod.donateShortcut(opts);
  } catch (err) {
    console.warn('[SiriShortcut] Failed to donate shortcut:', err);
  }
}

/**
 * Present the native "Add to Siri" voice shortcut view controller.
 */
export async function presentAddToSiri(
  habitId: string,
  habitName: string,
  habitEmoji?: string
): Promise<void> {
  const mod = getNativeModule();
  if (!mod) return;

  const opts = buildHabitShortcut(habitId, habitName, habitEmoji);
  try {
    mod.presentShortcut(opts, ({ status }: { status: string }) => {
      if (status === 'added' || status === 'updated') {
        console.log(`[SiriShortcut] Shortcut ${status} for ${habitName}`);
      }
    });
  } catch (err) {
    console.warn('[SiriShortcut] Failed to present shortcut:', err);
  }
}

/**
 * Clear donated shortcuts for a specific habit (e.g. when deleted).
 */
export async function clearShortcut(habitId: string): Promise<void> {
  const mod = getNativeModule();
  if (!mod?.clearAllShortcuts) return;

  try {
    // The library provides clearAllShortcuts; for per-activity clearing
    // we'd need native code. For now this is a best-effort approach.
    console.log(`[SiriShortcut] Would clear shortcut for ${habitId}`);
  } catch (err) {
    console.warn('[SiriShortcut] Failed to clear shortcut:', err);
  }
}

/**
 * Suggest shortcuts for all active habits.
 * Call during app startup to populate Siri suggestions.
 */
export function suggestShortcuts(
  habits: Array<{ _id: HabitId; name: string; icon?: string }>
): void {
  const mod = getNativeModule();
  if (!mod?.suggestShortcuts) return;

  const shortcuts = habits.map((h) =>
    buildHabitShortcut(h._id as string, h.name, h.icon)
  );

  try {
    mod.suggestShortcuts(shortcuts);
  } catch (err) {
    console.warn('[SiriShortcut] Failed to suggest shortcuts:', err);
  }
}

/**
 * Listen for Siri shortcut invocations.
 * Returns a cleanup function to remove the listener.
 */
export function addShortcutListener(
  callback: (userInfo: { habitId: string; habitName: string }) => void
): () => void {
  const mod = getNativeModule();
  if (!mod) return () => {};

  try {
    const { SiriShortcutsEvent } = mod;
    const subscription = SiriShortcutsEvent.addListener(
      'SiriShortcutListener',
      (data: { userInfo?: { habitId: string; habitName: string } }) => {
        if (data.userInfo?.habitId) {
          callback(data.userInfo);
        }
      }
    );
    return () => subscription.remove();
  } catch {
    return () => {};
  }
}

/** Check if Siri shortcuts are available on this device */
export function isSiriAvailable(): boolean {
  return Platform.OS === 'ios' && getNativeModule() !== null;
}
