/**
 * Error Tracking Hooks Tests
 */

import { renderHook, act } from '@testing-library/react-native';
import {
  useErrorTracking,
  useTrackedMutation,
  useQueryErrorTracking,
  useComponentErrorHandler,
  useAsyncErrorTracking,
} from '../hooks/index';

jest.mock('../tracker/index', () => ({
  trackError: jest.fn(() => ({
    classified: { category: 'server', isRetryable: true },
    eventId: 'event-123',
    reported: true,
  })),
  getSeverity: jest.fn(() => 'error'),
}));

jest.mock('../mutation/index', () => ({
  trackMutationError: jest.fn(),
  addMutationBreadcrumb: jest.fn(),
  addMutationSuccessBreadcrumb: jest.fn(),
}));

jest.mock('../queryTracker', () => ({
  trackQueryError: jest.fn(),
  addQueryBreadcrumb: jest.fn(),
}));

import { trackError, getSeverity } from '../tracker/index';
import {
  trackMutationError,
  addMutationBreadcrumb,
  addMutationSuccessBreadcrumb,
} from '../mutation/index';
import { trackQueryError, addQueryBreadcrumb } from '../queryTracker';

const mockTrackError = trackError as jest.MockedFunction<typeof trackError>;

describe('Error Tracking Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useErrorTracking', () => {
    it('should provide track function', () => {
      const { result } = renderHook(() => useErrorTracking());
      const error = new Error('Test error');
      act(() => {
        result.current.track(error);
      });
      expect(mockTrackError).toHaveBeenCalledWith(error, undefined);
    });

    it('should provide trackWithComponent function', () => {
      const { result } = renderHook(() => useErrorTracking());
      const error = new Error('Test error');
      act(() => {
        result.current.trackWithComponent(error, 'TestComponent');
      });
      expect(mockTrackError).toHaveBeenCalledWith(error, {
        tags: { component: 'TestComponent' },
      });
    });
  });

  describe('useTrackedMutation', () => {
    it('should wrap mutation with tracking', async () => {
      const mockMutation = jest.fn().mockResolvedValue({ success: true });
      const { result } = renderHook(() =>
        useTrackedMutation('createHabit', mockMutation)
      );
      await act(async () => {
        await result.current({ name: 'New Habit' });
      });
      expect(addMutationBreadcrumb).toHaveBeenCalled();
      expect(addMutationSuccessBreadcrumb).toHaveBeenCalled();
    });
  });

  describe('useQueryErrorTracking', () => {
    it('should provide trackError for query', () => {
      const { result } = renderHook(() => useQueryErrorTracking('getHabits'));
      const error = new Error('Query failed');
      act(() => {
        result.current.trackError(error, { userId: 'u123' });
      });
      expect(trackQueryError).toHaveBeenCalled();
    });
  });

  describe('useComponentErrorHandler', () => {
    it('should track component errors', () => {
      const { result } = renderHook(() =>
        useComponentErrorHandler('HabitsList')
      );
      const error = new Error('Component error');
      act(() => {
        result.current(error, { componentStack: '<div>...</div>' });
      });
      expect(mockTrackError).toHaveBeenCalled();
    });
  });

  describe('useAsyncErrorTracking', () => {
    it('should wrap async operations', async () => {
      const { result } = renderHook(() => useAsyncErrorTracking('fetchData'));
      let response;
      await act(async () => {
        response = await result.current.wrap(async () => ({ data: 'test' }));
      });
      expect(response).toEqual({ data: 'test' });
    });
  });
});
