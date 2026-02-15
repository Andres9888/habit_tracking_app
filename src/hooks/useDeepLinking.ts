/**
 * useDeepLinking Hook
 *
 * Handles deep link URLs for the Chain Day app
 * Supports routes:
 * - habit-tracker://habit/{habitId} - Open habit detail
 * - habit-tracker://create - Open create habit modal
 * - habit-tracker://settings - Open settings
 * - habit-tracker://templates - Open templates browser
 */

import { useEffect, useCallback } from 'react';
import * as Linking from 'expo-linking';
import type { Id } from '../../convex/_generated/dataModel';

interface DeepLinkHandlers {
  onOpenHabit?: (habitId: Id<'habits'>) => void;
  onOpenCreate?: () => void;
  onOpenSettings?: () => void;
  onOpenTemplates?: () => void;
}

export function useDeepLinking({
  onOpenHabit,
  onOpenCreate,
  onOpenSettings,
  onOpenTemplates,
}: DeepLinkHandlers) {
  const handleUrl = useCallback(
    (url: string | null) => {
      if (!url) return;

      const parsed = Linking.parse(url);
      const { hostname, path, queryParams } = parsed;

      // Handle different routes
      if (hostname === 'habit' && path) {
        // habit-tracker://habit/{habitId}
        const habitId = path.replace(/^\//, '') as Id<'habits'>;
        onOpenHabit?.(habitId);
      } else if (hostname === 'create') {
        // habit-tracker://create
        onOpenCreate?.();
      } else if (hostname === 'settings') {
        // habit-tracker://settings
        onOpenSettings?.();
      } else if (hostname === 'templates') {
        // habit-tracker://templates
        onOpenTemplates?.();
      } else if (__DEV__) {
        console.log('Unknown deep link:', { hostname, path, queryParams });
      }
    },
    [onOpenHabit, onOpenCreate, onOpenSettings, onOpenTemplates]
  );

  useEffect(() => {
    // Handle initial URL (app opened from link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl(url);
      }
    });

    // Handle URLs while app is open
    const subscription = Linking.addEventListener('url', (event) => {
      handleUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleUrl]);
}

export default useDeepLinking;
