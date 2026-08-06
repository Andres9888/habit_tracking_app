/**
 * Science drill-down content for the template library — aggregator.
 *
 * Content lives in per-category files under `scienceEnrichment/`. This module
 * merges them into one name-keyed record consumed by
 * `patchScienceEnrichment` (existing installs) and `templatesDataSeed`
 * (fresh installs).
 *
 * Keys must match the template's `name` exactly as seeded. The patch mutation
 * reports any key that matched no row under `unmatchedNames` — check that
 * after adding a batch.
 *
 * ## Authoring rules
 *
 * 1. `sources` must be REAL, checkable papers. Never invent a citation. When a
 *    habit has no primary literature behind it, omit `evidence` and `sources`
 *    entirely — the UI then hides the "Science-backed" badge rather than
 *    borrowing credibility the habit does not have.
 * 2. `evidence` states what a study actually found. If you cannot state the
 *    finding precisely, leave it out; the template's own
 *    `scientificReference` still renders as the fallback.
 * 3. `lead` explains the mechanism in plain language — it is interpretation,
 *    not a citation, so it may be authored freely as long as it is accurate.
 *    Say so plainly where evidence is weak or contested.
 * 4. `timeline` last entry should set `peak: true` (the automaticity milestone).
 * 5. `benefitDetails.icon` must be one of: wave, moon, target, leaf, sparkle.
 * 6. Anything with a safety dimension (cold, heat, breath holds, supplements,
 *    mouth taping) carries the caveat in `howToStart`, not in small print.
 * 7. Every field is optional. A partial entry degrades cleanly — the UI only
 *    renders sections whose data exists.
 */

import type { ScienceEnrichment } from './types';
import { BEHAVIOR_DESIGN_ENRICHMENT } from './scienceEnrichment/behaviorDesign.data';
import { BREATHING_ENRICHMENT } from './scienceEnrichment/breathing.data';
import { HEALTH_FITNESS_ENRICHMENT } from './scienceEnrichment/healthFitness.data';
import { HEALTH_MOVEMENT_ENRICHMENT } from './scienceEnrichment/healthMovement.data';
import { HEALTH_PREVENTIVE_ENRICHMENT } from './scienceEnrichment/healthPreventive.data';
import { HEALTH_NUTRITION_ENRICHMENT } from './scienceEnrichment/healthNutrition.data';
import { LEARNING_ENRICHMENT } from './scienceEnrichment/learning.data';
import { CREATIVITY_ENRICHMENT } from './scienceEnrichment/creativity.data';
import { LONGEVITY_ENRICHMENT } from './scienceEnrichment/longevity.data';
import { MENTAL_HEALTH_ENRICHMENT } from './scienceEnrichment/mentalHealth.data';
import { MINDFULNESS_ENRICHMENT } from './scienceEnrichment/mindfulness.data';
import { MORNING_ROUTINE_ENRICHMENT } from './scienceEnrichment/morningRoutine.data';
import { RECOVERY_ENRICHMENT } from './scienceEnrichment/recovery.data';
import { SOCIAL_ENRICHMENT } from './scienceEnrichment/social.data';
import { SLEEP_ENRICHMENT } from './scienceEnrichment/sleep.data';
import { FINANCIAL_ENRICHMENT } from './scienceEnrichment/financial.data';
import { HUBERMAN_ENRICHMENT } from './scienceEnrichment/huberman.data';
import { PRODUCTIVITY_ENRICHMENT } from './scienceEnrichment/productivity.data';

export const SCIENCE_ENRICHMENT: Record<string, ScienceEnrichment> = {
  ...BEHAVIOR_DESIGN_ENRICHMENT,
  ...BREATHING_ENRICHMENT,
  ...HEALTH_FITNESS_ENRICHMENT,
  ...HEALTH_MOVEMENT_ENRICHMENT,
  ...HEALTH_PREVENTIVE_ENRICHMENT,
  ...HEALTH_NUTRITION_ENRICHMENT,
  ...SOCIAL_ENRICHMENT,
  ...SLEEP_ENRICHMENT,
  ...MORNING_ROUTINE_ENRICHMENT,
  ...RECOVERY_ENRICHMENT,
  ...MENTAL_HEALTH_ENRICHMENT,
  ...MINDFULNESS_ENRICHMENT,
  ...LEARNING_ENRICHMENT,
  ...CREATIVITY_ENRICHMENT,
  ...LONGEVITY_ENRICHMENT,
  ...FINANCIAL_ENRICHMENT,
  ...HUBERMAN_ENRICHMENT,
  ...PRODUCTIVITY_ENRICHMENT,
};
