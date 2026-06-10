/** State + actions for the FormedHabitsSection accordion */

import { useCallback, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { useExpandAnimation } from '@/hooks/useExpandAnimation';
import { logInteraction } from '../../../../lib/analytics/interactions';
import { showGenericError } from '../../../../utils/errorAlerts';
import { ERROR_MESSAGES } from '../../../../constants/errorMessages';

export function useFormedHabitsSection() {
  const formedHabits = useQuery(api.habits.listFormed);
  const unmarkFormedMutation = useMutation(api.habits.unmarkFormed);
  const reduceMotion = useReduceMotion();
  const { triggerSelection } = useHapticFeedback();

  const [isExpanded, setIsExpanded] = useState(true);
  const [contentHeight, setContentHeight] = useState(0);
  const [hasContentMeasured, setHasContentMeasured] = useState(false);

  const { animateToggle, contentAnimatedStyle, chevronAnimatedStyle } =
    useExpandAnimation({
      contentHeight,
      defaultExpanded: true,
      hasContentMeasured,
      reduceMotion,
    });

  const handleContentLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) {
      setContentHeight(height);
      setHasContentMeasured(true);
    }
  }, []);

  const handleToggle = useCallback(() => {
    triggerSelection();
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    animateToggle(newExpanded);
  }, [isExpanded, triggerSelection, animateToggle]);

  const resumeHabit = useCallback(
    async (habitId: Id<'habits'>, habitName: string) => {
      try {
        await unmarkFormedMutation({ habitId });
        logInteraction('habit_formed_resumed', { habitId, habitName });
      } catch (error) {
        const message = (error as Error).message ?? '';
        // Surface the free-tier limit message from the server verbatim
        showGenericError(
          message.includes('Free tier')
            ? message.replace(/^.*Uncaught Error:\s*/, '')
            : ERROR_MESSAGES.DATA_OPS.RESTORE_FORMED_FAILED
        );
      }
    },
    [unmarkFormedMutation]
  );

  const handleResume = useCallback(
    (habitId: Id<'habits'>, habitName: string) => {
      void resumeHabit(habitId, habitName);
    },
    [resumeHabit]
  );

  return {
    chevronAnimatedStyle,
    contentAnimatedStyle,
    formedHabits: formedHabits ?? [],
    handleContentLayout,
    handleResume,
    handleToggle,
    isExpanded,
  };
}
