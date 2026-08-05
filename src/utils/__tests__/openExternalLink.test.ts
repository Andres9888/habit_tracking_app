import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import { openExternalLink } from '../openExternalLink';

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

    await expect(openExternalLink('mailto:x@example.com')).resolves.toBeUndefined();
  });

  it('ignores an empty URL', async () => {
    await openExternalLink('');

    expect(openBrowserAsync).not.toHaveBeenCalled();
    expect(openURL).not.toHaveBeenCalled();
  });
});
