import { act, renderHook } from '@testing-library/react-native';
import type { Id } from '../../../../convex/_generated/dataModel';
import {
  getOfflineQueueManager,
  resetOfflineQueueManager,
} from '../../offline/queueManager';
import { useOfflineMutation } from '../hooks/useOfflineMutation';

const habitId = 'habit_1' as Id<'habits'>;
const payload = { habitId, habitName: 'Read' };

describe('useOfflineMutation', () => {
  beforeEach(() => resetOfflineQueueManager());

  it('queues without calling the server while offline', async () => {
    const serverMutation = jest.fn().mockResolvedValue(undefined);
    const applyOptimistic = jest.fn();
    const { result } = renderHook(() =>
      useOfflineMutation('archiveHabit', serverMutation, {
        applyOptimistic,
        isOnline: false,
      })
    );

    let mutationResult;
    await act(async () => {
      mutationResult = await result.current(payload);
    });

    expect(mutationResult).toMatchObject({ kind: 'queued' });
    expect(serverMutation).not.toHaveBeenCalled();
    expect(applyOptimistic).toHaveBeenCalledWith(expect.any(String), payload);
    expect(getOfflineQueueManager().getState().operations).toHaveLength(1);
  });

  it('confirms an optimistic operation after an online success', async () => {
    const serverMutation = jest.fn().mockResolvedValue('saved');
    const applyOptimistic = jest.fn();
    const confirmOptimistic = jest.fn();
    const { result } = renderHook(() =>
      useOfflineMutation('archiveHabit', serverMutation, {
        applyOptimistic,
        confirmOptimistic,
        isOnline: true,
      })
    );

    await act(async () => {
      await result.current(payload);
    });

    const operationId = applyOptimistic.mock.calls[0][0];
    expect(confirmOptimistic).toHaveBeenCalledWith(operationId);
    expect(getOfflineQueueManager().getState().operations).toHaveLength(0);
  });

  it('keeps the same optimistic ID when an online request loses network', async () => {
    const serverMutation = jest
      .fn()
      .mockRejectedValue(new TypeError('Network request failed'));
    const applyOptimistic = jest.fn();
    const failOptimistic = jest.fn();
    const { result } = renderHook(() =>
      useOfflineMutation('archiveHabit', serverMutation, {
        applyOptimistic,
        failOptimistic,
        isOnline: true,
      })
    );

    let mutationResult;
    await act(async () => {
      mutationResult = await result.current(payload);
    });

    const operationId = applyOptimistic.mock.calls[0][0];
    expect(mutationResult).toEqual({ kind: 'queued', operationId });
    expect(getOfflineQueueManager().getState().operations[0].id).toBe(
      operationId
    );
    expect(failOptimistic).not.toHaveBeenCalled();
  });

  it('reverts and rethrows non-network failures', async () => {
    const validationError = new Error('Invalid habit');
    const serverMutation = jest.fn().mockRejectedValue(validationError);
    const failOptimistic = jest.fn();
    const { result } = renderHook(() =>
      useOfflineMutation('archiveHabit', serverMutation, {
        failOptimistic,
        isOnline: true,
      })
    );

    await expect(result.current(payload)).rejects.toBe(validationError);
    expect(failOptimistic).toHaveBeenCalledWith(
      expect.any(String),
      validationError
    );
  });
});
