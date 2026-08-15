/**
 * Shared result handling for template imports: marks the template
 * imported and routes to the right feedback (success / already / error).
 */

import { useCallback } from 'react';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';

interface ImportResult {
  alreadyExists?: boolean;
  habitId?: Id<'habits'>;
  success?: boolean;
}

interface UseImportResultHandlerOptions {
  setImportedTemplateIds: (update: (prev: Set<string>) => Set<string>) => void;
  showAlreadyImported: (
    habitId: Id<'habits'>,
    templateOverride?: Doc<'templates'> | null
  ) => void;
  showError: (onRetry?: () => void) => void;
  showSuccess: (
    habitId: Id<'habits'>,
    templateOverride?: Doc<'templates'> | null
  ) => void;
}

export type ImportOutcome = 'added' | 'exists' | 'failed';
export type ImportFeedbackMode = 'inline' | 'overlay';

export function useImportResultHandler(o: UseImportResultHandlerOptions) {
  return useCallback(
    (
      res: ImportResult,
      templateId: Id<'templates'>,
      feedbackMode: ImportFeedbackMode = 'overlay',
      feedbackTemplate?: Doc<'templates'> | null
    ): ImportOutcome => {
      if (res.alreadyExists) {
        o.setImportedTemplateIds((p) => new Set(p).add(templateId));
        if (!res.habitId) o.showError();
        else if (feedbackMode === 'overlay') {
          if (feedbackTemplate === undefined) {
            o.showAlreadyImported(res.habitId);
          } else {
            o.showAlreadyImported(res.habitId, feedbackTemplate);
          }
        }
        return 'exists';
      }
      if (res.success && res.habitId) {
        o.setImportedTemplateIds((p) => new Set(p).add(templateId));
        if (feedbackMode === 'overlay') {
          if (feedbackTemplate === undefined) o.showSuccess(res.habitId);
          else o.showSuccess(res.habitId, feedbackTemplate);
        }
        return 'added';
      }
      // A result that is neither an add nor a duplicate is a failure the user
      // must hear about — a bare return here strands them on a spinner that
      // clears into silence.
      o.showError();
      return 'failed';
    },
    [
      o.setImportedTemplateIds,
      o.showAlreadyImported,
      o.showError,
      o.showSuccess,
    ]
  );
}
