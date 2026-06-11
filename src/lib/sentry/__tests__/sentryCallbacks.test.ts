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

  it('scrubs breadcrumb data values', () => {
    const result = send({
      breadcrumbs: [
        { data: { url: 'https://ok.example', token: 'x', v: 'pk_test_abcdef123456' } },
      ],
    });
    expect(result?.breadcrumbs?.[0].data).toEqual({
      url: 'https://ok.example',
      token: '[redacted]',
      v: '[redacted]',
    });
  });
});
