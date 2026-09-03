/**
 * `suggestedWhy` copy for templates with NO science drill-down entry.
 *
 * Every other file in this directory authors a full drill-down (tagline, lead,
 * evidence, timeline, sources). The templates below have none — they are live
 * in the library but were never enriched, so they had no place to carry a
 * "Your why". This file exists only to give them one.
 *
 * Each entry therefore contains `suggestedWhy` and nothing else. Every field of
 * `ScienceEnrichment` is optional and `patchScienceEnrichment` writes only the
 * fields present, so a why-only entry adds the why without fabricating a
 * drill-down: the Science-backed badge and the drill-down sections stay hidden.
 *
 * Each why is grounded strictly in that template's own seed `description`,
 * `scientificReference`, and (for 5-Minute Meditation) its inline `lead` and
 * `benefitDetails` in `convex/templatesDataSeed.ts`. No new claims, numbers, or
 * citations. Where the seed hedges, the why hedges.
 *
 * Keys here must NOT exist in any other file in this directory: this module is
 * spread last in `SCIENCE_ENRICHMENT`, so a duplicate key would replace that
 * template's whole authored drill-down with a why-only entry.
 *
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const UNCOVERED_ENRICHMENT: Record<string, ScienceEnrichment> = {
  '5-Minute Meditation': {
    suggestedWhy:
      'A few quiet minutes train attention and lower stress reactivity, so the whole day feels calmer and less scattered.',
  },
  'Daily Social Call': {
    suggestedWhy:
      'Regular contact keeps close relationships active, and strong social ties support mental health and longevity.',
  },
  'Annual Eye Exam': {
    suggestedWhy:
      'A yearly check catches vision-threatening disease early, while it can still be treated rather than managed.',
  },
  'Annual Hearing Test': {
    suggestedWhy:
      'A yearly check catches hearing loss early, which supports prevention and keeps everyday conversation easier.',
  },
  'Monthly Skin Self-Exam': {
    suggestedWhy:
      'Looking monthly makes a changing spot easy to notice early, and early detection improves skin cancer outcomes.',
  },
  'Vaccination Status Review': {
    suggestedWhy:
      'One yearly look at your record keeps recommended vaccines up to date, which prevents avoidable illness.',
  },
};
