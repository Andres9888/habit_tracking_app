/**
 * Shared types for the Chain Day onboarding questionnaire flow.
 */

export interface ScreenProps {
  onNext: () => void;
}

export interface SelectOption {
  id: string;
  emoji: string;
  label: string;
  sublabel?: string;
}

export interface QuestionnaireState {
  selectedGoal: string | null;
  painPoints: string[];
  painCardsAccepted: number;
}

export interface QuestionnaireActions {
  setGoal: (goalId: string) => void;
  setPainPoints: (points: string[]) => void;
  incrementPainCards: () => void;
  state: QuestionnaireState;
}
