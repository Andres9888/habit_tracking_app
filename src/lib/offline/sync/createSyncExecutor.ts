/**
 * createSyncExecutor - Factory for creating sync executors
 *
 * Creates a unified executor that handles all offline operation types.
 */

import type { OfflineOperation } from '../queue';

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
          reminderTime: payload.reminderTime,
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
        await mutations.updateHabit({
          habitId,
          ...updates,
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
