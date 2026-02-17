/**
 * useMilestoneGalleryData
 * Loads all milestone achievements from AsyncStorage and maps them
 * to gallery card data (achieved vs locked).
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GALLERY_MILESTONES,
  GALLERY_STORAGE_KEY,
} from './constants';
import type {
  MilestoneAchievement,
  MilestoneCardData,
  UseMilestoneGalleryDataReturn,
} from './types';

function parseAchievements(raw: string | null): MilestoneAchievement[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is MilestoneAchievement =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as MilestoneAchievement).days === 'number' &&
        typeof (item as MilestoneAchievement).dateAchieved === 'string' &&
        typeof (item as MilestoneAchievement).habitName === 'string'
    );
  } catch {
    return [];
  }
}

export function useMilestoneGalleryData(): UseMilestoneGalleryDataReturn {
  const [achievements, setAchievements] = useState<MilestoneAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAchievements = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(GALLERY_STORAGE_KEY);
      setAchievements(parseAchievements(stored));
    } catch (error) {
      if (__DEV__) console.warn('[MilestoneGallery] Failed to load achievements:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAchievements();
  }, [loadAchievements]);

  const cards: MilestoneCardData[] = GALLERY_MILESTONES.map((milestone) => {
    const achievement = achievements.find((a) => a.days === milestone.days);
    return {
      achieved: !!achievement,
      achievement,
      milestone,
    };
  });

  const achievedCount = cards.filter((c) => c.achieved).length;

  return { achievedCount, cards, isLoading };
}

/**
 * Save a new milestone achievement to the gallery.
 * Called when a streak milestone celebration is shown.
 */
export async function recordMilestoneAchievement(
  achievement: MilestoneAchievement
): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(GALLERY_STORAGE_KEY);
    const existing = parseAchievements(stored);

    // Only record once per milestone day value
    if (existing.some((a) => a.days === achievement.days)) return;

    const updated = [...existing, achievement];
    await AsyncStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    if (__DEV__) console.warn('[MilestoneGallery] Failed to save achievement:', error);
  }
}
