/**
 * HealthKit Integration Types
 * Created by: Sonnet (Claude Sonnet 4.5)
 */

export type HealthType = 'steps' | 'sleep' | 'workout';

export interface HealthMetric {
  type: HealthType;
  value: number;
  unit: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface Workout {
  id: string;
  activityType: string;
  duration: number; // seconds
  calories?: number;
  distance?: number;
  startDate: Date;
  endDate: Date;
}

export interface SleepAnalysis {
  startDate: Date;
  endDate: Date;
  value: 'InBed' | 'Asleep' | 'Awake';
  duration: number; // seconds
}

export interface StepsData {
  count: number;
  date: Date;
}

export interface HealthKitPermissions {
  steps: boolean;
  sleep: boolean;
  workouts: boolean;
}

export interface SyncResult {
  success: boolean;
  habitsCompleted: string[];
  errors?: string[];
  timestamp: Date;
}

export interface HealthHabitMapping {
  habitId: string;
  habitName: string;
  healthType: HealthType;
  threshold: number;
  unit: string;
}
