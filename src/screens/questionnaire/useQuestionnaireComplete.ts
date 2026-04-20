import { useCallback, useEffect, useState } from 'react';

import { safeGetBoolean, safeGetString } from '@/utils/storage';

import {
  QUESTIONNAIRE_COMPLETE_KEY,
  QUESTIONNAIRE_STEP_KEY,
} from './questionnaire.storageKeys';

export interface QuestionnaireStatus {
  complete: boolean | null;
  inProgress: boolean;
  markComplete: () => void;
}

export function useQuestionnaireComplete(): QuestionnaireStatus {
  const [complete, setComplete] = useState<boolean | null>(null);
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    void Promise.all([
      safeGetBoolean(QUESTIONNAIRE_COMPLETE_KEY, false),
      safeGetString(QUESTIONNAIRE_STEP_KEY, '1'),
    ]).then(([done, stepRaw]) => {
      const step = Number.parseInt(stepRaw, 10);
      setComplete(done);
      setInProgress(!done && Number.isFinite(step) && step > 1);
    });
  }, []);

  const markComplete = useCallback(() => {
    setComplete(true);
    setInProgress(false);
  }, []);

  return { complete, inProgress, markComplete };
}
