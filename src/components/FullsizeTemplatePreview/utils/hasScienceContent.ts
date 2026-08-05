/**
 * True when the template has any data that ScienceDrilldown can render.
 * Used to gate the science-anchor measurement so an empty science region
 * never gets scrolled to or marked as handled.
 */

import type { Template } from '../../../types/template';

export function hasScienceContent(
  template: Template | null | undefined
): boolean {
  if (!template) return false;
  const texts = [
    template.lead,
    template.evidence,
    template.scientificReference,
  ];
  const lists = [template.timeline, template.sources];
  return (
    texts.some((text) => Boolean(text?.trim())) ||
    lists.some((list) => Boolean(list?.length))
  );
}
