import { useEffect, useRef, useState, useCallback } from 'react';
import { useMilestoneDetection } from '../../../hooks/useMilestoneDetection';
import type { Habit, ShareCardData } from '../types';

export function useMilestoneCelebrationState(
  habits: Habit[],
  isHabitsLoading: boolean
) {
  const [lastUpdatedHabit, setLastUpdatedHabit] = useState<{
    id: string;
    name: string;
    strength: number;
  } | null>(null);

  const { milestone, clearMilestone } = useMilestoneDetection(
    lastUpdatedHabit?.id,
    lastUpdatedHabit?.name,
    lastUpdatedHabit?.strength ? lastUpdatedHabit.strength * 100 : undefined
  );

  useEffect(() => {
    if (milestone && __DEV__)
      console.log('🎉 MILESTONE DETECTED!', {
        habitName: milestone.habitName,
        level: milestone.level,
        strength: milestone.strength + '%',
      });
  }, [milestone]);

  const prevStrengthsRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (isHabitsLoading) return;

    for (const habit of habits) {
      const prevStrength = prevStrengthsRef.current.get(habit._id) || 0;
      const currentStrength = habit.strength ?? 0;

      if (currentStrength > prevStrength) {
        if (__DEV__)
          console.log('🎯 Strength increased!', {
            currentStrength: (currentStrength * 100).toFixed(1) + '%',
            habitName: habit.name,
            prevStrength: (prevStrength * 100).toFixed(1) + '%',
          });
        setLastUpdatedHabit({
          id: habit._id,
          name: habit.name,
          strength: currentStrength,
        });
      }

      prevStrengthsRef.current.set(habit._id, currentStrength);
    }
  }, [habits, isHabitsLoading]);

  const [shareCardData, setShareCardData] = useState<ShareCardData | null>(
    null
  );
  const [showShareCard, setShowShareCard] = useState(false);

  const openShareCard = useCallback(() => {
    if (!milestone) return;
    setShareCardData({
      habitName: milestone.habitName,
      milestoneLevel: milestone.level,
      strengthPercentage: milestone.strength,
    });
    setShowShareCard(true);
  }, [milestone]);

  const closeShareCard = useCallback(() => {
    setShowShareCard(false);
    setShareCardData(null);
    clearMilestone();
    setLastUpdatedHabit(null);
  }, [clearMilestone]);

  const closeCelebration = useCallback(() => {
    clearMilestone();
    setLastUpdatedHabit(null);
  }, [clearMilestone]);

  return {
    closeCelebration,
    closeShareCard,
    milestone,
    openShareCard,
    shareCardData,
    showShareCard,
  };
}
