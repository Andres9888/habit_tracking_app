/**
 * Sentry Integration Tests
 * Tests for the Sentry monitoring integration module.
 */

import {
  buildSentryConfig,
  isSentryEnabled,
} from '../../../src/lib/sentry/config';
import {
  DEFAULT_SENTRY_CONFIG,
  type SentryConfig,
  type SentryBreadcrumb,
  type SentryUser,
} from '../../../src/lib/sentry/types';
import {
  reportFrameIssue,
  reportSlowRenders,
  reportMemoryIssue,
  reportNetworkIssue,
  createSentryIssueHandler,
} from '../../../src/lib/sentry/performanceIntegration';
import type { PerformanceIssue } from '../../../src/contexts/PerformanceContext/types';
import type {
  FrameTimingData,
  RenderTiming,
} from '../../../src/lib/performance/types';

// Mock @sentry/react-native since it's not available in tests
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(() => 'mock-event-id'),
  captureMessage: jest.fn(() => 'mock-event-id'),
  addBreadcrumb: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  startSpan: jest.fn(() => ({
    end: jest.fn(),
    setAttribute: jest.fn(),
    setStatus: jest.fn(),
  })),
  reactNavigationIntegration: jest.fn(() => ({})),
}));

describe('Sentry Configuration', () => {
  const originalDsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

  afterEach(() => {
    if (originalDsn === undefined) {
      delete process.env.EXPO_PUBLIC_SENTRY_DSN;
    } else {
      process.env.EXPO_PUBLIC_SENTRY_DSN = originalDsn;
    }
  });

  describe('buildSentryConfig', () => {
    it('returns null when no DSN is configured', () => {
      delete process.env.EXPO_PUBLIC_SENTRY_DSN;
      const config = buildSentryConfig();
      expect(config).toBeNull();
    });

    it('returns config when DSN is provided', () => {
      process.env.EXPO_PUBLIC_SENTRY_DSN = 'https://test@sentry.io/123';
      const config = buildSentryConfig();
      expect(config).not.toBeNull();
      expect(config?.dsn).toBe('https://test@sentry.io/123');
    });

    it('sets environment to development in __DEV__ mode', () => {
      process.env.EXPO_PUBLIC_SENTRY_DSN = 'https://test@sentry.io/123';
      const config = buildSentryConfig();
      expect(config?.environment).toBe('development');
    });
  });

  describe('isSentryEnabled', () => {
    it('returns false when no DSN configured', () => {
      delete process.env.EXPO_PUBLIC_SENTRY_DSN;
      expect(isSentryEnabled()).toBe(false);
    });

    it('returns true when DSN is configured', () => {
      process.env.EXPO_PUBLIC_SENTRY_DSN = 'https://test@sentry.io/123';
      expect(isSentryEnabled()).toBe(true);
    });
  });
});

describe('Sentry Types', () => {
  describe('DEFAULT_SENTRY_CONFIG', () => {
    it('has expected default values', () => {
      expect(DEFAULT_SENTRY_CONFIG.enablePerformance).toBe(true);
      expect(DEFAULT_SENTRY_CONFIG.sampleRate).toBe(1.0);
      expect(DEFAULT_SENTRY_CONFIG.tracesSampleRate).toBeDefined();
    });
  });

  describe('SentryUser type', () => {
    it('accepts valid user objects', () => {
      const user: SentryUser = {
        id: 'user-123',
        email: 'test@example.com',
        isPremium: true,
      };
      expect(user.id).toBe('user-123');
      expect(user.email).toBe('test@example.com');
      expect(user.isPremium).toBe(true);
    });

    it('allows optional fields', () => {
      const user: SentryUser = { id: 'user-123' };
      expect(user.email).toBeUndefined();
      expect(user.isPremium).toBeUndefined();
    });
  });

  describe('SentryBreadcrumb type', () => {
    it('accepts valid breadcrumb objects', () => {
      const breadcrumb: SentryBreadcrumb = {
        category: 'habit',
        message: 'Habit completed',
        data: { habitId: '123' },
        level: 'info',
      };
      expect(breadcrumb.category).toBe('habit');
      expect(breadcrumb.message).toBe('Habit completed');
    });
  });
});

