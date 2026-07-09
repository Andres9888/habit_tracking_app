/**
 * Resolves prescription steps against live templates with fallback.
 */

import { useMemo } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { GOAL_COLLECTIONS } from '../data/goalCollections';
import { PRESCRIPTIONS, type PrescriptionEntry } from '../data/prescriptions';
import {
  buildTemplateMap,
  resolvePrescriptionStep,
  type ResolvedPrescriptionStep,
} from './prescriptionResolver';

export type { ResolvedPrescriptionStep } from './prescriptionResolver';

export interface ResolvedPrescription extends Omit<PrescriptionEntry, 'steps'> {
  importedStepCount: number;
  steps: ResolvedPrescriptionStep[];
}

export function usePrescription(
  goalId: string | null,
  allTemplates: Doc<'templates'>[] | undefined,
  importedTemplateIds: Set<string>
): ResolvedPrescription | null {
  return useMemo(() => {
    if (!goalId || !allTemplates?.length) return null;
    const entry = PRESCRIPTIONS.find((p) => p.goalId === goalId);
    const goal = GOAL_COLLECTIONS.find((g) => g.id === goalId);
    if (!entry || !goal) return null;

    const templateMap = buildTemplateMap(allTemplates);
    const usedIds = new Set<string>();
    const steps = entry.steps
      .map((step, index) =>
        resolvePrescriptionStep(
          step,
          index + 1,
          templateMap,
          allTemplates,
          goal.categories,
          importedTemplateIds,
          usedIds
        )
      )
      .filter((step): step is ResolvedPrescriptionStep => step !== null);

    const importedStepCount = steps.filter((step) =>
      importedTemplateIds.has(step.template._id)
    ).length;

    return { ...entry, importedStepCount, steps };
  }, [allTemplates, goalId, importedTemplateIds]);
}

export function getGoalTemplates(
  goalId: string,
  allTemplates: Doc<'templates'>[] | undefined
): Doc<'templates'>[] {
  if (!allTemplates) return [];
  const goal = GOAL_COLLECTIONS.find((g) => g.id === goalId);
  if (!goal) return [];
  const filtered = allTemplates.filter((t) =>
    goal.categories.includes(t.category)
  );
  return [...filtered].sort(
    (a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0)
  );
}
