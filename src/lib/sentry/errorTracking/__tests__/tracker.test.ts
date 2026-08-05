/**
 * Error Tracker Tests
 */

import {
  trackError,
  configureErrorTracker,
  getSeverity,
  resetRateLimit,
} from '../tracker/index';
import { CATEGORY_SEVERITY_MAP } from '../types';
import type { ClassifiedError } from '../../../offline/types';

// Mock the Sentry modules
jest.mock('../../init/index', () => ({ isSentryInitialized: jest.fn() }));
jest.mock('../../reporter/index', () => ({ getSentryReporter: jest.fn() }));
jest.mock('../../../offline/errorClassifier/classify', () => ({
  classifyError: jest.fn(),
}));

import { isSentryInitialized } from '../../init/index';
import { getSentryReporter } from '../../reporter/index';
import { classifyError } from '../../../offline/errorClassifier/classify';

const mockIsSentryInitialized = isSentryInitialized as jest.MockedFunction<
  typeof isSentryInitialized
>;
const mockGetSentryReporter = getSentryReporter as jest.MockedFunction<
  typeof getSentryReporter
>;
const mockClassifyError = classifyError as jest.MockedFunction<
  typeof classifyError
>;

describe('Error Tracker', () => {
  const mockReporter = {
    addBreadcrumb: jest.fn(),
    captureError: jest.fn(() => 'event-123'),
    captureMessage: jest.fn(),
    capturePerformanceIssue: jest.fn(),
    finishTransaction: jest.fn(),
    setUser: jest.fn(),
    startTransaction: jest.fn(),
  };

  const createMockClassifiedError = (
    overrides: Partial<ClassifiedError> = {}
  ): ClassifiedError => ({
    category: 'server',
    isRetryable: true,
    message: 'Test error message',
    original: new Error('Test error'),
    statusCode: 500,
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsSentryInitialized.mockReturnValue(true);
    mockGetSentryReporter.mockReturnValue(mockReporter);
    mockClassifyError.mockReturnValue(createMockClassifiedError());
    configureErrorTracker({
      rateLimitPerMinute: 100,
      reportSilentCategories: false,
      sampleRate: 1,
    });
    resetRateLimit();
  });

  describe('getSeverity', () => {
    it('should return correct severity for each category', () => {
      for (const [category, severity] of Object.entries(
        CATEGORY_SEVERITY_MAP
      )) {
        const classified = createMockClassifiedError({
          category: category as ClassifiedError['category'],
        });
        expect(getSeverity(classified)).toBe(severity);
      }
    });
  });

  describe('trackError', () => {
    it('should classify and report error to Sentry', () => {
      const error = new Error('Test error');
      const result = trackError(error);

      expect(mockClassifyError).toHaveBeenCalledWith(error);
      expect(mockReporter.captureError).toHaveBeenCalled();
      expect(result.reported).toBe(true);
      expect(result.eventId).toBe('event-123');
    });

    it('should not report when Sentry is not initialized', () => {
      mockIsSentryInitialized.mockReturnValue(false);
      const result = trackError(new Error('Test'));
      expect(result.reported).toBe(false);
      expect(result.skipReason).toBe('sentry_disabled');
    });

    it('should not report silent category errors by default', () => {
      mockClassifyError.mockReturnValue(
        createMockClassifiedError({ category: 'network' })
      );
      const result = trackError(new Error('Network error'));
      expect(result.reported).toBe(false);
      expect(result.skipReason).toBe('silent_category');
    });

    it('should report silent categories when configured', () => {
      configureErrorTracker({ reportSilentCategories: true });
      mockClassifyError.mockReturnValue(
        createMockClassifiedError({ category: 'network' })
      );
      const result = trackError(new Error('Network error'));
      expect(result.reported).toBe(true);
    });
  });

  describe('rate limiting', () => {
    it('should respect rate limit per minute', () => {
      configureErrorTracker({ rateLimitPerMinute: 3 });
      trackError(new Error('Error 1'));
      trackError(new Error('Error 2'));
      trackError(new Error('Error 3'));
      const result = trackError(new Error('Error 4'));
      expect(mockReporter.captureError).toHaveBeenCalledTimes(3);
      expect(result.reported).toBe(false);
    });
  });
});
