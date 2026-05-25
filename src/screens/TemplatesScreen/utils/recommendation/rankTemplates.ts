import type { Doc } from '../../../../../convex/_generated/dataModel';
import { generateWhyThisMatches } from './matchExplanation';
import {
  scoreAdherence,
  scoreCategoryFit,
  scoreEvidence,
  scorePopularity,
  scoreStyleFit,
  scoreTimeFit,
} from './scoreFactors';
import type { RankedTemplate, RecommendationInput, RecommendationReason } from './types';

function tieBreak(a: RankedTemplate, b: RankedTemplate): number {
  const aReasons = a.reasons.filter((r) => r.contribution > 0).length;
  const bReasons = b.reasons.filter((r) => r.contribution > 0).length;
  if (aReasons !== bReasons) return bReasons - aReasons;
  const aPop = a.template.popularityScore ?? 0;
  const bPop = b.template.popularityScore ?? 0;
  if (aPop !== bPop) return bPop - aPop;
  const aHasScience = a.template.scientificReference ? 1 : 0;
  const bHasScience = b.template.scientificReference ? 1 : 0;
  if (aHasScience !== bHasScience) return bHasScience - aHasScience;
  const aMins = a.template.estimatedMinutes ?? 99;
  const bMins = b.template.estimatedMinutes ?? 99;
  if (aMins !== bMins) return aMins - bMins;
  const aDate = a.template.createdAt ?? 0;
  const bDate = b.template.createdAt ?? 0;
  if (aDate !== bDate) return bDate - aDate;
  return a.template._id < b.template._id ? -1 : 1;
}

function scoreTemplate(
  t: Doc<'templates'>,
  input: RecommendationInput
): RankedTemplate {
  const reasons: RecommendationReason[] = [];
  let total = 0;

  const cat = scoreCategoryFit(t, input);
  total += cat.score;
  if (cat.reason) reasons.push(cat.reason);

  const time = scoreTimeFit(t, input.timeBucket);
  total += time.score;
  if (time.reason) reasons.push(time.reason);

  const style = scoreStyleFit(t, input.stylePreference);
  total += style.score;
  if (style.reason) reasons.push(style.reason);

  const ev = scoreEvidence(t);
  total += ev.score;
  if (ev.reason) reasons.push(ev.reason);

  const adh = scoreAdherence(t);
  total += adh.score;
  if (adh.reason) reasons.push(adh.reason);

  const pop = scorePopularity(t);
  total += pop.score;

  return { reasons, score: total, template: t, whyThisMatches: generateWhyThisMatches(reasons) };
}

export function rankTemplatesForUser(
  templates: Doc<'templates'>[],
  input: RecommendationInput
): RankedTemplate[] {
  const limit = input.limit ?? 3;
  const ranked = templates.map((t) => scoreTemplate(t, input)).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return tieBreak(a, b);
  });

  const passing = ranked.filter((r) => r.score > 0);
  if (passing.length >= limit) return passing.slice(0, limit);
  return ranked.slice(0, limit);
}
