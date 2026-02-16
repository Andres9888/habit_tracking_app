/**
 * Feature Flags
 * 
 * Remote feature toggles for gradual rollouts and kill switches
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { trackEvent } from './service';
import type { FeatureFlag } from './types';

const STORAGE_KEY = '@analytics/feature_flags';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface FeatureFlagCache {
  flags: Record<string, FeatureFlag>;
  lastFetch: number;
}

/**
 * Default feature flags (fallback if remote fetch fails)
 * In production, these would be fetched from a remote config service
 */
const DEFAULT_FLAGS: Record<string, FeatureFlag> = {
  premium_templates: {
    id: 'premium_templates',
    enabled: true,
    rolloutPercentage: 100,
  },
  ai_habit_suggestions: {
    id: 'ai_habit_suggestions',
    enabled: false,
    rolloutPercentage: 0,
  },
  social_features: {
    id: 'social_features',
    enabled: false,
    rolloutPercentage: 0,
  },
  advanced_analytics: {
    id: 'advanced_analytics',
    enabled: true,
    rolloutPercentage: 100,
    enabledForSegments: ['power_user'],
  },
  new_paywall: {
    id: 'new_paywall',
    enabled: false,
    rolloutPercentage: 10, // 10% rollout
  },
};

let flagCache: FeatureFlagCache | null = null;

/**
 * Fetch feature flags (with caching)
 */
async function fetchFlags(): Promise<Record<string, FeatureFlag>> {
  try {
    // Check cache
    if (flagCache && Date.now() - flagCache.lastFetch < CACHE_TTL) {
      return flagCache.flags;
    }

    // Try to load from storage
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const cache: FeatureFlagCache = JSON.parse(stored);
      if (Date.now() - cache.lastFetch < CACHE_TTL) {
        flagCache = cache;
        return cache.flags;
      }
    }

    // In production, fetch from remote config service
    // For now, use defaults
    const flags = DEFAULT_FLAGS;

    // Update cache
    flagCache = {
      flags,
      lastFetch: Date.now(),
    };

    // Persist to storage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(flagCache));

    return flags;
  } catch (error) {
    if (__DEV__) {
      console.error('[FeatureFlags] Failed to fetch flags:', error);
    }
    return DEFAULT_FLAGS;
  }
}

/**
 * Check if feature is enabled for user
 */
export async function isFeatureEnabled(
  flagId: string,
  userId?: string,
  userSegment?: string
): Promise<boolean> {
  try {
    const flags = await fetchFlags();
    const flag = flags[flagId];

    if (!flag) {
      if (__DEV__) {
        console.warn(`[FeatureFlags] Flag not found: ${flagId}`);
      }
      return false;
    }

    // Check if flag is globally disabled
    if (!flag.enabled) {
      return false;
    }

    // Check user-specific allowlist
    if (flag.enabledForUserIds && userId) {
      if (flag.enabledForUserIds.includes(userId)) {
        trackFlagCheck(flagId, true, 'allowlist');
        return true;
      }
    }

    // Check segment-specific
    if (flag.enabledForSegments && userSegment) {
      if (flag.enabledForSegments.includes(userSegment)) {
        trackFlagCheck(flagId, true, 'segment');
        return true;
      }
    }

    // Check rollout percentage
    if (flag.rolloutPercentage !== undefined && userId) {
      const isInRollout = checkRollout(flagId, userId, flag.rolloutPercentage);
      trackFlagCheck(flagId, isInRollout, 'rollout');
      return isInRollout;
    }

    // Default to flag enabled state
    trackFlagCheck(flagId, flag.enabled, 'default');
    return flag.enabled;
  } catch (error) {
    if (__DEV__) {
      console.error('[FeatureFlags] Check failed:', error);
    }
    return false;
  }
}

/**
 * Check if user is in rollout percentage
 */
function checkRollout(flagId: string, userId: string, percentage: number): boolean {
  if (percentage <= 0) return false;
  if (percentage >= 100) return true;

  // Use consistent hashing
  const hash = hashString(`${flagId}:${userId}`);
  const bucket = hash % 100;
  return bucket < percentage;
}

/**
 * Simple string hash
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Track feature flag check
 */
function trackFlagCheck(flagId: string, enabled: boolean, reason: string): void {
  trackEvent('feature_flag_check', {
    timestamp: Date.now(),
    sessionId: '', // Filled by service
    category: 'feature_usage',
    flagId,
    enabled,
    reason,
  });
}

/**
 * Get all enabled features for user
 */
export async function getEnabledFeatures(
  userId?: string,
  userSegment?: string
): Promise<string[]> {
  try {
    const flags = await fetchFlags();
    const enabled: string[] = [];

    for (const [flagId, flag] of Object.entries(flags)) {
      const isEnabled = await isFeatureEnabled(flagId, userId, userSegment);
      if (isEnabled) {
        enabled.push(flagId);
      }
    }

    return enabled;
  } catch (error) {
    if (__DEV__) {
      console.error('[FeatureFlags] Failed to get enabled features:', error);
    }
    return [];
  }
}

/**
 * Force refresh feature flags
 */
export async function refreshFeatureFlags(): Promise<void> {
  flagCache = null;
  await AsyncStorage.removeItem(STORAGE_KEY);
  await fetchFlags();
}

/**
 * React hook for feature flags
 */
export function useFeatureFlag(
  flagId: string,
  userId?: string,
  userSegment?: string
): { enabled: boolean; loading: boolean } {
  const [enabled, setEnabled] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    isFeatureEnabled(flagId, userId, userSegment)
      .then((result) => {
        setEnabled(result);
        setLoading(false);
      })
      .catch((error) => {
        if (__DEV__) {
          console.error('[FeatureFlags] Hook error:', error);
        }
        setEnabled(false);
        setLoading(false);
      });
  }, [flagId, userId, userSegment]);

  return { enabled, loading };
}

// React import
import React from 'react';
