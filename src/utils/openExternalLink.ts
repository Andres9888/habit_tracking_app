/**
 * Opens a URL in an in-app browser so the user keeps their place in the app.
 *
 * Handing a link to Safari tears the user out of whatever decision they were
 * mid-way through (e.g. the sticky Add button on a template preview). The
 * in-app browser dismisses back to the exact same screen instead.
 *
 * Falls back to `Linking.openURL` when the in-app browser is unavailable
 * (web, or a URL scheme the browser can't render).
 */

import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const SAFE_SCHEME = /^https?:\/\//i;

/**
 * Only web URLs may leave the app. Template content comes from the server,
 * so a compromised or mis-edited row must not be able to launch `tel:`,
 * `sms:`, `file:` or another app's custom scheme.
 */
export function isSafeExternalUrl(
  url: string | null | undefined
): url is string {
  return typeof url === 'string' && SAFE_SCHEME.test(url.trim());
}

export async function openExternalLink(url: string): Promise<void> {
  if (!isSafeExternalUrl(url)) return;
  try {
    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      enableBarCollapsing: true,
    });
  } catch {
    await Linking.openURL(url).catch(() => undefined);
  }
}
