import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { getTimeBasedHabits } from './HabitsEmptyState.utils';
import type { HabitsEmptyStateProps } from './HabitsEmptyState.types';
import {
  CompactHelperRow,
  CustomHabitCard,
  LoadingState,
  QuickWinCard,
  SectionDivider,
  TemplatesPeekCard,
  WelcomeHero,
} from './components';

export function HabitsEmptyState({
  isLoading,
  openCreateHabitScreen,
  openTemplatesScreen,
  onQuickCreateHabit,
  onNeedHelpQuiz,
  onScheduleReminder,
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

  if (isLoading) {
    return <LoadingState />;
  }

  const timeContext = getTimeBasedHabits();

  const handleQuickCreate = async (habitName: string) => {
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
  };

  return (
    <View
      className='gap-4 bg-transparent py-4'
      style={{ alignSelf: 'stretch' }}
    >
      <WelcomeHero
        greeting={timeContext.greeting}
        period={timeContext.period}
      />

      {openTemplatesScreen && (
        <TemplatesPeekCard onPress={openTemplatesScreen} />
      )}

      {onQuickCreateHabit && <SectionDivider />}

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

      {(onNeedHelpQuiz || onScheduleReminder) && (
        <CompactHelperRow
          onNeedHelpQuiz={onNeedHelpQuiz}
          onScheduleReminder={onScheduleReminder}
        />
      )}
    </View>
  );
}
