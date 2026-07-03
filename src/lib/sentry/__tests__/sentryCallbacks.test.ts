import type { ErrorEvent } from '@sentry/react-native';
import { createBeforeSend } from '../init/sentryCallbacks';
import type { SentryConfig } from '../types';

const config = { debug: true } as SentryConfig;

function send(event: Partial<ErrorEvent>): ErrorEvent | null {
  return createBeforeSend(config)(event as ErrorEvent);
}

describe('createBeforeSend redaction', () => {
  it('redacts values under sensitive key names', () => {
    const result = send({
      extra: { apiKey: 'abc', note: 'safe' },
    });
    expect(result?.extra).toEqual({ apiKey: '[redacted]', note: 'safe' });
  });

  it('redacts secret-shaped values under innocuous keys', () => {
    const result = send({
      extra: {
        a: 'Bearer abc.def.ghi',
        b: 'sk_live_abcdefgh12345678',
        c: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
        d: 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
        plain: 'just a normal message',
      },
    });
    expect(result?.extra).toEqual({
      a: '[redacted]',
      b: '[redacted]',
      c: '[redacted]',
      d: '[redacted]',
      plain: 'just a normal message',
    });
  });

  it('scrubs secrets inside error messages while keeping the rest', () => {
    const result = send({
      message: 'auth failed for Bearer abc.def.ghi at step 3',
    });
    expect(result?.message).toBe('auth failed for [redacted] at step 3');
  });

  it('scrubs secrets inside exception values', () => {
    const result = send({
      exception: {
        values: [
          {
            type: 'Error',
            value: 'HTTP 401 using sk_live_abcdefgh12345678 key',
          },
        ],
      },
    } as Partial<ErrorEvent>);
    expect(result?.exception?.values?.[0].value).toBe(
      'HTTP 401 using [redacted] key'
    );
  });

  it('scrubs request data records and strings', () => {
    const result = send({
      request: { data: { password: 'x', note: 'ok' } },
    } as Partial<ErrorEvent>);
    expect(result?.request?.data).toEqual({
      password: '[redacted]',
      note: 'ok',
    });
  });

  it('scrubs breadcrumb data values', () => {
    const result = send({
      breadcrumbs: [
        {
          data: {
            url: 'https://ok.example',
            token: 'x',
            v: 'pk_test_abcdef123456',
          },
        },
      ],
    });
    expect(result?.breadcrumbs?.[0].data).toEqual({
      url: 'https://ok.example',
      token: '[redacted]',
      v: '[redacted]',
    });
  });

  it('redacts secrets nested inside objects and arrays', () => {
    const result = send({
      extra: {
        user: { profile: { authToken: 'x', name: 'ok' } },
        items: [{ secret: 'y' }, 'sk_live_abcdefgh12345678', 'plain'],
      },
    });
    expect(result?.extra).toEqual({
      user: { profile: { authToken: '[redacted]', name: 'ok' } },
      items: [{ secret: '[redacted]' }, '[redacted]', 'plain'],
    });
  });

  it('scrubs breadcrumb message text (not just data)', () => {
    const result = send({
      breadcrumbs: [
        { message: 'GET https://api/x?token=abc using Bearer abc.def.ghi' },
      ],
    });
    expect(result?.breadcrumbs?.[0].message).toBe(
      'GET https://api/x?token=abc using [redacted]'
    );
  });
});
