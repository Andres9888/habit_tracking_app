/**
 * Jump-chip sections for the science drill-down. `availableSections` mirrors the
 * conditional rendering inside each block, so chips only appear for sections that
 * actually render for a given template.
 */

import type { Template } from '../../../types/template';

export type SectionKey = 'why' | 'feel' | 'timeline' | 'start' | 'strength' | 'research';

export interface SectionMeta {
  key: SectionKey;
  label: string;
}

export const SECTIONS: SectionMeta[] = [
  { key: 'why', label: 'Why' },
  { key: 'feel', label: 'Feel' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'start', label: 'Start' },
  { key: 'strength', label: 'Strength' },
  { key: 'research', label: 'Research' },
];

function has(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}

export function availableSections(template: Template): SectionKey[] {
  const present: Record<SectionKey, boolean> = {
    why: Boolean(template?.lead || template?.evidence || template?.scientificReference),
    feel: has(template?.benefitDetails),
    timeline: has(template?.timeline),
    start: has(template?.howToStart) || has(template?.tips),
    strength: true,
    research: has(template?.sources) || Boolean(template?.scientificReference),
  };
  return SECTIONS.map((section) => section.key).filter((key) => present[key]);
}
