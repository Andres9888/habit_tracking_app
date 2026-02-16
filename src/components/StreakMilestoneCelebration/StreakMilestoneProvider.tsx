/* eslint-disable max-lines */
/**
 * StreakMilestoneProvider - Global Context for Streak Celebrations
 *
 * Provides a global context for managing streak milestone celebrations
 * (7, 30, 100 days) across the app. Renders celebration modals and
 * share card generators when milestones are reached.
 *
 * **Key Features:**
 * - Detects milestone crossings (7, 30, 100 day streaks)
 * - Displays celebration modal with confetti animation
 * - Generates shareable achievement cards
 * - Persists shown milestones to avoid duplicate celebrations
 *
 * **Usage Pattern:**
 * ```tsx
 * // In app root
 * <StreakMilestoneProvider userName="John">
 *   <App />
 * </StreakMilestoneProvider>
 *
 * // In any habit completion handler
 * const { checkAndCelebrate } = useStreakMilestone();
 * checkAndCelebrate(habitId, habitName, emoji, prevStreak, newStreak);
 * ```
 *
 * **Architecture Note:**
 * This provider is located in src/components/StreakMilestoneCelebration/
 * but follows the React Context provider pattern. For consistency, it
 * should ideally be extracted to src/contexts/StreakMilestoneContext/
 * with the celebration UI remaining in src/components/.
 * File move deferred to avoid breaking changes.
 *
 * @see constants.ts for STREAK_MILESTONES and milestone utilities
 * @see useMilestoneCheck.ts for milestone detection logic
 */

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { StreakMilestoneCelebration } from './StreakMilestoneCelebration';
import { ShareCardGenerator } from '../ShareCardGenerator';
import { useCelebrationHandlers } from './useCelebrationHandlers';

/**
 * Context value for streak milestone celebrations
 */
interface StreakMilestoneContextValue {
  /**
   * Check if a milestone was crossed and trigger celebration if so
   *
   * @param habitId - Unique habit identifier
   * @param habitName - Display name of the habit
   * @param habitEmoji - Emoji icon for the habit
   * @param previousStreak - Streak count before latest completion
   * @param currentStreak - Streak count after latest completion
   */
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

/**
 * Props for StreakMilestoneProvider component
 */
interface StreakMilestoneProviderProps {
  /** React children to render */
  children: ReactNode;
  /** User name to display on share cards */
  userName?: string;
}

/**
 * StreakMilestoneProvider Component
 *
 * Provider component that manages global celebration state and renders
 * celebration modals and share card generators when milestones are reached.
 *
 * @param props - Component props
 * @param props.children - Child components to render
 * @param props.userName - User name to display on share cards (default: '')
 *
 * @example
 * ```tsx
 * <StreakMilestoneProvider userName={user?.firstName || ''}>
 *   <NavigationContainer>
 *     <AppNavigator />
 *   </NavigationContainer>
 * </StreakMilestoneProvider>
 * ```
 */
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

      {/* Celebration Modal */}
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

      {/* Share Card Generator */}
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

/**
 * useStreakMilestone Hook
 *
 * Access the streak milestone celebration trigger function.
 * Use this hook to programmatically check for and trigger milestone
 * celebrations when a habit completion occurs.
 *
 * @throws Error if used outside StreakMilestoneProvider
 *
 * @returns Context value with checkAndCelebrate function
 *
 * @example
 * ```tsx
 * function HabitCompletionButton() {
 *   const { checkAndCelebrate } = useStreakMilestone();
 *
 *   const handleComplete = async () => {
 *     const prevStreak = habit.currentStreak;
 *     await completeHabit();
 *     const newStreak = habit.currentStreak + 1;
 *
 *     checkAndCelebrate(
 *       habit._id,
 *       habit.name,
 *       habit.emoji,
 *       prevStreak,
 *       newStreak
 *     );
 *   };
 *
 *   return <Button onPress={handleComplete}>Complete</Button>;
 * }
 * ```
 */
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
