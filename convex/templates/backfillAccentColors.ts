/**
 * One-shot backfill: replace unreadable (near-white) accent colours.
 *
 * Templates seeded with e.g. `#FFFFFF` produced habits whose accent bar and
 * check-in cells rendered invisible. Both the template rows and any habits
 * imported from them are patched. Run via
 * `npx convex run templates/backfillAccentColors:backfillAccentColors`.
 */
import { internalMutation } from '../_generated/server';
import { isUsableAccentColor } from '../lib/inputValidation';

const DEFAULT_ACCENT_COLOR = '#10B981';

/** Curated replacements for the seed rows that shipped with white accents. */
const TEMPLATE_OVERRIDES: Record<string, string> = {
  'daily flossing': '#0EA5E9',
  'calcium intake tracking': '#14B8A6',
};

function replacementFor(name: string): string {
  return TEMPLATE_OVERRIDES[name.trim().toLowerCase()] ?? DEFAULT_ACCENT_COLOR;
}

export const backfillAccentColors = internalMutation({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db.query('templates').collect();
    const patchedTemplates: string[] = [];
    for (const template of templates) {
      if (isUsableAccentColor(template.iconColor)) continue;
      await ctx.db.patch(template._id, {
        iconColor: replacementFor(template.name),
      });
      patchedTemplates.push(template.name);
    }

    const habits = await ctx.db.query('habits').collect();
    const patchedHabits: string[] = [];
    for (const habit of habits) {
      const badColor = habit.color !== undefined && !isUsableAccentColor(habit.color);
      const badIconColor =
        habit.iconColor !== undefined && !isUsableAccentColor(habit.iconColor);
      if (!badColor && !badIconColor) continue;
      const next = replacementFor(habit.name);
      await ctx.db.patch(habit._id, {
        ...(badColor ? { color: next } : {}),
        ...(badIconColor ? { iconColor: next } : {}),
      });
      patchedHabits.push(habit.name);
    }

    return { patchedHabits, patchedTemplates };
  },
});
