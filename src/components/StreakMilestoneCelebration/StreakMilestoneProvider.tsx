/**
 * StreakMilestoneProvider
 * Global provider for managing streak milestone celebrations
 */

import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { StreakMilestoneCelebration } from './StreakMilestoneCelebration';
import { ShareCardGenerator } from '../ShareCardGenerator';
import { useMilestoneHandlers } from './useMilestoneHandlers';

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

export function StreakMilestoneProvider({
  children,
  userName = '',
}: StreakMilestoneProviderProps) {
  const {
    celebrationData,
    checkAndCelebrate,
    handleClose,
    handleShare,
    handleShareClose,
    shareData,
    showShareCard,
  } = useMilestoneHandlers(userName);

  const contextValue = useMemo<StreakMilestoneContextValue>(
    () => ({ checkAndCelebrate }),
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
  if (!context)
    throw new Error(
      'useStreakMilestone must be used within a StreakMilestoneProvider'
    );
  return context;
}

export default StreakMilestoneProvider;
