/**
 * Pure helpers for resolving prescription steps against live templates.
 */

import type { Doc } from '../../../../convex/_generated/dataModel';
import type { PrescriptionStepRef } from '../data/prescriptions';
import {
  compareTemplatesByPopularity,
  sortTemplatesByImportState,
} from '../utils/sortTemplatesByImportState';

export interface ResolvedPrescriptionStep {
  reason: string;
  stepNumber: number;
  template: Doc<'templates'>;
}

function templateKey(name: string, category: string): string {
  return `${name}|${category}`;
}

export function buildTemplateMap(
  templates: Doc<'templates'>[]
): Map<string, Doc<'templates'>> {
  const map = new Map<string, Doc<'templates'>>();
  for (const template of templates) {
    map.set(templateKey(template.name, template.category), template);
  }
  return map;
}

function findFallbackTemplate(
  allTemplates: Doc<'templates'>[],
  categories: string[],
  importedTemplateIds: Set<string>,
  usedIds: Set<string>
): Doc<'templates'> | null {
  const candidates = allTemplates.filter(
    (t) => categories.includes(t.category) && !usedIds.has(t._id)
  );
  const ordered = sortTemplatesByImportState(
    candidates,
    importedTemplateIds,
    compareTemplatesByPopularity
  );
  return ordered[0] ?? null;
}

export function resolvePrescriptionStep(
  step: PrescriptionStepRef,
  stepNumber: number,
  templateMap: Map<string, Doc<'templates'>>,
  allTemplates: Doc<'templates'>[],
  categories: string[],
  importedTemplateIds: Set<string>,
  usedIds: Set<string>
): ResolvedPrescriptionStep | null {
  const key = templateKey(step.templateName, step.templateCategory);
  let template = templateMap.get(key) ?? null;
  if (!template) {
    template = findFallbackTemplate(
      allTemplates,
      categories,
      importedTemplateIds,
      usedIds
    );
  }
  if (!template) return null;
  usedIds.add(template._id);
  return { reason: step.reason, stepNumber, template };
}
