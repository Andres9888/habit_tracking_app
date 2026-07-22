/**
 * Meta label for habit template cards, e.g. "7 min · Daily".
 */

import type { Doc } from '../../../../../convex/_generated/dataModel';

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getTemplateMetaLabel(template: Doc<'templates'>): string {
  const parts: string[] = [];
  if (template.estimatedMinutes) parts.push(`${template.estimatedMinutes} min`);
  if (template.frequency) parts.push(capitalize(template.frequency));
  return parts.join(' · ');
}
