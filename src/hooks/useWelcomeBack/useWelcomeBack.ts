/**
 * useWelcomeBack Hook
 *
 * Tracks when the user last opened the app and shows a "Welcome back"
 * message with streak recovery suggestion when they return after 2+ days.
 *
 * Uses AsyncStorage to persist the last-open timestamp across sessions.
 */

import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import type { WelcomeBackConfig, WelcomeBackData } from './types';
import {
  getWelcomeBackMessage,
  getRecoverySuggestion,
  getWelcomeEmoji,
} from './messages';

const DEFAULT_STORAGE_KEY = '@chain_day/last_app_open';
const DEFAULT_MIN_DAYS = 2;

export function useWelcomeBack(
  config: WelcomeBackConfig = {}
): WelcomeBackData {
  const {
    minDaysAway = DEFAULT_MIN_DAYS,
    storageKey = DEFAULT_STORAGE_KEY,
  } = config;

  const [shouldShow, setShouldShow] = useState(false);
  const [daysAway, setDaysAway] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const checkAndUpdate = useCallback(async () => {
    try {
      const lastOpenStr = await AsyncStorage.getItem(storageKey);
      const now = Date.now();

      if (lastOpenStr) {
        const lastOpen = parseInt(lastOpenStr, 10);
        const diffMs = now - lastOpen;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays >= minDaysAway && !dismissed) {
          setDaysAway(diffDays);
          setShouldShow(true);
        }
      }

      // Always update last-open to now
      await AsyncStorage.setItem(storageKey, now.toString());
    } catch {
      // Storage errors shouldn't break the app
    }
  }, [storageKey, minDaysAway, dismissed]);

  useEffect(() => {
    checkAndUpdate();
  }, [checkAndUpdate]);

  // Also check on app resume (foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        checkAndUpdate();
      }
    });
    return () => subscription.remove();
  }, [checkAndUpdate]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    setShouldShow(false);
  }, []);

  return {
    shouldShow,
    daysAway,
    message: getWelcomeBackMessage(daysAway),
    suggestion: getRecoverySuggestion(daysAway),
    emoji: getWelcomeEmoji(daysAway),
    dismiss,
  };
}
