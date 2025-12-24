import { useEffect, useRef, useState, useCallback } from 'react';
import { useMilestoneDetection } from '../../../hooks/useMilestoneDetection';
import type { Habit, ShareCardData } from '../types';

export function useMilestoneCelebrationState(habits: Habit[], isHabitsLoading: boolean) {
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
    if (milestone) {
      console.log('🎉 MILESTONE DETECTED!', {
        level: milestone.level,
        strength: milestone.strength + '%',
        habitName: milestone.habitName,
      });
    }
  }, [milestone]);

  const prevStrengthsRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (isHabitsLoading) return;

    habits.forEach((habit) => {
      const prevStrength = prevStrengthsRef.current.get(habit._id) || 0;
      const currentStrength = (habit.strength as number | undefined) ?? 0;

      if (currentStrength > prevStrength) {
        console.log('🎯 Strength increased!', {
          habitName: habit.name,
          prevStrength: (prevStrength * 100).toFixed(1) + '%',
          currentStrength: (currentStrength * 100).toFixed(1) + '%',
        });
        setLastUpdatedHabit({
          id: habit._id,
          name: habit.name,
          strength: currentStrength,
        });
      }

      prevStrengthsRef.current.set(habit._id, currentStrength);
    });
  }, [habits, isHabitsLoading]);

  const [shareCardData, setShareCardData] = useState<ShareCardData | null>(null);
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
    milestone,
    showShareCard,
    shareCardData,
    openShareCard,
    closeShareCard,
    closeCelebration,
  };
}