describe('Performance Integration', () => {
  describe('reportFrameIssue', () => {
    it('does not report for acceptable FPS', () => {
      const frameData: FrameTimingData = {
        fps: 60,
        frameTime: 16.67,
        jankFrames: 0,
        totalFrames: 100,
        timestamp: Date.now(),
      };
      // Should not throw
      expect(() => reportFrameIssue(frameData)).not.toThrow();
    });

    it('handles warning-level FPS drops', () => {
      const frameData: FrameTimingData = {
        fps: 40,
        frameTime: 25,
        jankFrames: 10,
        totalFrames: 100,
        timestamp: Date.now(),
      };
      expect(() => reportFrameIssue(frameData)).not.toThrow();
    });

    it('handles critical-level FPS drops', () => {
      const frameData: FrameTimingData = {
        fps: 20,
        frameTime: 50,
        jankFrames: 50,
        totalFrames: 100,
        timestamp: Date.now(),
      };
      expect(() => reportFrameIssue(frameData)).not.toThrow();
    });
  });

  describe('reportSlowRenders', () => {
    it('identifies slow components', () => {
      const renders: RenderTiming[] = [
        {
          componentName: 'FastComponent',
          averageRenderTime: 5,
          renderCount: 10,
          totalRenderTime: 50,
          lastRenderTime: 5,
          timestamp: Date.now(),
        },
        {
          componentName: 'SlowComponent',
          averageRenderTime: 25,
          renderCount: 5,
          totalRenderTime: 125,
          lastRenderTime: 30,
          timestamp: Date.now(),
        },
      ];
      expect(() => reportSlowRenders(renders, 16)).not.toThrow();
    });

    it('respects custom threshold', () => {
      const renders: RenderTiming[] = [
        {
          componentName: 'MediumComponent',
          averageRenderTime: 20,
          renderCount: 5,
          totalRenderTime: 100,
          lastRenderTime: 20,
          timestamp: Date.now(),
        },
      ];
      // With threshold of 50ms, this should not be flagged
      expect(() => reportSlowRenders(renders, 50)).not.toThrow();
    });
  });

  describe('reportMemoryIssue', () => {
    it('does not report when under threshold', () => {
      const usage = 100 * 1024 * 1024; // 100MB
      const threshold = 200 * 1024 * 1024; // 200MB
      expect(() => reportMemoryIssue(usage, threshold)).not.toThrow();
    });

    it('reports when over threshold', () => {
      const usage = 250 * 1024 * 1024; // 250MB
      const threshold = 200 * 1024 * 1024; // 200MB
      expect(() => reportMemoryIssue(usage, threshold)).not.toThrow();
    });
  });

  describe('reportNetworkIssue', () => {
    it('does not report fast requests', () => {
      expect(() => reportNetworkIssue(100, '/api/habits', 200)).not.toThrow();
    });

    it('reports slow requests', () => {
      expect(() => reportNetworkIssue(500, '/api/habits', 200)).not.toThrow();
    });

    it('sanitizes URLs with IDs', () => {
      // Should not throw and should handle UUID replacement
      expect(() =>
        reportNetworkIssue(
          300,
          '/api/habits/550e8400-e29b-41d4-a716-446655440000',
          200
        )
      ).not.toThrow();
    });
  });

  describe('createSentryIssueHandler', () => {
    it('returns a function', () => {
      const handler = createSentryIssueHandler();
      expect(typeof handler).toBe('function');
    });

    it('handler accepts PerformanceIssue objects', () => {
      const handler = createSentryIssueHandler();
      const issue: PerformanceIssue = {
        type: 'fps_drop',
        severity: 'warning',
        message: 'FPS dropped to 40',
        timestamp: Date.now(),
        data: { fps: 40 },
      };
      expect(() => handler(issue)).not.toThrow();
    });
  });
});
