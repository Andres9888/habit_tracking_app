/**
 * A/B Testing & Experiments
 * 
 * Simple client-side A/B testing infrastructure for feature experiments
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ExperimentConfig, ExperimentVariant } from './types';
import { trackEvent } from './service';

const STORAGE_KEY = '@analytics/experiments';

/**
 * In-memory experiment configurations
 * In production, these would come from a remote config service
 */
const EXPERIMENTS: Record<string, ExperimentConfig> = {
  onboarding_flow: {
    id: 'onboarding_flow',
    name: 'Onboarding Flow Test',
    enabled: false, // Disabled by default - enable when ready
    variants: [
      { id: 'control', name: 'Original 3-step', weight: 50 },
      { id: 'variant_a', name: 'New 5-step', weight: 50 },
    ],
  },
  habit_card_style: {
    id: 'habit_card_style',
    name: 'Habit Card Design',
    enabled: false,
    variants: [
      { id: 'control', name: 'Current Design', weight: 50 },
      { id: 'variant_a', name: 'Minimal Design', weight: 50 },
    ],
  },
  paywall_copy: {
    id: 'paywall_copy',
    name: 'Paywall Messaging',
    enabled: false,
    variants: [
      { id: 'control', name: 'Original Copy', weight: 50 },
      { id: 'variant_a', name: 'Feature-focused', weight: 25 },
      { id: 'variant_b', name: 'Social-proof', weight: 25 },
    ],
  },
};

/**
 * Get or assign user to experiment variant
 */
export async function getExperimentVariant(
  experimentId: string,
  userId: string
): Promise<string> {
  try {
    const experiment = EXPERIMENTS[experimentId];
    
    if (!experiment || !experiment.enabled) {
      return 'control';
    }

    // Check if already assigned
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const assignments: Record<string, ExperimentVariant> = stored ? JSON.parse(stored) : {};

    if (assignments[experimentId]) {
      return assignments[experimentId].variantId;
    }

    // Assign new variant
    const variant = assignVariant(experiment, userId);
    
    assignments[experimentId] = {
      experimentId,
      variantId: variant.id,
      assignedAt: Date.now(),
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));

    // Track assignment
    trackEvent('experiment_assigned', {
      timestamp: Date.now(),
      sessionId: '', // Filled by service
      category: 'engagement',
      experimentId,
      variantId: variant.id,
      variantName: variant.name,
    });

    return variant.id;
  } catch (error) {
    if (__DEV__) {
      console.error('[Experiments] Failed to get variant:', error);
    }
    return 'control';
  }
}

/**
 * Assign variant based on weights using consistent hashing
 */
function assignVariant(
  experiment: ExperimentConfig,
  userId: string
): ExperimentConfig['variants'][0] {
  // Use consistent hashing for stable assignments
  const hash = hashString(`${experiment.id}:${userId}`);
  const bucket = hash % 100;

  let cumulative = 0;
  for (const variant of experiment.variants) {
    cumulative += variant.weight;
    if (bucket < cumulative) {
      return variant;
    }
  }

  // Fallback to control
  return experiment.variants[0];
}

/**
 * Simple string hash function
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Track experiment exposure (user saw the variant)
 */
export function trackExperimentExposure(experimentId: string, variantId: string): void {
  trackEvent('experiment_exposure', {
    timestamp: Date.now(),
    sessionId: '', // Filled by service
    category: 'engagement',
    priority: 'high',
    experimentId,
    variantId,
  });
}

/**
 * Track experiment goal conversion
 */
export function trackExperimentGoal(
  experimentId: string,
  variantId: string,
  goalName: string,
  metadata?: Record<string, unknown>
): void {
  trackEvent('experiment_goal', {
    timestamp: Date.now(),
    sessionId: '', // Filled by service
    category: 'conversion',
    priority: 'critical',
    experimentId,
    variantId,
    goalName,
    ...metadata,
  });
}

/**
 * Get all active experiment assignments
 */
export async function getActiveExperiments(): Promise<Record<string, string>> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return {};

    const assignments: Record<string, ExperimentVariant> = JSON.parse(stored);
    
    return Object.fromEntries(
      Object.entries(assignments).map(([id, variant]) => [id, variant.variantId])
    );
  } catch (error) {
    if (__DEV__) {
      console.error('[Experiments] Failed to get experiments:', error);
    }
    return {};
  }
}

/**
 * Force reset all experiment assignments (for testing)
 */
export async function resetExperiments(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    if (__DEV__) {
      console.log('[Experiments] All assignments reset');
    }
  } catch (error) {
    if (__DEV__) {
      console.error('[Experiments] Failed to reset:', error);
    }
  }
}

/**
 * Hook-friendly wrapper for getting experiment variant
 */
export function useExperiment(experimentId: string, userId: string): {
  variant: string;
  isControl: boolean;
  trackExposure: () => void;
  trackGoal: (goalName: string, metadata?: Record<string, unknown>) => void;
} {
  const [variant, setVariant] = React.useState<string>('control');

  React.useEffect(() => {
    getExperimentVariant(experimentId, userId).then(setVariant);
  }, [experimentId, userId]);

  const trackExposureCallback = React.useCallback(() => {
    trackExperimentExposure(experimentId, variant);
  }, [experimentId, variant]);

  const trackGoalCallback = React.useCallback(
    (goalName: string, metadata?: Record<string, unknown>) => {
      trackExperimentGoal(experimentId, variant, goalName, metadata);
    },
    [experimentId, variant]
  );

  return {
    variant,
    isControl: variant === 'control',
    trackExposure: trackExposureCallback,
    trackGoal: trackGoalCallback,
  };
}

// React import for hook
import React from 'react';
