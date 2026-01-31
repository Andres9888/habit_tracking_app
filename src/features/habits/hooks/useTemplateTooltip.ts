import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

const TOOLTIP_STORAGE_KEY = 'template_tooltip_shown';

interface UseTemplateTooltipReturn {
  dismissTooltip: () => void;
  showTooltip: boolean;
}

/**
 * Hook to manage the first-time template tooltip
 * Shows tooltip on first app launch, then never again after dismissal
 */
export const useTemplateTooltip = (): UseTemplateTooltipReturn => {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const checkTooltipStatus = async () => {
      try {
        const hasSeenTooltip = await SecureStore.getItemAsync(TOOLTIP_STORAGE_KEY);

        // Show tooltip only if user hasn't seen it before
        if (hasSeenTooltip === null) {
          // Add a small delay so it appears after the screen renders
          setTimeout(() => {
            setShowTooltip(true);
          }, 800);
        }
      } catch (error) {
        if (__DEV__) {
          console.error('Error checking tooltip status:', error);
        }
      }
    };

    checkTooltipStatus();
  }, []);

  const dismissTooltip = useCallback(async () => {
    try {
      await SecureStore.setItemAsync(TOOLTIP_STORAGE_KEY, 'true');
      setShowTooltip(false);
    } catch (error) {
      if (__DEV__) {
        console.error('Error dismissing tooltip:', error);
      }
      // Still hide it even if storage fails
      setShowTooltip(false);
    }
  }, []);

  return {
    dismissTooltip,
    showTooltip,
  };
};

