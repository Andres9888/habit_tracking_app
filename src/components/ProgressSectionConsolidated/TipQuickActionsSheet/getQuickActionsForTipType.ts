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

type ActionHandler = (focusDayName?: string, currentStreak?: number) => QuickAction[];

const quickActionHandlers: Record<TipType, ActionHandler> = {
  focusDay: (focusDayName) => getFocusDayActions(focusDayName),
  lowStreak: () => getLowStreakActions(),
  goodStreak: (_, currentStreak) => getGoodStreakActions(currentStreak),
  weekStreak: () => getWeekStreakActions(),
  noData: () => getDefaultActions(),
};

export function getQuickActionsForTipType(
  tipType: TipType,
  focusDayName?: string,
  currentStreak?: number
): QuickAction[] {
  const handler = quickActionHandlers[tipType] ?? (() => getDefaultActions());
  return handler(focusDayName, currentStreak);
}
