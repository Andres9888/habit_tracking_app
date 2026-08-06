/**
 * QuestionnaireContext - State management for the onboarding questionnaire.
 */

import React, { createContext, useCallback, useContext, useState } from 'react';
import type { QuestionnaireActions, QuestionnaireState } from './questionnaire.types';

const initialState: QuestionnaireState = {
  selectedGoal: null,
  painPoints: [],
  painCardsAccepted: 0,
};

const QuestionnaireContext = createContext<QuestionnaireActions>({
  state: initialState,
  setGoal: () => {},
  setPainPoints: () => {},
  incrementPainCards: () => {},
});

export function QuestionnaireProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<QuestionnaireState>(initialState);

  const setGoal = useCallback((goalId: string) => {
    setState((previous) => ({ ...previous, selectedGoal: goalId }));
  }, []);

  const setPainPoints = useCallback((points: string[]) => {
    setState((previous) => ({ ...previous, painPoints: points }));
  }, []);

  const incrementPainCards = useCallback(() => {
    setState((previous) => ({
      ...previous,
      painCardsAccepted: previous.painCardsAccepted + 1,
    }));
  }, []);

  return (
    <QuestionnaireContext.Provider
      value={{ state, setGoal, setPainPoints, incrementPainCards }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire(): QuestionnaireActions {
  return useContext(QuestionnaireContext);
}
