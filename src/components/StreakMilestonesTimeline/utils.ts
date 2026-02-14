/**
 * Utility to calculate streak milestones from completed dates
 */

import { format, parseISO } from 'date-fns';

export interface StreakMilestone {
  /** Milestone day count (7, 14, 30, 60, 100) */
  days: number;
  /** Date when milestone was reached */
  date: string | null;
  /** Formatted date string for display */
  formattedDate: string | null;
  /** Whether this milestone has been achieved */
  achieved: boolean;
}

/**
 * Calculate streak milestones from completed dates
 * Returns array of milestones with their achievement dates
 */
export const calculateStreakMilestones = (
  completedDates: Set<string>,
  habitCreatedAt: number | undefined
): StreakMilestone[] => {
  const milestoneDays = [7, 14, 30, 60, 100];

  if (!completedDates || completedDates.size === 0 || !habitCreatedAt) {
    return milestoneDays.map((days) => ({
      days,
      date: null,
      formattedDate: null,
      achieved: false,
    }));
  }

  // Sort completed dates
  const sortedDates = [...completedDates].sort();

  // Create a map of day count to date achieved
  // We need to count consecutive days from the start
  if (sortedDates.length === 0) {
    return milestoneDays.map((days) => ({
      days,
      date: null,
      formattedDate: null,
      achieved: false,
    }));
  }

  // Calculate the streak at each date by counting consecutive days from habit creation
  // Group consecutive dates and track streak length at each point
  const milestones: StreakMilestone[] = [];
  let currentStreak = 0;
  let previousDate: Date | null = null;

  // Track the maximum streak achieved
  let maxStreak = 0;
  let maxStreakDate: string | null = null;

  // Parse habit creation date
  const createdDate = new Date(habitCreatedAt);

  for (const dateStr of sortedDates) {
    const currentDate = parseISO(dateStr);

    if (previousDate === null) {
      // First completion
      currentStreak = 1;
    } else {
      // Check if consecutive
      const daysDiff = Math.floor(
        (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 1) {
        // Consecutive day
        currentStreak += 1;
      } else if (daysDiff === 0) {
        // Same day - skip (shouldn't happen but handle it)
        continue;
      } else {
        // Gap in streak - reset
        currentStreak = 1;
      }
    }

    // Track max streak
    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
      maxStreakDate = dateStr;
    }

    previousDate = currentDate;
  }

  // For each milestone day, find when it was achieved
  for (const days of milestoneDays) {
    if (maxStreak >= days && maxStreakDate) {
      // Find the date when the streak reached this milestone
      // We need to recalculate to find the exact date
      const milestoneDate = findDateForStreak(completedDates, days);
      milestones.push({
        days,
        date: milestoneDate,
        formattedDate: milestoneDate
          ? format(parseISO(milestoneDate), 'MMM d, yyyy')
          : null,
        achieved: true,
      });
    } else {
      milestones.push({
        days,
        date: null,
        formattedDate: null,
        achieved: false,
      });
    }
  }

  return milestones;
};

/**
 * Find the exact date when a streak reached a specific length
 */
const findDateForStreak = (
  completedDates: Set<string>,
  targetStreak: number
): string | null => {
  const sortedDates = [...completedDates].sort();
  let currentStreak = 0;
  let previousDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const currentDate = parseISO(dateStr);

    if (previousDate === null) {
      currentStreak = 1;
    } else {
      const daysDiff = Math.floor(
        (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 1) {
        currentStreak += 1;
      } else if (daysDiff > 1) {
        currentStreak = 1;
      }
    }

    if (currentStreak === targetStreak) {
      return dateStr;
    }

    previousDate = currentDate;
  }

  return null;
};

/**
 * Get celebratory emoji for milestone
 */
export const getMilestoneEmoji = (days: number): string => {
  const emojis: Record<number, string> = {
    7: '🎯',
    14: '🔥',
    30: '⚡',
    60: '🌟',
    100: '👑',
  };
  return emojis[days] || '🏆';
};

/**
 * Get milestone label
 */
export const getMilestoneLabel = (days: number): string => {
  return `${days} Day${days > 1 ? 's' : ''}`;
};
