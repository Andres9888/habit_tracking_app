import { useCallback, useState } from 'react';
import type { ArchivedHabit } from '../types';
import type { Id } from '../../../../convex/_generated/dataModel';

type Action = 'restore' | 'delete' | 'skip';

export function useCardStack(
  habits: ArchivedHabit[],
  reducedMotion: boolean,
  onRestore: (id: Id<'habits'>, name: string) => Promise<boolean>,
  onDelete: (id: Id<'habits'>, name: string) => void
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<Action | null>(null);
  const [results, setResults] = useState<Record<string, Action>>({});
  const [skippedIds, setSkippedIds] = useState<string[]>([]);
  const [queue, setQueue] = useState(() => habits.map((h) => h._id));
  const [isProcessing, setIsProcessing] = useState(false);

  const isComplete = currentIndex >= queue.length;
  const currentHabitId = isComplete ? null : queue[currentIndex];
  const currentHabit = currentHabitId
    ? habits.find((h) => h._id === currentHabitId)
    : null;

  const restored = Object.values(results).filter((a) => a === 'restore').length;
  const deleted = Object.values(results).filter((a) => a === 'delete').length;
  const skipped = Object.values(results).filter((a) => a === 'skip').length;

  const advanceCard = useCallback(
    (action: Action) => {
      if (!currentHabitId) return;
      setExitDirection(action);
      setResults((prev) => ({ ...prev, [currentHabitId]: action }));
      if (action === 'skip') {
        setSkippedIds((prev) => [...prev, currentHabitId]);
      }
      const delay = reducedMotion ? 0 : 300;
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setExitDirection(null);
      }, delay);
    },
    [currentHabitId, reducedMotion]
  );

  const handleRestore = useCallback(async () => {
    if (!currentHabit || isProcessing) return;
    setIsProcessing(true);
    const success = await onRestore(currentHabit._id, currentHabit.name);
    if (success) advanceCard('restore');
    setIsProcessing(false);
  }, [currentHabit, isProcessing, onRestore, advanceCard]);

  const handleDelete = useCallback(() => {
    if (!currentHabit || isProcessing) return;
    onDelete(currentHabit._id, currentHabit.name);
    advanceCard('delete');
  }, [currentHabit, isProcessing, onDelete, advanceCard]);

  const handleSkip = useCallback(() => {
    if (!currentHabit || isProcessing) return;
    advanceCard('skip');
  }, [currentHabit, isProcessing, advanceCard]);

  const handleReviewSkipped = useCallback(() => {
    setQueue(skippedIds);
    setSkippedIds([]);
    setCurrentIndex(0);
    setResults({});
  }, [skippedIds]);

  return {
    currentHabit,
    currentHabitId,
    currentIndex,
    deleted,
    exitDirection,
    handleDelete,
    handleRestore,
    handleReviewSkipped,
    handleSkip,
    isComplete,
    isProcessing,
    queue,
    restored,
    skipped,
  };
}
