/**
 * Derives confidence-building content for templates with fallbacks
 */

import type { Doc } from '../../../../convex/_generated/dataModel';
import { getCategoryMeta } from './categoryMeta';

export interface TemplateConfidenceContent {
  promise: string;
  benefits: string[];
  cue: string;
  startSmall: string;
  identity: string;
}

export function deriveConfidenceContent(
  template: Doc<'templates'>
): TemplateConfidenceContent {
  const meta = getCategoryMeta(template.category);
  const categorySubtitle = meta.subtitle?.toLowerCase() ?? 'builds lasting habits';

  const promise = template.suggestedWhy ?? template.description;

  const benefits =
    template.benefits && template.benefits.length > 0
      ? template.benefits
      : [template.scientificReference];

  const minutes = template.estimatedMinutes ?? 2;
  const nameLower = template.name.toLowerCase();

  const cue =
    template.suggestedCue ??
    `After I [context], I will ${nameLower} for ${minutes} minutes.`;

  const startSmall =
    template.startSmallVersion ?? `Just do ${nameLower} for 1 minute.`;

  const identity =
    template.suggestedIdentity ??
    `I am a person who ${categorySubtitle}.`;

  return { promise, benefits, cue, startSmall, identity };
}
