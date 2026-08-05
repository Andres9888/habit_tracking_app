/**
 * Tests for update-style coalescing (updateHabit / updateSettings).
 */

import {
  createOfflineQueueManager,
  resetOfflineQueueManager,
} from './index';
import type { OfflineQueueManagerAPI } from './types';
import type {
  CreateHabitPayload,
  UpdateHabitPayload,
  UpdateSettingsPayload,
} from '../queue';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const habitId = 'habit_123' as UpdateHabitPayload['habitId'];

describe('coalesceUpdate', () => {
  let manager: OfflineQueueManagerAPI;

  beforeEach(() => {
    jest.clearAllMocks();
    resetOfflineQueueManager();
    manager = createOfflineQueueManager({ autoPersist: false });
  });

  it('merges repeated updateHabit ops for the same habit into one entry', () => {
    manager.enqueue('updateHabit', { habitId, updates: { name: 'A' } });
    const second = manager.enqueue('updateHabit', {
      habitId,
      updates: { color: '#fff' },
    });

    const ops = manager.getState().operations;
    expect(ops).toHaveLength(1);
    expect(second.replaced).toBe(true);
    const payload = ops[0].payload as UpdateHabitPayload;
    expect(payload.updates).toEqual({ name: 'A', color: '#fff' });
  });

  it('keeps separate update entries for different habits', () => {
    manager.enqueue('updateHabit', { habitId, updates: { name: 'A' } });
    manager.enqueue('updateHabit', {
      habitId: 'habit_456' as UpdateHabitPayload['habitId'],
      updates: { name: 'B' },
    });
    expect(manager.getState().operations).toHaveLength(2);
  });

  it('merges an edit targeting a temp id into the pending create', () => {
    const tempId = 'temp_habit_1_abc';
    manager.enqueue('createHabit', {
      name: 'Draft',
      tempId,
    } as CreateHabitPayload);
    manager.enqueue('updateHabit', {
      habitId: tempId as UpdateHabitPayload['habitId'],
      updates: { name: 'Renamed', color: '#000' },
    });

    const ops = manager.getState().operations;
    expect(ops).toHaveLength(1);
    expect(ops[0].type).toBe('createHabit');
    const payload = ops[0].payload as CreateHabitPayload;
    expect(payload.name).toBe('Renamed');
    expect(payload.color).toBe('#000');
    expect(payload.tempId).toBe(tempId);
  });

  it('coalesces updateSettings to a single whole-document entry', () => {
    manager.enqueue('updateSettings', {
      settings: { darkMode: true },
    } as UpdateSettingsPayload);
    manager.enqueue('updateSettings', {
      settings: { darkMode: false, compact: true },
    } as UpdateSettingsPayload);

    const ops = manager.getState().operations;
    expect(ops).toHaveLength(1);
    const payload = ops[0].payload as UpdateSettingsPayload;
    expect(payload.settings).toEqual({ darkMode: false, compact: true });
  });
});
