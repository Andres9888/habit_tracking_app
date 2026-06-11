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

const MAX_CITATION_LENGTH = 26;

export function getShortCitation(template: Doc<'templates'>): string | null {
  const reference = template.scientificReference?.trim();
  if (!reference) return null;
  const short = reference.split(' - ')[0]?.trim();
  if (short && short.length <= MAX_CITATION_LENGTH && short.includes('(')) {
    return short;
  }
  return 'Research-backed';
}

export function getScienceDoorLabel(template: Doc<'templates'>): string {
  const citation = getShortCitation(template);
  if (citation && citation !== 'Research-backed') {
    return `🔬 ${citation} ›`;
  }
  return '🔬 Why it works ›';
}
