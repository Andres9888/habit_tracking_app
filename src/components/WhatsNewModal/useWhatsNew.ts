/**
 * Hook to manage "What's New" modal visibility.
 * Compares current app version against the last dismissed version
 * stored in AsyncStorage. Shows modal only after OTA updates.
 */

import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLatestChangelog } from './changelog';

const STORAGE_KEY = '@chainday/whats_new_dismissed_version';

export function useWhatsNew() {
  const [visible, setVisible] = useState(false);
  const latestChangelog = getLatestChangelog();
  const currentVersion = latestChangelog?.version;

  useEffect(() => {
    if (!currentVersion) return;

    let cancelled = false;

    async function check() {
      try {
        const dismissed = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && dismissed !== currentVersion) {
          setVisible(true);
        }
      } catch {
        // Silently fail — don't block app startup
      }
    }

    check();

    return () => {
      cancelled = true;
    };
  }, [currentVersion]);

  const dismiss = useCallback(async () => {
    setVisible(false);
    if (currentVersion) {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, currentVersion);
      } catch {
        // Best-effort persist
      }
    }
  }, [currentVersion]);

  return { visible, dismiss, changelog: latestChangelog };
}
