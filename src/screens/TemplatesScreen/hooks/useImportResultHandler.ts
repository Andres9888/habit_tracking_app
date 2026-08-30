/**
 * Shared result handling for template imports: marks the template
 * imported and routes to the right feedback (success / already / error).
 */

import { useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';

interface ImportResult {
  alreadyExists?: boolean;
  habitId?: Id<'habits'>;
  success?: boolean;
}

interface UseImportResultHandlerOptions {
  /**
   * Records template → habit so the drill-down's "Go to Today" button can
   * focus the row. Called on both the fresh-import and already-exists
   * branches, and in every feedback mode: 'inline' skips showSuccess, so
   * feedbackHabitId is never set for the drill-down path.
   */
  recordImportedHabitId: (
    templateId: Id<'templates'>,
    habitId: Id<'habits'>
  ) => void;
  setImportedTemplateIds: (update: (prev: Set<string>) => Set<string>) => void;
  showAlreadyImported: (habitId: Id<'habits'>) => void;
  showError: (onRetry?: () => void) => void;
  showSuccess: (habitId: Id<'habits'>, forceToast?: boolean) => void;
}

export type ImportFeedbackMode = 'inline' | 'list' | 'overlay';

export function useImportResultHandler(o: UseImportResultHandlerOptions) {
  return useCallback(
    (
      res: ImportResult,
      templateId: Id<'templates'>,
      feedbackMode: ImportFeedbackMode = 'overlay'
    ) => {
      if (res.habitId && (res.alreadyExists || res.success)) {
        o.recordImportedHabitId(templateId, res.habitId);
      }
      if (res.alreadyExists) {
        o.setImportedTemplateIds((p) => new Set(p).add(templateId));
        if (!res.habitId) o.showError();
        else if (feedbackMode !== 'inline') {
          o.showAlreadyImported(res.habitId);
        }
        return true;
      }
      if (res.success && res.habitId) {
        o.setImportedTemplateIds((p) => new Set(p).add(templateId));
        if (feedbackMode !== 'inline') {
          o.showSuccess(res.habitId, feedbackMode === 'list');
        }
        return true;
      }
      if (res.success) {
        o.showError();
        return false;
      }
      o.showError();
      return false;
    },
    [
      o.recordImportedHabitId,
      o.setImportedTemplateIds,
      o.showAlreadyImported,
      o.showError,
      o.showSuccess,
    ]
  );
}
