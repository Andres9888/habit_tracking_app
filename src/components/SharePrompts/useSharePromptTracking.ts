/**
 * useSharePromptTracking Hook
 * Manages tracking of which share prompts have been shown
 * Prevents over-prompting and respects user experience
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SharePromptTracking } from './SharePromptManager.types';

const STORAGE_KEY = '@chainday:share_prompt_tracking';
const MIN_DAYS_BETWEEN_PROMPTS = 7; // Don't prompt more than once per week

export function useSharePromptTracking() {
  const [tracking, setTracking] = useState<SharePromptTracking>({
    lastPromptDate: null,
    lastPromptedMilestone: null,
    promptedMilestones: [],
  });

  // Load tracking data on mount
  useEffect(() => {
    void (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setTracking(JSON.parse(stored) as SharePromptTracking);
        }
      } catch (error) {
        if (__DEV__) console.error('Failed to load share prompt tracking:', error);
      }
    })();
  }, []);

  // Save tracking data
  const saveTracking = useCallback(async (newTracking: SharePromptTracking) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTracking));
      setTracking(newTracking);
    } catch (error) {
      if (__DEV__) console.error('Failed to save share prompt tracking:', error);
    }
  }, []);

  // Check if we should show a prompt for this milestone
  const shouldShowPrompt = useCallback((milestone: number): boolean => {
    // Already prompted for this milestone?
    if (tracking.promptedMilestones.includes(milestone)) {
      return false;
    }

    // Respect minimum time between prompts
    if (tracking.lastPromptDate) {
      const daysSinceLastPrompt = Math.floor(
        (Date.now() - new Date(tracking.lastPromptDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceLastPrompt < MIN_DAYS_BETWEEN_PROMPTS) {
        return false;
      }
    }

    return true;
  }, [tracking]);

  // Mark a prompt as shown
  const markPromptShown = useCallback((milestone: number) => {
    const newTracking: SharePromptTracking = {
      lastPromptDate: new Date().toISOString(),
      lastPromptedMilestone: milestone,
      promptedMilestones: [...tracking.promptedMilestones, milestone],
    };
    
    void saveTracking(newTracking);
  }, [tracking, saveTracking]);

  // Reset tracking (for testing or user preference)
  const resetTracking = useCallback(() => {
    const newTracking: SharePromptTracking = {
      lastPromptDate: null,
      lastPromptedMilestone: null,
      promptedMilestones: [],
    };
    
    void saveTracking(newTracking);
  }, [saveTracking]);

  return {
    markPromptShown,
    resetTracking,
    shouldShowPrompt,
    tracking,
  };
}
