/**
 * Sort templates so not-yet-imported habits appear first.
 */

import type { Doc } from '../../../../convex/_generated/dataModel';

export function sortTemplatesByImportState(
  templates: Doc<'templates'>[],
  importedTemplateIds: Set<string>
): Doc<'templates'>[] {
  return [...templates].sort((a, b) => {
    const aImported = importedTemplateIds.has(a._id) ? 1 : 0;
    const bImported = importedTemplateIds.has(b._id) ? 1 : 0;
    return aImported - bImported;
  });
}
