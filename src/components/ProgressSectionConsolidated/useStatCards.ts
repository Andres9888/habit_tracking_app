/**
 * useStatCards Hook
 *
 * Builds the stat cards configuration for the StatsGrid component.
 * Extracts memoization logic from the main component for better separation.
 */

import { useMemo } from 'react';
import type { StatItemConfig, DayInfo } from './StatsGridTypes';
import { STAT_CARD_COLORS } from './StatsGridTypes';
import { t } from '../../i18n';

interface UseStatCardsArgs {
  currentStreak: number;
  monthlyCompleted: number;
  monthlyTotal: number;
  bestDay: DayInfo | null;
  focusDay: DayInfo | null;
  monthlyChange?: number;
}

interface UseStatCardsReturn {
  topRowCards: StatItemConfig[];
  bottomRowCards: StatItemConfig[];
  allCards: StatItemConfig[];
}

/**
 * Generates stat card configurations for the 2x2 grid
 */
export function useStatCards({
  currentStreak,
  monthlyCompleted,
  monthlyTotal,
  bestDay,
  focusDay,
  monthlyChange,
}: UseStatCardsArgs): UseStatCardsReturn {
  const statCards = useMemo<StatItemConfig[]>(() => {
    const cards: StatItemConfig[] = [ 
      {
        backgroundColor: STAT_CARD_COLORS.streak.bgHex,
        icon: '🔥',
        id: 'streak',
        label: t('streaks.dayStreak'),
        value: currentStreak === 1 ? '1' : `${currentStreak}`,
      },
      {
        backgroundColor: STAT_CARD_COLORS.monthly.bgHex,
        icon: '📅',
        id: 'monthly',
        label: t('streaks.thisMonth'),
        showTrend: monthlyChange !== undefined && monthlyChange !== 0,
        trend: monthlyChange,
        value: `${monthlyCompleted}/${monthlyTotal}`,
      }
    ];

    // Streak card (top-left of grid)

    // Best Day card (bottom-left of grid)
    if (bestDay) {
      cards.push({
        backgroundColor: STAT_CARD_COLORS.bestDay.bgHex,
        icon: '🏆',
        id: 'bestDay',
        label: `Best Day (${Math.round(bestDay.rate)}%)`,
        value: bestDay.name.slice(0, 3),
      });
    }

    // Focus Day card (bottom-right of grid)
    if (focusDay) {
      cards.push({
        backgroundColor: STAT_CARD_COLORS.focusDay.bgHex,
        icon: '⚡',
        id: 'focusDay',
        label: `Focus Day (${Math.round(focusDay.rate)}%)`,
        value: focusDay.name.slice(0, 3),
      });
    }

    return cards;
  }, [
    currentStreak,
    monthlyCompleted,
    monthlyTotal,
    bestDay,
    focusDay,
    monthlyChange,
  ]);

  // Separate cards into rows for grid layout
  const topRowCards = statCards.slice(0, 2);
  const bottomRowCards = statCards.slice(2, 4);

  return { allCards: statCards, bottomRowCards, topRowCards };
}
