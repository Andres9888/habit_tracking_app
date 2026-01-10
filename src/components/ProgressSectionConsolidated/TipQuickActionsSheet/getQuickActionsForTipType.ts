/**
 * Get quick actions based on tip type
 */

import type { QuickAction, TipType } from './types';
import {
  getFocusDayActions,
  getLowStreakActions,
  getGoodStreakActions,
  getWeekStreakActions,
  getDefaultActions,
} from './quickActionsByType';

export function getQuickActionsForTipType(
  tipType: TipType,
  focusDayName?: string,
  currentStreak?: number
): QuickAction[] {
  switch (tipType) {
    case 'focusDay': {
      return getFocusDayActions(focusDayName);
    }
    case 'lowStreak': {
      return getLowStreakActions();
    }
    case 'goodStreak': {
      return getGoodStreakActions(currentStreak);
    }
    case 'weekStreak': {
      return getWeekStreakActions();
    }
    default: {
      return getDefaultActions();
    }
  }
}
