/**
 * True when the template has any data that ScienceDrilldown can render.
 * Used to gate the science-anchor measurement so an empty science region
 * never gets scrolled to or marked as handled.
 */

import type { Template } from '../../../types/template';

export function hasScienceContent(template: Template | null | undefined): boolean {
  if (!template) return false;
  const hasWhy = Boolean(template.lead?.trim() || template.evidence?.trim());
  const hasTimeline = Boolean(template.timeline && template.timeline.length > 0);
  const hasSources = Boolean(
    (template.sources && template.sources.length > 0) ||
      template.scientificReference?.trim()
  );
  return hasWhy || hasTimeline || hasSources;
}
