/**
 * Deep Linking Hook
 * Handles app deep links for habit import and other features
 */
import { useEffect, useCallback, useRef } from 'react';
import { Linking } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { parseShareLink } from '../lib/habitShare';

export interface DeepLinkHandlers {
  onHabitImport?: (habitId: string) => void;
  onError?: (error: string) => void;
}

/**
 * Hook to handle deep linking throughout the app lifecycle
 */
export function useDeepLinking(handlers: DeepLinkHandlers = {}) {
  const importShared = useMutation(api.habits.importShared);
  const isProcessing = useRef(false);

  const handleUrl = useCallback(
    async (url: string) => {
      if (isProcessing.current) {
        return;
      }

      try {
        isProcessing.current = true;

        // Check if it's a habit import URL
        if (url.includes('import')) {
          const habitData = parseShareLink(url);

          if (!habitData) {
            handlers.onError?.('Invalid habit share link');
            return;
          }

          // Import the habit
          const habitId = await importShared(habitData);

          handlers.onHabitImport?.(habitId);
        }
      } catch (error) {
        console.error('Deep link error:', error);
        handlers.onError?.(
          error instanceof Error ? error.message : 'Failed to import habit'
        );
      } finally {
        isProcessing.current = false;
      }
    },
    [importShared, handlers]
  );

  useEffect(() => {
    // Handle initial URL (app opened from link)
    const handleInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        await handleUrl(initialUrl);
      }
    };

    void handleInitialUrl();

    // Handle URLs while app is running
    const subscription = Linking.addEventListener('url', (event) => {
      void handleUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleUrl]);

  return { handleUrl };
}
