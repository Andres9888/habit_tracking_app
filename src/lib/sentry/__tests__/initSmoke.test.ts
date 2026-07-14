import type { ErrorEvent } from '@sentry/react-native';
import type { SentryConfig } from '../types';

const TEST_CONFIG: SentryConfig = {
  debug: true,
  dsn: 'https://public@example.sentry.io/123',
  environment: 'production',
  release: 'daily-habits@1.0.0+1',
  sampleRate: 1,
  tracesSampleRate: 0.2,
};

function mockSentry() {
  jest.doMock('@sentry/react-native', () => ({
    addBreadcrumb: jest.fn(),
    captureException: jest.fn(() => 'event-id'),
    captureMessage: jest.fn(() => 'event-id'),
    init: jest.fn(),
    mobileReplayIntegration: jest.fn(() => ({ name: 'mobileReplay' })),
    reactNavigationIntegration: jest.fn(() => ({ name: 'navigation' })),
    setTag: jest.fn(),
    setUser: jest.fn(),
    startSpan: jest.fn((_options, callback) =>
      callback({
        end: jest.fn(),
        setAttribute: jest.fn(),
        setStatus: jest.fn(),
      })
    ),
  }));
}

describe('Sentry startup/init smoke tests', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.EXPO_PUBLIC_SENTRY_DSN;
    mockSentry();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('keeps startup disabled when no DSN is configured', () => {
    const Sentry = require('@sentry/react-native');
    const { initSentry, isSentryInitialized } = require('../init');

    expect(initSentry()).toBe(false);
    expect(isSentryInitialized()).toBe(false);
    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it('installs privacy scrubbing callbacks during init', () => {
    const Sentry = require('@sentry/react-native');
    const { initSentryWithConfig } = require('../init');

    expect(initSentryWithConfig(TEST_CONFIG)).toBe(true);

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        beforeSend: expect.any(Function),
        dsn: TEST_CONFIG.dsn,
      })
    );

    const initOptions = Sentry.init.mock.calls[0][0];
    expect(initOptions).toEqual(
      expect.objectContaining({
        attachScreenshot: false,
        attachViewHierarchy: false,
        enableAutoConsoleLogs: false,
        enableCaptureFailedRequests: false,
        profilesSampleRate: undefined,
        replaysOnErrorSampleRate: undefined,
        replaysSessionSampleRate: undefined,
        sendDefaultPii: false,
      })
    );
    const beforeSend = initOptions.beforeSend as (
      event: ErrorEvent
    ) => ErrorEvent | null;

    const result = beforeSend({
      breadcrumbs: [
        {
          data: {
            email: 'person@example.com',
            safe: 'kept',
            value: 'Bearer abc.def.ghi',
          },
          message: 'request failed with sk_live_abcdefgh12345678',
        },
      ],
      extra: {
        habitName: 'Morning walk',
        token: 'secret-token',
      },
      message: 'auth failed for Bearer abc.def.ghi',
      request: {
        data: {
          note: 'safe',
          password: 'hunter2',
        },
        headers: {
          Authorization: 'Bearer abc.def.ghi',
          'x-client': 'chain-day',
        },
      },
    } as ErrorEvent);

    expect(result?.breadcrumbs?.[0].data).toEqual({
      email: '[redacted]',
      safe: 'kept',
      value: '[redacted]',
    });
    expect(result?.breadcrumbs?.[0].message).toBe(
      'request failed with [redacted]'
    );
    expect(result?.extra).toEqual({
      habitName: 'Morning walk',
      token: '[redacted]',
    });
    expect(result?.message).toBe('auth failed for [redacted]');
    expect(result?.request?.headers).toEqual({
      Authorization: '[redacted]',
      'x-client': 'chain-day',
    });
    expect(result?.request?.data).toEqual({
      note: 'safe',
      password: '[redacted]',
    });
  });

  it('clears Sentry user context and premium tag after init', () => {
    const Sentry = require('@sentry/react-native');
    const { initSentryWithConfig } = require('../init');
    const { getSentryReporter } = require('../reporter');

    expect(initSentryWithConfig(TEST_CONFIG)).toBe(true);

    const reporter = getSentryReporter();
    reporter.setUser({ id: 'user_123', isPremium: true });
    reporter.setUser(null);

    expect(Sentry.setUser).toHaveBeenNthCalledWith(1, { id: 'user_123' });
    expect(Sentry.setTag).toHaveBeenNthCalledWith(1, 'user_premium', 'true');
    expect(Sentry.setUser).toHaveBeenNthCalledWith(2, null);
    expect(Sentry.setTag).toHaveBeenNthCalledWith(2, 'user_premium', null);
  });

  it('enables reviewed replay, profiling, and logs when config opts in', () => {
    const Sentry = require('@sentry/react-native');
    const { initSentryWithConfig } = require('../init');

    expect(
      initSentryWithConfig({
        ...TEST_CONFIG,
        enableLogs: true,
        profilesSampleRate: 0.1,
        replaysOnErrorSampleRate: 1,
        replaysSessionSampleRate: 0.01,
      })
    ).toBe(true);

    const initOptions = Sentry.init.mock.calls[0][0];
    expect(Sentry.mobileReplayIntegration).toHaveBeenCalledTimes(1);
    expect(initOptions).toEqual(
      expect.objectContaining({
        enableAutoConsoleLogs: false,
        enableLogs: true,
        profilesSampleRate: 0.1,
        replaysOnErrorSampleRate: 1,
        replaysSessionQuality: 'low',
        replaysSessionSampleRate: 0.01,
        sendDefaultPii: false,
      })
    );
    expect(initOptions.integrations).toEqual([
      { name: 'navigation' },
      { name: 'mobileReplay' },
    ]);
  });
});
