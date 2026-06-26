/**
 * Listens for incoming `library/<slug>` deep links (cold launch + while running)
 * and reports the slug. Matches both the custom scheme
 * (habit-tracker://library/<slug>) and the universal-link form
 * (https://chainday.app/library/<slug>) by regexing the raw URL — expo-linking
 * parses host/path differently between the two, so a regex is the robust path.
 */

import { useEffect } from 'react';
import * as Linking from 'expo-linking';

const LIBRARY_RE = /library\/([a-z0-9-]+)/i;

function slugFromUrl(url: string | null): string | null {
  if (!url) return null;
  const match = LIBRARY_RE.exec(url);
  return match ? match[1].toLowerCase() : null;
}

export function useDeepLinkListener(onSlug: (slug: string) => void): void {
  const url = Linking.useURL();

  useEffect(() => {
    const slug = slugFromUrl(url);
    if (slug) onSlug(slug);
  }, [url, onSlug]);

  useEffect(() => {
    let active = true;
    void Linking.getInitialURL().then((initial) => {
      const slug = slugFromUrl(initial);
      if (active && slug) onSlug(slug);
    });
    return () => {
      active = false;
    };
  }, [onSlug]);
}
