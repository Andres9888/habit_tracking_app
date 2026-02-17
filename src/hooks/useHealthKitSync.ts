/**
 * useHealthKitSync Hook
 * Created by: Sonnet (Claude Sonnet 4.5)
 */

import { useState, useCallback } from 'react';
import { syncHealthDataWithHabits, getLastSyncTime } from '../lib/healthkit/syncEngine';
import type { SyncResult } from '../lib/healthkit/types';

interface UseHealthKitSyncOptions {
  habits: any[];
  onHabitComplete: (habitId: string) => Promise<void>;
  enabled?: boolean;
}

export function useHealthKitSync({
  habits,
  onHabitComplete,
  enabled = true,
}: UseHealthKitSyncOptions) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [lastResult, setLastResult] = useState<SyncResult | null>(null);

  // Load last sync time on mount
  useState(() => {
    getLastSyncTime().then(setLastSync);
  });

  const syncNow = useCallback(async (): Promise<SyncResult> => {
    if (!enabled || isSyncing) {
      return {
        success: false,
        habitsCompleted: [],
        errors: ['Sync disabled or already in progress'],
        timestamp: new Date(),
      };
    }

    setIsSyncing(true);
    console.log('[useHealthKitSync] Starting sync...');

    try {
      const result = await syncHealthDataWithHabits(habits, onHabitComplete);
      
      setLastResult(result);
      setLastSync(new Date());
      
      console.log(
        `[useHealthKitSync] Sync complete. Completed ${result.habitsCompleted.length} habits`
      );
      
      return result;
    } catch (error) {
      console.error('[useHealthKitSync] Sync failed:', error);
      const errorResult: SyncResult = {
        success: false,
        habitsCompleted: [],
        errors: [String(error)],
        timestamp: new Date(),
      };
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsSyncing(false);
    }
  }, [habits, onHabitComplete, enabled, isSyncing]);

  return {
    syncNow,
    isSyncing,
    lastSync,
    lastResult,
  };
}
