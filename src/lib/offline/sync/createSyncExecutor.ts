/**
 * createSyncExecutor - Factory for creating sync executors
 *
 * Creates a unified executor that handles all offline operation types.
 */

import type { OfflineOperation } from '../queue';

function normalizeReminderTime(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const amPmMatch = /^(\d{1,2}):([0-5]\d)\s*([AaPp][Mm])$/.exec(trimmed);
  if (amPmMatch) {
    const hour = Number.parseInt(amPmMatch[1], 10);
    const minute = amPmMatch[2];
    const period = amPmMatch[3].toUpperCase();

    let normalizedHour = hour;
    if (period === 'PM' && hour < 12) {
      normalizedHour += 12;
    } else if (period === 'AM' && hour === 12) {
      normalizedHour = 0;
    }

    return `${normalizedHour.toString().padStart(2, '0')}:${minute}`;
  }

  const legacyMatch = /^(\d{1,2}):([0-5]\d)$/.exec(trimmed);
  if (!legacyMatch) {
    return undefined;
  }

  const hour = Number.parseInt(legacyMatch[1], 10);
  const minute = Number.parseInt(legacyMatch[2], 10);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return undefined;
  }

  return `${hour.toString().padStart(2, '0')}:${minute
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Convex mutation signatures
 */
export interface ConvexMutations {
  toggleHabit: (args: { habitId: string; date: string }) => Promise<void>;
  createHabit: (args: {
    name: string;
    icon?: string;
    color?: string;
    iconColor?: string;
    notes?: string;
    preferredTime?: string;
    remindersEnabled?: boolean;
    reminderTime?: string;
    reminderSound?: string;
  }) => Promise<string>;
  updateHabit: (args: {
    habitId: string;
    name?: string;
    icon?: string;
    color?: string;
    iconColor?: string;
    notes?: string;
    preferredTime?: string;
    remindersEnabled?: boolean;
    reminderTime?: string;
    reminderSound?: string;
  }) => Promise<void>;
  archiveHabit: (args: { habitId: string }) => Promise<void>;
  pauseHabit: (args: { habitId: string }) => Promise<void>;
  removeHabit: (args: { habitId: string }) => Promise<void>;
}

/**
 * Creates a sync executor that routes operations to appropriate Convex mutations
 */
export function createSyncExecutor(mutations: ConvexMutations) {
  return async (operation: OfflineOperation): Promise<void> => {
    switch (operation.type) {
      case 'toggleCompletion': {
        const payload = operation.payload as Extract<
          OfflineOperation['payload'],
          { habitId: string; date: string }
        >;
        await mutations.toggleHabit({
          habitId: payload.habitId,
          date: payload.date,
        });
        break;
      }

      case 'createHabit': {
        const payload = operation.payload as Extract<
          OfflineOperation['payload'],
          { name: string; tempId: string }
        >;
        const normalizedReminderTime = normalizeReminderTime(payload.reminderTime);
        // Server will create habit with server-assigned ID
        // State reconciliation will handle mapping tempId → serverId
        await mutations.createHabit({
          name: payload.name,
          icon: payload.icon,
          color: payload.color,
          iconColor: payload.iconColor,
          notes: payload.notes,
          preferredTime: payload.preferredTime,
          remindersEnabled: payload.remindersEnabled,
          reminderTime: normalizedReminderTime,
          reminderSound: payload.reminderSound,
        });
        break;
      }

      case 'updateHabit': {
        const payload = operation.payload as Extract<
          OfflineOperation['payload'],
          { habitId: string; updates: object }
        >;
        const { habitId, updates } = payload;
        const normalizedUpdates = { ...updates } as Record<string, unknown>;
        if (Object.prototype.hasOwnProperty.call(normalizedUpdates, 'reminderTime')) {
          const normalizedReminderTime = normalizeReminderTime(
            normalizedUpdates.reminderTime as unknown
          );
          if (normalizedReminderTime) {
            normalizedUpdates.reminderTime = normalizedReminderTime;
          } else {
            delete normalizedUpdates.reminderTime;
          }
        }
        await mutations.updateHabit({
          habitId,
          ...normalizedUpdates,
        });
        break;
      }

      case 'archiveHabit': {
        const payload = operation.payload as Extract<
          OfflineOperation['payload'],
          { habitId: string }
        >;
        await mutations.archiveHabit({ habitId: payload.habitId });
        break;
      }

      case 'pauseHabit': {
        const payload = operation.payload as Extract<
          OfflineOperation['payload'],
          { habitId: string }
        >;
        await mutations.pauseHabit({ habitId: payload.habitId });
        break;
      }

      case 'removeHabit': {
        const payload = operation.payload as Extract<
          OfflineOperation['payload'],
          { habitId: string }
        >;
        await mutations.removeHabit({ habitId: payload.habitId });
        break;
      }

      default: {
        const exhaustive: never = operation.type;
        throw new Error(`Unknown operation type: ${exhaustive}`);
      }
    }
  };
}
