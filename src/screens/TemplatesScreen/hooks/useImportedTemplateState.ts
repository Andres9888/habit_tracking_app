/**
 * The two imported-template lookups the catalog needs, behind one call:
 * the id sets (pill / ordering state) and the template → habit id map that
 * the post-add "Go to Today" button resolves against.
 *
 * They are bundled so TemplatesScreen.hooks.ts keeps a single call site and
 * stays inside the 100-line budget.
 */

import {
  useImportedHabitIdMap,
  type ImportedHabitIdPair,
} from './useImportedHabitIdMap';
import { useImportedTemplateIdsSync } from './useImportedTemplateIdsSync';

export function useImportedTemplateState(
  initialImportedIds: Set<string> | undefined,
  importedHabitIds: readonly ImportedHabitIdPair[] | undefined
) {
  const ids = useImportedTemplateIdsSync(initialImportedIds);
  const habitIds = useImportedHabitIdMap(importedHabitIds);
  return { ...ids, ...habitIds };
}
