import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { View } from 'react-native';

import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { getTimeBasedHabits } from './HabitsEmptyState.utils';
import type { HabitsEmptyStateProps } from './HabitsEmptyState.types';
import {
  CustomHabitCard,
  LoadingState,
  QuickWinCard,
  WelcomeHero,
} from './components';

// eslint-disable-next-line max-lines-per-function
export function HabitsEmptyState({
  isLoading,
  openCreateHabitScreen,
  // Removed from UI but kept in props for API compatibility
  openTemplatesScreen: _openTemplatesScreen,
  onQuickCreateHabit,
  onNeedHelpQuiz,
  onScheduleReminder: _onScheduleReminder,
}: HabitsEmptyStateProps) {
  const [creatingHabit, setCreatingHabit] = useState<string | null>(null);
  const [successHabit, setSuccessHabit] = useState<string | null>(null);
  const { triggerMediumImpact, triggerSuccess, triggerLightImpact } =
    useHapticFeedback();
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cleanup timeouts on unmount to prevent memory leaks
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      for (const t of timeouts) {
        clearTimeout(t);
      }
    };
  }, []);

  // Memoize time context to prevent recalculating on every render
  const timeContext = useMemo(() => getTimeBasedHabits(), []);

  const handleQuickCreate = useCallback(
    async (habitName: string) => {
      if (!onQuickCreateHabit) return;

      setCreatingHabit(habitName);
      triggerMediumImpact();

      try {
        await onQuickCreateHabit(habitName);
        setSuccessHabit(habitName);
        triggerSuccess();
        const t1 = setTimeout(() => triggerLightImpact(), 400);
        const t2 = setTimeout(() => setSuccessHabit(null), 1500);
        timeoutsRef.current.push(t1, t2);
      } finally {
        setCreatingHabit(null);
      }
    },
    [
      onQuickCreateHabit,
      triggerMediumImpact,
      triggerSuccess,
      triggerLightImpact,
    ]
  );

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <View
      className='gap-5 bg-transparent py-4'
      style={{ alignSelf: 'stretch' }}
    >
      <WelcomeHero
        greeting={timeContext.greeting}
        period={timeContext.period}
      />

      {/* OPTIMIZED: Reduced to 2 primary paths - QuickWin + Custom */}
      {onQuickCreateHabit && (
        <QuickWinCard
          creatingHabit={creatingHabit}
          successHabit={successHabit}
          timeContext={timeContext}
          onQuickCreateHabit={handleQuickCreate}
        />
      )}

      <CustomHabitCard
        onNeedHelpQuiz={onNeedHelpQuiz}
        onPress={openCreateHabitScreen}
      />

      {/* Templates available via settings/menu - not competing here */}
    </View>
  );
}
