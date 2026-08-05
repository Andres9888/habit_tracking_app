/**
 * Jump-nav chip list for the science drill-down — mirrors which blocks
 * ScienceDrilldown actually renders for a given template (optional data).
 */

import type { Template } from '../../../../types/template';

export interface JumpNavItem {
  key: string;
  label: string;
}

export function getJumpNavItems(template?: Template): JumpNavItem[] {
  const items: JumpNavItem[] = [{ key: 'why', label: 'Why' }];
  if (template?.benefitDetails?.length) items.push({ key: 'feel', label: 'Feel' });
  if (template?.timeline?.length) items.push({ key: 'expect', label: 'Timeline' });
  if (template?.howToStart?.length || template?.tips?.length) {
    items.push({ key: 'start', label: 'Start' });
  }
  items.push({ key: 'automatic', label: 'Strength' });
  if (template?.sources?.length || template?.scientificReference) {
    items.push({ key: 'research', label: 'Research' });
  }
  return items;
}
