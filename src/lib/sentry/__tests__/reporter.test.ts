/**
 * Sentry Reporter Tests
 * Unit tests for the Sentry reporter module.
 */

import { getSentryReporter, sentryReporter } from '../reporter';
import type { SentryReporter, SentryBreadcrumb, SentryUser } from '../types';
import type { PerformanceIssue } from '../../../contexts/PerformanceContext/types';

// Mock the init module to control initialization state
jest.mock('../init', () => ({
  isSentryInitialized: jest.fn(() => false),
}));

// Mock @sentry/react-native
jest.mock('@sentry/react-native', () => ({
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
}));

describe('Sentry Reporter - Uninitialized State', () => {
  let reporter: SentryReporter;

  beforeEach(() => {
    reporter = getSentryReporter();
  });

  describe('no-op behavior when not initialized', () => {
    it('captureError returns empty string', () => {
      const error = new Error('Test error');
      const result = reporter.captureError(error);
      expect(result).toBe('');
    });

    it('captureMessage returns empty string', () => {
      const result = reporter.captureMessage('Test message');
      expect(result).toBe('');
    });

    it('capturePerformanceIssue does not throw', () => {
      const issue: PerformanceIssue = {
        type: 'fps_drop',
        severity: 'warning',
        message: 'FPS dropped',
        timestamp: Date.now(),
        data: {},
      };
      expect(() => reporter.capturePerformanceIssue(issue)).not.toThrow();
    });

    it('addBreadcrumb does not throw', () => {
      const breadcrumb: SentryBreadcrumb = {
        category: 'user',
        message: 'User action',
      };
      expect(() => reporter.addBreadcrumb(breadcrumb)).not.toThrow();
    });

    it('setUser does not throw', () => {
      const user: SentryUser = { id: 'user-123' };
      expect(() => reporter.setUser(user)).not.toThrow();
      expect(() => reporter.setUser(null)).not.toThrow();
    });

    it('startTransaction returns no-op transaction', () => {
      const transaction = reporter.startTransaction('app.cold_start');
      expect(transaction).not.toBeNull();
      expect(typeof transaction?.finish).toBe('function');
      expect(typeof transaction?.setData).toBe('function');
      expect(typeof transaction?.setStatus).toBe('function');
      expect(typeof transaction?.startChild).toBe('function');

      // Should not throw
      transaction?.finish();
      transaction?.setData('key', 'value');
      transaction?.setStatus('ok');

      const child = transaction?.startChild('ui.render', 'Test render');
      expect(child).toBeDefined();
      child?.finish();
    });

    it('finishTransaction does not throw', () => {
      const transaction = reporter.startTransaction('habits.load');
      expect(() => reporter.finishTransaction(transaction!)).not.toThrow();
    });
  });
});

describe('sentryReporter singleton', () => {
  it('provides instance property', () => {
    const instance = sentryReporter.instance;
    expect(instance).toBeDefined();
    expect(typeof instance.captureError).toBe('function');
    expect(typeof instance.captureMessage).toBe('function');
  });

  it('returns consistent no-op behavior when not initialized', () => {
    const result1 = sentryReporter.instance.captureMessage('Test');
    const result2 = sentryReporter.instance.captureMessage('Test');
    expect(result1).toBe('');
    expect(result2).toBe('');
  });
});

describe('Reporter Types', () => {
  describe('TransactionName values', () => {
    it('handles all transaction names', () => {
      const reporter = getSentryReporter();
      const names = [
        'app.cold_start',
        'app.warm_start',
        'habits.load',
        'habits.toggle',
        'habits.create',
        'habits.sync',
        'auth.login',
        'auth.logout',
        'navigation.screen_change',
      ] as const;

      names.forEach((name) => {
        expect(() => reporter.startTransaction(name)).not.toThrow();
      });
    });
  });

  describe('SpanOperation values', () => {
    it('handles all span operations', () => {
      const reporter = getSentryReporter();
      const transaction = reporter.startTransaction('habits.load');

      const operations = [
        'db.query',
        'http.client',
        'ui.render',
        'ui.interaction',
        'task.async',
        'function',
      ] as const;

      operations.forEach((op) => {
        expect(() => transaction?.startChild(op, 'Test')).not.toThrow();
      });
    });
  });
});

describe('PerformanceIssue handling', () => {
  it('handles all issue types', () => {
    const reporter = getSentryReporter();
    const types = [
      'fps_drop',
      'memory_leak',
      'slow_network',
      'slow_render',
    ] as const;
    const severities = ['critical', 'warning'] as const;

    types.forEach((type) => {
      severities.forEach((severity) => {
        const issue: PerformanceIssue = {
          type,
          severity,
          message: `Test ${type}`,
          timestamp: Date.now(),
          data: { test: true },
        };
        expect(() => reporter.capturePerformanceIssue(issue)).not.toThrow();
      });
    });
  });
});
