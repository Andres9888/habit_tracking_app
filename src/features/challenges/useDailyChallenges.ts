/**
 * useDailyChallenges Hook
 *
 * Manages the daily challenge lifecycle: assignment, progress tracking,
 * completion, dismissal, and XP rewards. Persists state in AsyncStorage.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { selectDailyChallenge } from './challengeDefinitions';
import type {
  ChallengeProgress,
  ChallengeCompletion,
  DailyChallengeState,
} from './types';

const STORAGE_KEY = '@daily_challenges_state';

function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

const DEFAULT_STATE: DailyChallengeState = {
  activeChallenge: null,
  completions: [],
  totalXpEarned: 0,
  optedIn: true,
};

export function useDailyChallenges(isPremiumUser: boolean) {
  const [state, setState] = useState<DailyChallengeState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted state
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: DailyChallengeState = JSON.parse(raw);
          setState(parsed);
        }
      } catch {
        // Silently fall back to defaults
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Persist state changes
  const persistState = useCallback(async (next: DailyChallengeState) => {
    setState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Best-effort persistence
    }
  }, []);

  // Assign today's challenge if needed
  useEffect(() => {
    if (isLoading || !state.optedIn) return;

    const today = getTodayISO();
    const active = state.activeChallenge;

    // Already have today's challenge
    if (active && active.assignedDate === today && !active.completed) return;

    const recentCompletions = state.completions
      .slice(-10)
      .map((c) => c.challengeId);

    const challenge = selectDailyChallenge(isPremiumUser, recentCompletions);

    const newProgress: ChallengeProgress = {
      challengeId: challenge.id,
      assignedDate: today,
      currentProgress: 0,
      targetProgress: challenge.durationDays,
      completed: false,
      dismissed: false,
    };

    void persistState({ ...state, activeChallenge: newProgress });
  }, [isLoading, state, isPremiumUser, persistState]);

  const completeChallenge = useCallback(
    (xpReward: number) => {
      if (!state.activeChallenge || state.activeChallenge.completed) return;

      const completion: ChallengeCompletion = {
        challengeId: state.activeChallenge.challengeId,
        completedDate: getTodayISO(),
        xpEarned: xpReward,
      };

      void persistState({
        ...state,
        activeChallenge: {
          ...state.activeChallenge,
          completed: true,
          completedDate: getTodayISO(),
          currentProgress: state.activeChallenge.targetProgress,
        },
        completions: [...state.completions, completion],
        totalXpEarned: state.totalXpEarned + xpReward,
      });
    },
    [state, persistState],
  );

  const updateProgress = useCallback(
    (increment: number = 1) => {
      if (!state.activeChallenge || state.activeChallenge.completed) return;

      const newProgress = Math.min(
        state.activeChallenge.currentProgress + increment,
        state.activeChallenge.targetProgress,
      );

      void persistState({
        ...state,
        activeChallenge: {
          ...state.activeChallenge,
          currentProgress: newProgress,
        },
      });
    },
    [state, persistState],
  );

  const dismissChallenge = useCallback(() => {
    if (!state.activeChallenge) return;

    void persistState({
      ...state,
      activeChallenge: {
        ...state.activeChallenge,
        dismissed: true,
      },
    });
  }, [state, persistState]);

  const toggleOptIn = useCallback(() => {
    void persistState({
      ...state,
      optedIn: !state.optedIn,
    });
  }, [state, persistState]);

  return useMemo(
    () => ({
      activeChallenge: state.activeChallenge,
      completions: state.completions,
      totalXpEarned: state.totalXpEarned,
      optedIn: state.optedIn,
      isLoading,
      completeChallenge,
      updateProgress,
      dismissChallenge,
      toggleOptIn,
    }),
    [
      state.activeChallenge,
      state.completions,
      state.totalXpEarned,
      state.optedIn,
      isLoading,
      completeChallenge,
      updateProgress,
      dismissChallenge,
      toggleOptIn,
    ],
  );
}
