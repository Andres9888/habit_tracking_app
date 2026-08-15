import { FREE_STARTER_TEMPLATE_NAMES } from './freeStarterTemplateNames';
import { PREMIUM_TEMPLATE_NAMES } from './premiumTemplateNames';
import type { TemplateCategory } from './types';

const FREE_STARTERS = new Set(
  FREE_STARTER_TEMPLATE_NAMES.map((name) => name.trim().toLowerCase())
);
const PREMIUM_NAMES = new Set(
  PREMIUM_TEMPLATE_NAMES.map((name) => name.trim().toLowerCase())
);

export function isPremiumTemplate(
  name: string,
  category?: TemplateCategory | string
): boolean {
  const key = name.trim().toLowerCase();
  if (FREE_STARTERS.has(key)) return false;
  if (category === 'andrew_huberman') return true;
  return PREMIUM_NAMES.has(key);
}

export function withPremiumFlag<T extends { category: string; name: string }>(
  template: T
): T & { isPremium: boolean } {
  return {
    ...template,
    isPremium: isPremiumTemplate(template.name, template.category),
  };
}
