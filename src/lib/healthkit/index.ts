/**
 * HealthKit Service - Main Interface
 * Created by: Sonnet (Claude Sonnet 4.5)
 */

import AppleHealthKit, {
  HealthValue,
  HealthActivitySummary,
} from 'react-native-health';
import type { StepsData, SleepAnalysis, Workout } from './types';

/**
 * Get today's step count
 */
export async function getStepsToday(): Promise<number> {
  return new Promise((resolve, reject) => {
    const options = {
      date: new Date().toISOString(),
      includeManuallyAdded: true,
    };

    AppleHealthKit.getStepCount(options, (error, results) => {
      if (error) {
        console.error('[HealthKit] Failed to fetch steps:', error);
        reject(error);
        return;
      }
      resolve(results.value || 0);
    });
  });
}

/**
 * Get sleep hours for last night (00:00 yesterday to 12:00 today)
 */
export async function getSleepHoursToday(): Promise<number> {
  return new Promise((resolve, reject) => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 1);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(now);
    endDate.setHours(12, 0, 0, 0);

    const options = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    AppleHealthKit.getSleepSamples(options, (error, results) => {
      if (error) {
        console.error('[HealthKit] Failed to fetch sleep:', error);
        reject(error);
        return;
      }

      // Calculate total sleep time (only 'Asleep' samples)
      const totalSeconds = results
        .filter((sample: any) => sample.value === 'ASLEEP')
        .reduce((sum: number, sample: any) => {
          const start = new Date(sample.startDate);
          const end = new Date(sample.endDate);
          return sum + (end.getTime() - start.getTime()) / 1000;
        }, 0);

      const hours = totalSeconds / 3600;
      resolve(hours);
    });
  });
}

/**
 * Get workouts for today
 */
export async function getWorkoutsToday(): Promise<Workout[]> {
  return new Promise((resolve, reject) => {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const options = {
      startDate: startDate.toISOString(),
      endDate: new Date().toISOString(),
    };

    AppleHealthKit.getSamples(options, (error, results) => {
      if (error) {
        console.error('[HealthKit] Failed to fetch workouts:', error);
        reject(error);
        return;
      }

      const workouts: Workout[] = results.map((sample: any) => ({
        id: sample.id || `${sample.startDate}_${sample.activityName}`,
        activityType: sample.activityName || 'Unknown',
        duration: sample.duration || 0,
        calories: sample.calories,
        distance: sample.distance,
        startDate: new Date(sample.startDate),
        endDate: new Date(sample.endDate),
      }));

      resolve(workouts);
    });
  });
}

/**
 * Fetch all health data for today (convenience method)
 */
export async function getTodayHealthData() {
  try {
    const [steps, sleepHours, workouts] = await Promise.all([
      getStepsToday(),
      getSleepHoursToday(),
      getWorkoutsToday(),
    ]);

    return {
      steps,
      sleepHours,
      workouts,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('[HealthKit] Failed to fetch health data:', error);
    throw error;
  }
}
