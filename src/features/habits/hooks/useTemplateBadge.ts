import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const BADGE_DISMISSED_KEY = 'template_badge_dismissed';
const BADGE_SHOWN_COUNT_KEY = 'template_badge_shown_count';

interface UseTemplateBadgeParams {
  totalHabits: number;
  hasViewedTemplates?: boolean;
}

/**
 * Smart badge logic:
 * - Show when user has 2+ habits (they're engaged)
 * - Hide if dismissed
 * - Auto-dismiss after 3 sessions
 */
export function useTemplateBadge({ totalHabits, hasViewedTemplates }: UseTemplateBadgeParams) {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    void checkBadgeVisibility();
  }, [totalHabits, hasViewedTemplates]);

  const checkBadgeVisibility = async () => {
    try {
      // Don't show if already viewed templates
      if (hasViewedTemplates) {
        setShowBadge(false);
        return;
      }

      // Don't show if user dismissed it
      const dismissed = await SecureStore.getItemAsync(BADGE_DISMISSED_KEY);
      if (dismissed === 'true') {
        setShowBadge(false);
        return;
      }

      // Show badge if user has 2+ habits (engaged user)
      if (totalHabits >= 2) {
        // Track how many times shown
        const shownCount = await SecureStore.getItemAsync(BADGE_SHOWN_COUNT_KEY);
        const count = Number.parseInt(shownCount || '0', 10);

        if (count < 3) {
          // Auto-dismiss after 3 sessions
          await SecureStore.setItemAsync(BADGE_SHOWN_COUNT_KEY, String(count + 1));
          setShowBadge(true);
        } else {
          setShowBadge(false);
        }
      } else {
        setShowBadge(false);
      }
    } catch (error) {
      if (__DEV__) console.error('Error checking badge visibility:', error);
      setShowBadge(false);
    }
  };

  const dismissBadge = async () => {
    try {
      await SecureStore.setItemAsync(BADGE_DISMISSED_KEY, 'true');
      setShowBadge(false);
    } catch (error) {
      if (__DEV__) console.error('Error dismissing badge:', error);
    }
  };

  return {
    dismissBadge,
    showBadge,
  };
}
