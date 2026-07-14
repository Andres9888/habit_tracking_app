import {
  registerRemotePushTokenIfNeeded,
  shouldRegisterRemotePushToken,
} from '../remotePush';

describe('remote push registration decision', () => {
  it('does not register Expo push tokens when remote messaging is not needed', async () => {
    await expect(registerRemotePushTokenIfNeeded()).resolves.toEqual({
      reason: 'product-does-not-need-remote-messaging',
      registered: false,
    });
  });

  it('keeps remote token registration disabled for local habit reminders', () => {
    expect(shouldRegisterRemotePushToken()).toBe(false);
  });
});
