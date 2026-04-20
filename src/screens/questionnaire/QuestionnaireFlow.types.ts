import type { Id } from '../../../convex/_generated/dataModel';

export const TOTAL_STEPS = 13;

export type QuestionnaireStep =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type NotifPermission = 'granted' | 'denied' | 'skipped' | null;

export interface QuestionnaireAnswers {
  goal: string | null;
  painPoints: string[];
  relatable: string[];
  categories: string[];
  notifPermission: NotifPermission;
}

export const EMPTY_ANSWERS: QuestionnaireAnswers = {
  goal: null,
  painPoints: [],
  relatable: [],
  categories: [],
  notifPermission: null,
};

export type TemplateId = Id<'templates'>;

export interface StepProps {
  step: QuestionnaireStep;
  answers: QuestionnaireAnswers;
  selectedTemplateIds: TemplateId[];
  updateAnswers: (patch: Partial<QuestionnaireAnswers>) => void;
  setSelectedTemplateIds: (ids: TemplateId[]) => void;
  onNext: () => void;
  onBack: () => void;
}
