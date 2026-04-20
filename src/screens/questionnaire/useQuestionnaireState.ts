import { useCallback, useEffect, useState } from 'react';

import {
  safeGetItem,
  safeGetString,
  safeSetItem,
  safeSetString,
  safeSetBoolean,
} from '@/utils/storage';

import {
  QUESTIONNAIRE_ANSWERS_KEY,
  QUESTIONNAIRE_COMPLETE_KEY,
  QUESTIONNAIRE_STEP_KEY,
  QUESTIONNAIRE_TEMPLATES_KEY,
} from './questionnaire.storageKeys';
import {
  EMPTY_ANSWERS,
  type QuestionnaireAnswers,
  type QuestionnaireStep,
  type TemplateId,
  TOTAL_STEPS,
} from './QuestionnaireFlow.types';

function isAnswers(value: unknown): value is QuestionnaireAnswers {
  return typeof value === 'object' && value !== null && 'goal' in value;
}

function isTemplateIds(value: unknown): value is TemplateId[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

function toStep(raw: string): QuestionnaireStep {
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < 1 || parsed > TOTAL_STEPS) return 1;
  return parsed as QuestionnaireStep;
}

export interface QuestionnaireStateApi {
  step: QuestionnaireStep;
  answers: QuestionnaireAnswers;
  selectedTemplateIds: TemplateId[];
  hydrated: boolean;
  setStep: (next: QuestionnaireStep) => void;
  updateAnswers: (patch: Partial<QuestionnaireAnswers>) => void;
  setSelectedTemplateIds: (ids: TemplateId[]) => void;
  markComplete: () => Promise<void>;
}

export function useQuestionnaireState(): QuestionnaireStateApi {
  const [step, setStepState] = useState<QuestionnaireStep>(1);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(EMPTY_ANSWERS);
  const [selectedTemplateIds, setTemplateIdsState] = useState<TemplateId[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    void Promise.all([
      safeGetString(QUESTIONNAIRE_STEP_KEY, '1'),
      safeGetItem<QuestionnaireAnswers>(
        QUESTIONNAIRE_ANSWERS_KEY,
        isAnswers,
        EMPTY_ANSWERS
      ),
      safeGetItem<TemplateId[]>(QUESTIONNAIRE_TEMPLATES_KEY, isTemplateIds, []),
    ]).then(([stepRaw, a, t]) => {
      setStepState(toStep(stepRaw));
      setAnswers(a);
      setTemplateIdsState(t);
      setHydrated(true);
    });
  }, []);

  const setStep = useCallback((next: QuestionnaireStep) => {
    setStepState(next);
    void safeSetString(QUESTIONNAIRE_STEP_KEY, String(next));
  }, []);

  const updateAnswers = useCallback((patch: Partial<QuestionnaireAnswers>) => {
    setAnswers((prev) => {
      const updated = { ...prev, ...patch };
      void safeSetItem(QUESTIONNAIRE_ANSWERS_KEY, updated);
      return updated;
    });
  }, []);

  const setSelectedTemplateIds = useCallback((ids: TemplateId[]) => {
    setTemplateIdsState(ids);
    void safeSetItem(QUESTIONNAIRE_TEMPLATES_KEY, ids);
  }, []);

  const markComplete = useCallback(async () => {
    await safeSetBoolean(QUESTIONNAIRE_COMPLETE_KEY, true);
  }, []);

  return {
    step,
    answers,
    selectedTemplateIds,
    hydrated,
    setStep,
    updateAnswers,
    setSelectedTemplateIds,
    markComplete,
  };
}
