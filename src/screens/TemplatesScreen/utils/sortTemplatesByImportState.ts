/**
 * Sort templates so not-yet-imported habits appear first.
 */

import type { Doc } from '../../../../convex/_generated/dataModel';

type Template = Doc<'templates'>;
type TemplateComparator = (a: Template, b: Template) => number;

const preserveInputOrder: TemplateComparator = () => 0;

export function compareTemplatesByPopularity(a: Template, b: Template) {
  return (b.popularityScore ?? 0) - (a.popularityScore ?? 0);
}

export function sortTemplatesByImportState(
  templates: Template[],
  importedTemplateIds: Set<string>,
  compareWithinImportState = preserveInputOrder
): Template[] {
  return [...templates].sort((a, b) => {
    const aImported = importedTemplateIds.has(a._id) ? 1 : 0;
    const bImported = importedTemplateIds.has(b._id) ? 1 : 0;
    const importDelta = aImported - bImported;
    return importDelta || compareWithinImportState(a, b);
  });
}
