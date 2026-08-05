/**
 * Mutation Tracker Tests
 */

import {
  trackMutationError,
  addMutationBreadcrumb,
  addMutationSuccessBreadcrumb,
  createTrackedMutation,
} from '../mutation/index';

jest.mock('../../reporter/index', () => ({ getSentryReporter: jest.fn() }));
jest.mock('../tracker/index', () => ({
  trackError: jest.fn(() => ({
    classified: { category: 'server', isRetryable: true },
    eventId: 'event-123',
    reported: true,
  })),
}));

import { getSentryReporter } from '../../reporter/index';
import { trackError } from '../tracker/index';

const mockGetSentryReporter = getSentryReporter as jest.MockedFunction<
  typeof getSentryReporter
>;
const mockTrackError = trackError as jest.MockedFunction<typeof trackError>;

describe('Mutation Tracker', () => {
  const mockReporter = {
    addBreadcrumb: jest.fn(),
    captureError: jest.fn(),
    captureMessage: jest.fn(),
    capturePerformanceIssue: jest.fn(),
    finishTransaction: jest.fn(),
    setUser: jest.fn(),
    startTransaction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSentryReporter.mockReturnValue(mockReporter);
  });

  describe('addMutationBreadcrumb', () => {
    it('should add breadcrumb for mutation start', () => {
      addMutationBreadcrumb('toggleHabit', {
        habitId: 'h123',
        date: '2026-01-22',
      });
      expect(mockReporter.addBreadcrumb).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 'habit',
          message: 'Mutation: toggleHabit',
        })
      );
    });

    it('should sanitize sensitive data in args', () => {
      addMutationBreadcrumb('updateUser', {
        email: 'test@example.com',
        password: 'secret123',
      });
      expect(mockReporter.addBreadcrumb).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            args: { email: 'test@example.com', password: '[REDACTED]' },
          }),
        })
      );
    });
  });

  describe('addMutationSuccessBreadcrumb', () => {
    it('should add success breadcrumb with duration', () => {
      addMutationSuccessBreadcrumb('toggleHabit', 150);
      expect(mockReporter.addBreadcrumb).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            duration_ms: 150,
            status: 'success',
          }),
        })
      );
    });
  });

  describe('trackMutationError', () => {
    it('should track mutation error with full context', () => {
      const error = new Error('Mutation failed');
      trackMutationError(error, {
        args: { habitId: 'h123' },
        durationMs: 250,
        mutationName: 'toggleHabit',
      });
      expect(mockTrackError).toHaveBeenCalled();
    });
  });

  describe('createTrackedMutation', () => {
    it('should wrap mutation and track on success', async () => {
      const mockMutation = jest.fn().mockResolvedValue(undefined);
      const trackedMutation = createTrackedMutation(
        'toggleHabit',
        mockMutation
      );
      await trackedMutation({ habitId: 'h123', date: '2026-01-22' });
      expect(mockMutation).toHaveBeenCalled();
      expect(mockReporter.addBreadcrumb).toHaveBeenCalledTimes(2);
    });

    it('should track error and rethrow on failure', async () => {
      const error = new Error('Network error');
      const mockMutation = jest.fn().mockRejectedValue(error);
      const trackedMutation = createTrackedMutation(
        'toggleHabit',
        mockMutation
      );
      await expect(
        trackedMutation({ habitId: 'h123', date: '2026-01-22' })
      ).rejects.toThrow('Network error');
      expect(mockTrackError).toHaveBeenCalled();
    });
  });
});
