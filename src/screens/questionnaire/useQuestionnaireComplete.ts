import { useCallback, useEffect, useState } from 'react';

import { safeGetBoolean } from '@/utils/storage';

import { QUESTIONNAIRE_COMPLETE_KEY } from './questionnaire.storageKeys';

export function useQuestionnaireComplete() {
  const [complete, setComplete] = useState<boolean | null>(null);

  useEffect(() => {
    void safeGetBoolean(QUESTIONNAIRE_COMPLETE_KEY, false).then((value) => {
      setComplete(value);
    });
  }, []);

  const markComplete = useCallback(() => {
    setComplete(true);
  }, []);

  return { complete, markComplete };
}
