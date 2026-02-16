/**
 * useStreakMilestoneUpsell Hook
 *
 * Triggers premium upsell prompts at natural streak milestones:
 * - After 3 days of consistent use ("You're on a roll!")
 * - After completing a 7-day streak (celebration → unlock unlimited)
 *
 * Uses AsyncStorage to track which milestones have been shown,
 * so each prompt only fires once per user.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@chain_day/streak_milestones_shown';

export type StreakMilestone = 'three_day_roll' | 'seven_day_streak';

interface MilestoneConfig {
  key: StreakMilestone;
  threshold: number;
  title: string;
  message: string;
  ctaText: string;
  emoji: string;
}

const MILESTONES: MilestoneConfig[] = [
  {
    key: 'three_day_roll',
    threshold: 3,
    title: "You're on a roll! 🔥",
    message:
      "3 days strong — you're building real momentum. Premium members stay consistent 2× longer with smart reminders and unlimited habits.",
    ctaText: 'Keep the Momentum',
    emoji: '🔥',
  },
  {
    key: 'seven_day_streak',
    threshold: 7,
    title: '7-Day Streak! 🎉',
    message:
      "One full week — that's incredible discipline. Unlock unlimited habits to build on this foundation and track every area of your life.",
    ctaText: 'Unlock Unlimited Habits',
    emoji: '🎉',
  },
];

interface UseStreakMilestoneUpsellParams {
  /** Current longest streak across all habits */
  currentStreak: number;
  /** Whether user is already premium */
  isPremium: boolean;
  /** Whether the feature is enabled */
  enabled?: boolean;
}

interface UseStreakMilestoneUpsellReturn {
  /** The milestone to show, if any */
  pendingMilestone: MilestoneConfig | null;
  /** Dismiss the current milestone (marks as shown) */
  dismissMilestone: () => void;
  /** Accept the milestone CTA (marks as shown, returns true to open paywall) */
  acceptMilestone: () => boolean;
}

export function useStreakMilestoneUpsell({
  currentStreak,
  isPremium,
  enabled = true,
}: UseStreakMilestoneUpsellParams): UseStreakMilestoneUpsellReturn {
  const [shownMilestones, setShownMilestones] = useState<Set<string>>(
    new Set()
  );
  const [pendingMilestone, setPendingMilestone] =
    useState<MilestoneConfig | null>(null);
  const loadedRef = useRef(false);

  // Load shown milestones from storage
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    void (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setShownMilestones(new Set(JSON.parse(stored) as string[]));
        }
      } catch {
        // Ignore storage errors
      }
    })();
  }, []);

  // Check for eligible milestones when streak changes
  useEffect(() => {
    if (!enabled || isPremium || pendingMilestone) return;

    // Find the highest eligible milestone not yet shown
    const eligible = MILESTONES.filter(
      (m) => currentStreak >= m.threshold && !shownMilestones.has(m.key)
    ).sort((a, b) => b.threshold - a.threshold);

    if (eligible.length > 0) {
      setPendingMilestone(eligible[0]);
    }
  }, [currentStreak, isPremium, enabled, shownMilestones, pendingMilestone]);

  const markShown = useCallback(
    (key: string) => {
      const updated = new Set(shownMilestones);
      updated.add(key);
      setShownMilestones(updated);
      setPendingMilestone(null);

      void AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(updated))
      ).catch(() => {});
    },
    [shownMilestones]
  );

  const dismissMilestone = useCallback(() => {
    if (pendingMilestone) {
      markShown(pendingMilestone.key);
    }
  }, [pendingMilestone, markShown]);

  const acceptMilestone = useCallback(() => {
    if (pendingMilestone) {
      markShown(pendingMilestone.key);
      return true;
    }
    return false;
  }, [pendingMilestone, markShown]);

  return {
    pendingMilestone: isPremium ? null : pendingMilestone,
    dismissMilestone,
    acceptMilestone,
  };
}
