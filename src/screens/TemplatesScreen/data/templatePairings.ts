import type { Doc } from '../../../../convex/_generated/dataModel';

export interface TemplatePairing {
  templateName: string;
  reason: string;
}

export const TEMPLATE_PAIRINGS: Record<string, TemplatePairing[]> = {
  'Drink Water': [
    { reason: 'Stacks naturally after hydration', templateName: 'Morning Stretch' },
    { reason: 'Builds on the energy boost', templateName: '5-Min Walk' },
  ],
  'Morning Stretch': [
    { reason: 'Start with hydration before movement', templateName: 'Drink Water' },
    { reason: 'Amplify the energy from stretching', templateName: 'Cold Shower' },
  ],
  'Meditate': [
    { reason: 'Process what surfaced during meditation', templateName: 'Journal' },
    { reason: 'Pair calm with calm for maximum effect', templateName: 'Deep Breathing' },
  ],
};

export function getPairingsForTemplate(
  templateName: string,
  allTemplates: Doc<'templates'>[]
): { template: Doc<'templates'>; reason: string }[] {
  const pairs = TEMPLATE_PAIRINGS[templateName];
  if (pairs) {
    return pairs.flatMap(({ templateName: pairName, reason }) => {
      const t = allTemplates.find((tmpl) => tmpl.name === pairName);
      return t ? [{ reason, template: t }] : [];
    });
  }
  const source = allTemplates.find((t) => t.name === templateName);
  if (!source) return [];
  return allTemplates
    .filter((t) => t.name !== templateName && t.category === source.category)
    .sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0))
    .slice(0, 2)
    .map((t) => ({ reason: 'Popular in the same category', template: t }));
}
