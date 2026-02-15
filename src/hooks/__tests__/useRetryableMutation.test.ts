/**
 * useRetryableMutation Hook Tests
 *
 * Created by Opus.
 */

import { renderHook, act } from '@testing-library/react-hooks';
import { useRetryableMutation } from '../useRetryableMutation';

// Mock dependencies
jest.mock('../../contexts/NetworkStatusContext', () => ({
  useIsOnline: jest.fn(() => true),
}));

jest.mock('../../lib/offline', () => ({
  isNetworkError: jest.fn((err: unknown) => {
    if (err instanceof Error) {
      return err.message.includes('network') || err.message.includes('Network');
    }
    return false;
  }),
}));

const { useIsOnline } = require('../../contexts/NetworkStatusContext');

describe('useRetryableMutation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useIsOnline as jest.Mock).mockReturnValue(true);
  });

  it('executes mutation successfully on first try', async () => {
    const mutationFn = jest.fn().mockResolvedValue('result');

    const { result } = renderHook(() =>
      useRetryableMutation(mutationFn, { maxRetries: 3 })
    );

    let value: string | undefined;
    await act(async () => {
      value = await result.current.execute('args');
    });

    expect(value).toBe('result');
    expect(result.current.state.error).toBeNull();
    expect(result.current.state.isLoading).toBe(false);
    expect(mutationFn).toHaveBeenCalledTimes(1);
  });

  it('fails fast when offline', async () => {
    (useIsOnline as jest.Mock).mockReturnValue(false);
    const mutationFn = jest.fn().mockResolvedValue('ok');

    const { result } = renderHook(() => useRetryableMutation(mutationFn));

    await act(async () => {
      await result.current.execute('args');
    });

    expect(mutationFn).not.toHaveBeenCalled();
    expect(result.current.state.isNetworkIssue).toBe(true);
    expect(result.current.state.userMessage).toContain('offline');
  });

  it('clears error state', async () => {
    (useIsOnline as jest.Mock).mockReturnValue(false);
    const mutationFn = jest.fn();

    const { result } = renderHook(() => useRetryableMutation(mutationFn));

    await act(async () => {
      await result.current.execute('args');
    });

    expect(result.current.state.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.state.error).toBeNull();
  });

  it('does not retry non-network errors', async () => {
    const mutationFn = jest
      .fn()
      .mockRejectedValue(new Error('validation error'));

    const { result } = renderHook(() =>
      useRetryableMutation(mutationFn, { maxRetries: 3, baseDelayMs: 10 })
    );

    await act(async () => {
      await result.current.execute('args');
    });

    // Should only attempt once for non-network errors
    expect(mutationFn).toHaveBeenCalledTimes(1);
    expect(result.current.state.error?.message).toBe('validation error');
    expect(result.current.state.isNetworkIssue).toBe(false);
  });
});
