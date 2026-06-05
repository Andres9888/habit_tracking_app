import { useCallback, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export const HABIT_CARD_DETAIL_HINT_DISMISSED_KEY =
  'habit_card_detail_hint_dismissed';
export const HABIT_CARD_DETAIL_OPENED_ONCE_KEY =
  'habit_card_detail_opened_once';

/**
 * Dev-only: force the coach banner and first-card chevron nudge on without
 * clearing SecureStore. Set to `false` when done previewing.
 *
 * Skipped under Jest (`typeof jest !== 'undefined'`) so unit tests stay valid.
 */
export const DEV_FORCE_SHOW_HABIT_CARD_DETAIL_HINT =
  __DEV__ && typeof jest === 'undefined' && false;

interface UseHabitCardDetailHintParams {
  totalHabits: number;
}

export function useHabitCardDetailHint({
  totalHabits,
}: UseHabitCardDetailHintParams) {
  const [showDetailHint, setShowDetailHint] = useState(false);

  const refreshHintVisibility = useCallback(async () => {
    try {
      if (totalHabits < 1) {
        setShowDetailHint(false);
        return;
      }

      if (DEV_FORCE_SHOW_HABIT_CARD_DETAIL_HINT) {
        setShowDetailHint(true);
        return;
      }

      const [dismissed, openedOnce] = await Promise.all([
        SecureStore.getItemAsync(HABIT_CARD_DETAIL_HINT_DISMISSED_KEY),
        SecureStore.getItemAsync(HABIT_CARD_DETAIL_OPENED_ONCE_KEY),
      ]);

      setShowDetailHint(dismissed !== 'true' && openedOnce !== 'true');
    } catch (error) {
      if (__DEV__) console.error('Error checking habit detail hint:', error);
      setShowDetailHint(false);
    }
  }, [totalHabits]);

  useEffect(() => {
    void refreshHintVisibility();
  }, [refreshHintVisibility]);

  const dismissDetailHint = useCallback(async () => {
    setShowDetailHint(false);
    if (DEV_FORCE_SHOW_HABIT_CARD_DETAIL_HINT) {
      return;
    }
    try {
      await SecureStore.setItemAsync(
        HABIT_CARD_DETAIL_HINT_DISMISSED_KEY,
        'true'
      );
    } catch (error) {
      if (__DEV__) console.error('Error dismissing habit detail hint:', error);
    }
  }, []);

  const markDetailOpened = useCallback(async () => {
    setShowDetailHint(false);
    if (DEV_FORCE_SHOW_HABIT_CARD_DETAIL_HINT) {
      return;
    }
    try {
      await SecureStore.setItemAsync(HABIT_CARD_DETAIL_OPENED_ONCE_KEY, 'true');
    } catch (error) {
      if (__DEV__) console.error('Error marking habit detail opened:', error);
    }
  }, []);

  return {
    dismissDetailHint,
    markDetailOpened,
    showDetailHint,
  };
}
