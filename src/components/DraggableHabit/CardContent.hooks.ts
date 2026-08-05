import { useCallback, useMemo } from 'react';
import { resolveProgressEmojis } from '../../utils/progressEmojis';
import type { DraggableHabitCardProps } from './DraggableHabitCard.types';

/**
 * Derived values for CardContent.
 *
 * handleWeekComplete matters for performance: inline in the JSX, it handed
 * memo(HabitChainVisualizer) a fresh prop on every render and defeated the
 * bail-out for the whole seven-day chain.
 */
export function useCardContent(props: DraggableHabitCardProps) {
  const { habit, onWeekComplete, userProgressEmojis } = props;

  const progressEmojis = useMemo(
    () => resolveProgressEmojis(habit.progressEmojis, userProgressEmojis),
    [habit.progressEmojis, userProgressEmojis]
  );

  const handleWeekComplete = useCallback(
    ({ completedDate }: { completedDate: string }) =>
      onWeekComplete?.({ completedDate, habit }),
    [onWeekComplete, habit]
  );

  return { handleWeekComplete, progressEmojis };
}
