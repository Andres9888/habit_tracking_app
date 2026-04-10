/**
 * Hook to track recently viewed template IDs via AsyncStorage
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@chainday_recently_viewed_templates';
const MAX_RECENT = 5;

export function useRecentlyViewed() {
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) {
        try {
          setRecentIds(JSON.parse(data));
        } catch {
          // ignore parse errors
        }
      }
    });
  }, []);

  const addRecentlyViewed = useCallback(
    (templateId: string) => {
      setRecentIds((prev) => {
        const next = [templateId, ...prev.filter((id) => id !== templateId)].slice(
          0,
          MAX_RECENT
        );
        void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  return { recentIds, addRecentlyViewed };
}
