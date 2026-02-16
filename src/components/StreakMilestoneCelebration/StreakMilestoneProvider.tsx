/* eslint-disable max-lines */
/**
 * StreakMilestoneProvider
 * Global provider for managing streak milestone celebrations
 */

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { StreakMilestoneCelebration } from './StreakMilestoneCelebration';
import { ShareCardGenerator } from '../ShareCardGenerator';
import { useCelebrationHandlers } from './useCelebrationHandlers';


interface StreakMilestoneContextValue {
  checkAndCelebrate: (
    habitId: string,
    habitName: string,
    habitEmoji: string,
    previousStreak: number,
    currentStreak: number
  ) => void;
}

const StreakMilestoneContext =
  createContext<StreakMilestoneContextValue | null>(null);

interface StreakMilestoneProviderProps {
  children: ReactNode;
  userName?: string;
}

const MILESTONE_MESSAGES: Record<7 | 30 | 100, string> = {
  7: '7 days strong. Small daily wins build unstoppable momentum.',
  30: '30-day streak unlocked. Your consistency is becoming your identity.',
  100: '100 days in a row. This is elite follow-through.',
};

export function StreakMilestoneProvider({
  children,
  userName = '',
}: StreakMilestoneProviderProps) {
  const {
    celebrationData,
    shareData,
    showShareCard,
    checkAndCelebrate,
    handleClose,
    handleShare,
    handleShareClose,
  } = useCelebrationHandlers(userName);


  const contextValue = useMemo<StreakMilestoneContextValue>(
    () => ({
      checkAndCelebrate,
    }),
    [checkAndCelebrate]
  );

  return (
    <StreakMilestoneContext.Provider value={contextValue}>
      {children}

      {celebrationData && (
        <StreakMilestoneCelebration
          habitEmoji={celebrationData.habitEmoji}
          habitName={celebrationData.habitName}
          milestone={celebrationData.milestone}
          streakDays={celebrationData.streakDays}
          visible={!!celebrationData}
          onClose={handleClose}
          onShare={handleShare}
        />
      )}

      {shareData && (
        <ShareCardGenerator
          data={shareData}
          visible={showShareCard}
          onClose={handleShareClose}
        />
      )}
    </StreakMilestoneContext.Provider>
  );
}

export function useStreakMilestone(): StreakMilestoneContextValue {
  const context = useContext(StreakMilestoneContext);

  if (!context) {
    throw new Error(
      'useStreakMilestone must be used within a StreakMilestoneProvider'
    );
  }

  return context;
}

export default StreakMilestoneProvider;
