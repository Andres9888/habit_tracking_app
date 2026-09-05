import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import { isSafeExternalUrl, openExternalLink } from '../openExternalLink';

jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn(),
  WebBrowserPresentationStyle: { PAGE_SHEET: 'pageSheet' },
}));

const openBrowserAsync = WebBrowser.openBrowserAsync as jest.Mock;

describe('openExternalLink', () => {
  let openURL: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
  });

  afterEach(() => {
    openURL.mockRestore();
  });

  it('opens the URL in the in-app browser', async () => {
    openBrowserAsync.mockResolvedValue({ type: 'dismiss' });

    await openExternalLink('https://example.com/paper');

    expect(openBrowserAsync).toHaveBeenCalledWith(
      'https://example.com/paper',
      expect.objectContaining({ presentationStyle: 'pageSheet' })
    );
    expect(openURL).not.toHaveBeenCalled();
  });

  it('falls back to Linking when the in-app browser fails', async () => {
    openBrowserAsync.mockRejectedValue(new Error('unsupported'));

    await openExternalLink('https://example.com/paper');

    expect(openURL).toHaveBeenCalledWith('https://example.com/paper');
  });

  it('swallows a failing fallback instead of throwing', async () => {
    openBrowserAsync.mockRejectedValue(new Error('unsupported'));
    openURL.mockRejectedValue(new Error('no handler'));

    await expect(
      openExternalLink('https://example.com')
    ).resolves.toBeUndefined();
  });

  it('ignores an empty URL', async () => {
    await openExternalLink('');

    expect(openBrowserAsync).not.toHaveBeenCalled();
    expect(openURL).not.toHaveBeenCalled();
  });

  it.each(['tel:+15555551234', 'file:///etc/passwd', 'habit-tracker://x'])(
    'refuses to open non-web scheme %s',
    async (url) => {
      await openExternalLink(url);

      expect(openBrowserAsync).not.toHaveBeenCalled();
      expect(openURL).not.toHaveBeenCalled();
    }
  );
});

describe('isSafeExternalUrl', () => {
  it.each([
    'https://example.com/paper',
    'http://youtu.be/abc',
    ' HTTPS://x.y ',
  ])('accepts web URL %s', (url) => expect(isSafeExternalUrl(url)).toBe(true));

  it.each([
    'tel:+15555551234',
    'sms:5555551234',
    'file:///etc/passwd',
    'javascript:alert(1)',
    'habit-tracker://sso-callback',
    'app-settings:',
    '',
    undefined,
    null,
  ])('rejects %s', (url) => expect(isSafeExternalUrl(url)).toBe(false));
});
