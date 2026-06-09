/**
 * Category affinity helpers for template recommendations.
 */

import type { Doc } from '../../../../convex/_generated/dataModel';
import { GOAL_COLLECTIONS } from '../data/goalCollections';

export function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export function buildUserCategories(
  allTemplates: Doc<'templates'>[],
  importedTemplateIds: Set<string>,
  userHabitNames: string[]
): Set<string> {
  const habitNames = new Set(userHabitNames.map((name) => normalizeName(name)));
  const categories = new Set<string>();

  for (const template of allTemplates) {
    const matchesHabit = habitNames.has(normalizeName(template.name));
    const isImported = importedTemplateIds.has(template._id);
    if (matchesHabit || isImported) categories.add(template.category);
  }

  return categories;
}

export function buildGapCategories(userCategories: Set<string>): Set<string> {
  const gaps = new Set<string>();
  for (const goal of GOAL_COLLECTIONS) {
    const overlapsUser = goal.categories.some((category) =>
      userCategories.has(category)
    );
    if (!overlapsUser) continue;
    for (const category of goal.categories) {
      if (!userCategories.has(category)) gaps.add(category);
    }
  }
  return gaps;
}
