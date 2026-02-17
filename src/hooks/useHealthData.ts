/**
 * useHealthData Hook - Fetch health metrics for UI display
 * Created by: Sonnet (Claude Sonnet 4.5)
 */

import { useState, useEffect } from 'react';
import { getStepsToday, getSleepHoursToday, getWorkoutsToday } from '../lib/healthkit';
import { detectHealthType, extractThreshold } from '../lib/healthkit/syncEngine';
import type { HealthMetric, HealthType } from '../lib/healthkit/types';

interface UseHealthDataOptions {
  habitName: string;
  enabled?: boolean;
  refreshInterval?: number; // ms
}

interface HealthDataState {
  current: number;
  goal: number;
  unit: string;
  percentage: number;
  type: HealthType | null;
}

export function useHealthData({
  habitName,
  enabled = true,
  refreshInterval = 60000, // 1 minute default
}: UseHealthDataOptions) {
  const [data, setData] = useState<HealthDataState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    fetchHealthData();

    // Set up refresh interval
    const interval = setInterval(fetchHealthData, refreshInterval);
    return () => clearInterval(interval);
  }, [habitName, enabled, refreshInterval]);

  async function fetchHealthData() {
    setIsLoading(true);
    setError(null);

    try {
      const healthType = detectHealthType(habitName);
      
      if (!healthType) {
        setData(null);
        setIsLoading(false);
        return;
      }

      const goal = extractThreshold(habitName, healthType);
      let current = 0;
      let unit = '';

      switch (healthType) {
        case 'steps': {
          current = await getStepsToday();
          unit = 'steps';
          break;
        }
        case 'sleep': {
          current = await getSleepHoursToday();
          unit = 'hours';
          break;
        }
        case 'workout': {
          const workouts = await getWorkoutsToday();
          if (goal === 1) {
            current = workouts.length;
            unit = 'workouts';
          } else {
            current = workouts.reduce((sum, w) => sum + w.duration, 0) / 60; // Convert to minutes
            unit = 'minutes';
          }
          break;
        }
      }

      const percentage = Math.min((current / goal) * 100, 100);

      setData({
        current,
        goal,
        unit,
        percentage,
        type: healthType,
      });
    } catch (err) {
      console.error('[useHealthData] Fetch failed:', err);
      setError(String(err));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    data,
    isLoading,
    error,
    refresh: fetchHealthData,
  };
}
