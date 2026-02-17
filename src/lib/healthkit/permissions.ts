/**
 * HealthKit Permissions Manager
 * Created by: Sonnet (Claude Sonnet 4.5)
 */

import AppleHealthKit, {
  HealthKitPermissions as RNHealthKitPermissions,
} from 'react-native-health';
import { Platform } from 'react-native';
import type { HealthKitPermissions } from './types';

const PERMISSIONS: RNHealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
      AppleHealthKit.Constants.Permissions.Workout,
    ],
    write: [], // We don't write to HealthKit
  },
};

/**
 * Check if HealthKit is available on this device
 */
export async function isHealthKitAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    return false;
  }

  return new Promise((resolve) => {
    AppleHealthKit.isAvailable((error, available) => {
      if (error) {
        console.error('[HealthKit] Availability check failed:', error);
        resolve(false);
        return;
      }
      resolve(available);
    });
  });
}

/**
 * Request HealthKit permissions
 */
export async function requestPermissions(): Promise<boolean> {
  const available = await isHealthKitAvailable();
  if (!available) {
    return false;
  }

  return new Promise((resolve) => {
    AppleHealthKit.initHealthKit(PERMISSIONS, (error) => {
      if (error) {
        console.error('[HealthKit] Permission request failed:', error);
        resolve(false);
        return;
      }
      console.log('[HealthKit] Permissions granted');
      resolve(true);
    });
  });
}

/**
 * Check current permission status
 */
export async function getPermissionStatus(): Promise<HealthKitPermissions> {
  // Note: HealthKit doesn't provide a way to check exact permission status
  // We can only know if initialization succeeded
  // This is a simplified version - in production, track in AsyncStorage
  
  return {
    steps: true, // Assume granted if init succeeded
    sleep: true,
    workouts: true,
  };
}

/**
 * Initialize HealthKit (call on app start if user has enabled sync)
 */
export async function initializeHealthKit(): Promise<boolean> {
  try {
    const available = await isHealthKitAvailable();
    if (!available) {
      return false;
    }

    return await requestPermissions();
  } catch (error) {
    console.error('[HealthKit] Initialization failed:', error);
    return false;
  }
}
