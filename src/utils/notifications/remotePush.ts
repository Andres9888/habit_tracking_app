export type RemotePushRegistrationResult =
  | {
      reason: 'product-does-not-need-remote-messaging';
      registered: false;
    }
  | {
      registered: true;
      token: string;
    };

export const REMOTE_PUSH_MESSAGING_ENABLED = false;

export function shouldRegisterRemotePushToken(): boolean {
  return REMOTE_PUSH_MESSAGING_ENABLED;
}

export async function registerRemotePushTokenIfNeeded(): Promise<RemotePushRegistrationResult> {
  if (!shouldRegisterRemotePushToken()) {
    return {
      reason: 'product-does-not-need-remote-messaging',
      registered: false,
    };
  }

  throw new Error('Remote push messaging is not configured for this product.');
}
