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
  setImportedTemplateIds: (update: (prev: Set<string>) => Set<string>) => void;
  showAlreadyImported: (habitId: Id<'habits'>) => void;
  showError: (onRetry?: () => void) => void;
  showSuccess: (habitId: Id<'habits'>) => void;
}

export function useImportResultHandler(o: UseImportResultHandlerOptions) {
  return useCallback(
    (res: ImportResult, templateId: Id<'templates'>) => {
      if (res.alreadyExists) {
        o.setImportedTemplateIds((p) => new Set(p).add(templateId));
        if (res.habitId) o.showAlreadyImported(res.habitId);
        else o.showError();
        return true;
      }
      if (res.success && res.habitId) {
        o.setImportedTemplateIds((p) => new Set(p).add(templateId));
        o.showSuccess(res.habitId);
        return true;
      }
      if (res.success) {
        o.showError();
        return false;
      }
      return false;
    },
    [
      o.setImportedTemplateIds,
      o.showAlreadyImported,
      o.showError,
      o.showSuccess,
    ]
  );
}
