/**
 * useHealthKitPermissions Hook
 * Created by: Sonnet (Claude Sonnet 4.5)
 */

import { useState, useEffect } from 'react';
import {
  isHealthKitAvailable,
  requestPermissions,
  getPermissionStatus,
} from '../lib/healthkit/permissions';
import type { HealthKitPermissions } from '../lib/healthkit/types';

export function useHealthKitPermissions() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [permissions, setPermissions] = useState<HealthKitPermissions>({
    steps: false,
    sleep: false,
    workouts: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAvailability();
  }, []);

  async function checkAvailability() {
    setIsLoading(true);
    try {
      const available = await isHealthKitAvailable();
      setIsAvailable(available);

      if (available) {
        const status = await getPermissionStatus();
        setPermissions(status);
      }
    } catch (error) {
      console.error('[useHealthKitPermissions] Check failed:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function requestAccess(): Promise<boolean> {
    if (!isAvailable) {
      return false;
    }

    try {
      const granted = await requestPermissions();
      if (granted) {
        setPermissions({
          steps: true,
          sleep: true,
          workouts: true,
        });
      }
      return granted;
    } catch (error) {
      console.error('[useHealthKitPermissions] Request failed:', error);
      return false;
    }
  }

  const hasPermission = permissions.steps || permissions.sleep || permissions.workouts;

  return {
    isAvailable,
    hasPermission,
    permissions,
    isLoading,
    requestAccess,
    refresh: checkAvailability,
  };
}
