/**
 * Pure helpers for MakeItStickSheet.
 */

import type { Doc } from '../../../convex/_generated/dataModel';

const DEFAULT_CUES = ['After I brush my teeth', 'When I sit down at my desk'];

export function buildCueOptions(template: Doc<'templates'> | null): string[] {
  const suggested = template?.suggestedCue?.trim();
  return [...new Set([suggested, ...DEFAULT_CUES].filter(Boolean))] as string[];
}

export function buildRecapLabel(template: Doc<'templates'>): string {
  return template.startSmallVersion
    ? `${template.icon} ${template.name} · starting small: “${template.startSmallVersion}”`
    : `${template.icon} ${template.name}`;
}
