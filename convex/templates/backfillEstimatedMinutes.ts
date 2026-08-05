import { internalMutation } from '../_generated/server';

const CATEGORY_DEFAULTS: Record<string, number> = {
  breathing: 2,
  subtraction: 2,
  environmental_design: 2,
  mindfulness: 5,
  mental_health: 5,
  morning_routine: 5,
  productivity: 5,
  sleep: 5,
  social: 5,
  recovery: 5,
  creativity: 5,
  financial: 5,
  health_fitness: 25,
  learning: 25,
  andrew_huberman: 25,
  longevity: 25,
};

function parseExplicitMinutes(text: string): number | null {
  const t = text.toLowerCase();
  const sec = t.match(/(\d+)\s*(?:seconds?|secs?\b)/);
  if (sec) return Math.max(1, Math.round(Number(sec[1]) / 60));
  const min = t.match(/(\d+)(?:\s*[-–to ]+\s*\d+)?\s*(?:minutes?|mins?\b|min\b)/);
  if (min) return Number(min[1]);
  const hr = t.match(/(\d+)\s*(?:hours?|hrs?\b)/);
  if (hr) return Number(hr[1]) * 60;
  return null;
}

function nameOverride(name: string): number | null {
  const n = name.toLowerCase();
  if (/cold\s+(shower|plunge)/.test(n)) return 3;
  if (/\bmeditat/.test(n)) return 10;
  if (/\bjournal/.test(n)) return 5;
  if (/\b(run|running|workout|exercise|gym|jog|hiit)\b/.test(n)) return 30;
  if (/\bwalk/.test(n)) return 30;
  if (/\bread\b|reading\b/.test(n)) return 20;
  if (/\bstretch/.test(n)) return 5;
  if (/\byoga\b/.test(n)) return 30;
  if (/\bbreath/.test(n)) return 5;
  if (/\bgratitude\b/.test(n)) return 3;
  if (/\bhydrat|water\b|drink/.test(n)) return 1;
  if (/\bfloss/.test(n)) return 2;
  if (/\bmake.*bed\b/.test(n)) return 2;
  if (/\bsunlight\b|sun gaz/.test(n)) return 5;
  return null;
}

function inferMinutes(name: string, description: string, category: string): number {
  const explicit = parseExplicitMinutes(name) ?? parseExplicitMinutes(description);
  if (explicit !== null) return explicit;
  const nm = nameOverride(name);
  if (nm !== null) return nm;
  return CATEGORY_DEFAULTS[category] ?? 5;
}

export const backfillEstimatedMinutes = internalMutation({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db.query('templates').collect();
    let patched = 0;
    let skipped = 0;
    for (const template of templates) {
      if (typeof template.estimatedMinutes === 'number') {
        skipped++;
        continue;
      }
      const minutes = inferMinutes(
        template.name,
        template.description,
        template.category
      );
      await ctx.db.patch(template._id, { estimatedMinutes: minutes });
      patched++;
    }
    return { patched, skipped, total: templates.length };
  },
});
