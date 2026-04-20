import { useMutation } from 'convex/react';
import { useEffect, useRef, useState } from 'react';

import { api } from '../../../convex/_generated/api';
import { safeRemoveItem } from '@/utils/storage';

import { QUESTIONNAIRE_TEMPLATES_KEY } from './questionnaire.storageKeys';
import type { TemplateId } from './QuestionnaireFlow.types';

type Status = 'idle' | 'importing' | 'done' | 'error';

export function useTemplateAutoImport(
  selectedTemplateIds: TemplateId[],
  enabled: boolean
) {
  const importTemplate = useMutation(api.templates.importTemplate);
  const hasRun = useRef(false);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    if (!enabled || hasRun.current) return;
    if (selectedTemplateIds.length === 0) {
      hasRun.current = true;
      setStatus('done');
      return;
    }
    hasRun.current = true;
    setStatus('importing');
    void (async () => {
      try {
        for (const templateId of selectedTemplateIds) {
          try {
            await importTemplate({ templateId });
          } catch (error_) {
            if (__DEV__) console.warn('[questionnaire] import failed', error_);
          }
        }
        await safeRemoveItem(QUESTIONNAIRE_TEMPLATES_KEY);
        setStatus('done');
      } catch (error_) {
        if (__DEV__) console.error('[questionnaire] auto-import error', error_);
        setStatus('error');
      }
    })();
  }, [enabled, importTemplate, selectedTemplateIds]);

  return { status };
}
