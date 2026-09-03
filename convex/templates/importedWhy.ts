/**
 * Resolves the starting `why` for a habit imported from a template.
 *
 * Priority: authored `suggestedWhy` → derived from `benefitDetails` titles →
 * template `description`. The template `tagline` is deliberately NOT in the
 * chain: it is a marketing hook ("Twenty-five minutes on, five off."), not a
 * reason the user would give for doing the habit.
 */

export const MAX_IMPORTED_WHY_LENGTH = 140;

type BenefitTitle = { title?: string };

export type ImportedWhyTemplate = {
  benefitDetails?: BenefitTitle[];
  description: string;
  suggestedWhy?: string;
};

/** Habit `why` copy is capped at 140 chars with an ellipsis. */
export const truncateWhy = (value: string) =>
  value.length <= MAX_IMPORTED_WHY_LENGTH
    ? value
    : `${value.slice(0, MAX_IMPORTED_WHY_LENGTH - 1).trimEnd()}…`;

/**
 * Builds a reason sentence from up to three benefit titles:
 * ["Calmer mind", "Sharper focus", "Steadier mood"]
 *   → "Calmer mind, sharper focus and steadier mood."
 */
export const deriveWhyFromBenefits = (
  benefitDetails?: BenefitTitle[]
): string | undefined => {
  const titles = (benefitDetails ?? [])
    .map((benefit) => benefit?.title?.trim())
    .filter((title): title is string => !!title)
    .slice(0, 3);
  if (titles.length === 0) return undefined;

  const parts = titles.map((title, index) =>
    index === 0 ? title : title.toLowerCase()
  );
  const last = parts[parts.length - 1];
  const joined =
    parts.length === 1 ? last : `${parts.slice(0, -1).join(', ')} and ${last}`;
  return `${joined.replace(/[.!?]+$/, '')}.`;
};

export const resolveImportedWhy = (
  template: ImportedWhyTemplate
): string | undefined => {
  const why =
    template.suggestedWhy?.trim() ||
    deriveWhyFromBenefits(template.benefitDetails) ||
    template.description.trim();
  if (!why) return undefined;
  return truncateWhy(why);
};

/**
 * True when `why` is a value this code previously auto-derived (the tagline or
 * the description, truncated or not) rather than something the user wrote.
 * Only these are safe to replace during backfill.
 */
export const isLegacyImportedWhy = (
  why: string,
  template: { description?: string; tagline?: string }
): boolean => {
  const trimmed = why.trim();
  if (!trimmed) return false;

  const derived = [template.tagline?.trim(), template.description?.trim()]
    .filter((value): value is string => !!value)
    .flatMap((value) => [value, truncateWhy(value)]);
  return derived.includes(trimmed);
};
