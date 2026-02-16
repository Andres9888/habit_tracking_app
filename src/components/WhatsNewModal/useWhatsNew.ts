/**
 * useWhatsNew Hook
 *
 * Manages version tracking and determines whether to show the What's New modal.
 * Stores last-seen version in AsyncStorage.
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CHANGELOG } from './changelog';

const STORAGE_KEY = '@chain_day/last_seen_version';

interface UseWhatsNewResult {
  shouldShow: boolean;
  currentChangelog: typeof CHANGELOG[0] | null;
  markAsSeen: () => Promise<void>;
}

export function useWhatsNew(): UseWhatsNewResult {
  const [shouldShow, setShouldShow] = useState(false);
  const [currentChangelog, setCurrentChangelog] = useState<typeof CHANGELOG[0] | null>(null);

  useEffect(() => {
    checkVersion();
  }, []);

  const checkVersion = async () => {
    try {
      const lastSeenVersion = await AsyncStorage.getItem(STORAGE_KEY);
      const latestChangelog = CHANGELOG[0]; // First entry is the latest

      if (!latestChangelog) {
        return;
      }

      // Show modal if:
      // 1. User has never seen any version (new install)
      // 2. Latest version is different from last seen
      if (!lastSeenVersion || lastSeenVersion !== latestChangelog.version) {
        setCurrentChangelog(latestChangelog);
        setShouldShow(true);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to check version:', error);
      }
    }
  };

  const markAsSeen = useCallback(async () => {
    try {
      if (currentChangelog) {
        await AsyncStorage.setItem(STORAGE_KEY, currentChangelog.version);
        setShouldShow(false);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to save version:', error);
      }
    }
  }, [currentChangelog]);

  return {
    currentChangelog,
    markAsSeen,
    shouldShow,
  };
}
