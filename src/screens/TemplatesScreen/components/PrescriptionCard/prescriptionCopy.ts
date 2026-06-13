/**
 * PrescriptionCard copy helpers.
 */

import type { ResolvedPrescription } from '../../hooks/usePrescription';

export function getPrescriptionCopy(
  prescription: ResolvedPrescription,
  importedTemplateIds: Set<string>
) {
  const { importedStepCount, steps } = prescription;
  const nextStep =
    steps.find((step) => !importedTemplateIds.has(step.template._id)) ??
    steps[0];
  const hasImported = importedStepCount > 0;
  const allImported = importedStepCount >= steps.length;
  const ctaLabel = allImported
    ? 'Browse more habits'
    : hasImported
      ? 'Add step 2 →'
      : 'Start step 1 →';
  const footerNote = hasImported
    ? 'Most people add step 2 in week two. No rush.'
    : 'Works best together — starting with one is fine.';

  return { allImported, ctaLabel, footerNote, hasImported, nextStep };
}
