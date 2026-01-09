/**
 * Utility functions for TemplateScienceModal
 */

import type { Doc } from '../../../convex/_generated/dataModel';

/**
 * Convert hex color to rgba for valid color interpolation in Reanimated
 */
export const hexToRgba = (hex: string, alpha: number): string => {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

/**
 * Generate "Why It Works" text based on template data
 */
export function getWhyItWorksText(template: Doc<'templates'>): string {
  const name = template.name.toLowerCase();

  if (name.includes('meditation') || name.includes('mindfulness')) {
    return 'Regular meditation practice has been shown to reduce stress hormones, improve emotional regulation, and increase gray matter density in brain regions associated with learning and memory. Even brief daily sessions create lasting neurological changes.';
  }

  if (name.includes('water') || name.includes('hydration')) {
    return 'Proper hydration is essential for cognitive function, physical performance, and metabolic processes. Morning hydration is particularly important as the body is naturally dehydrated after 7-8 hours of sleep, and starting the day with water helps restore optimal function.';
  }

  if (
    name.includes('exercise') ||
    name.includes('workout') ||
    name.includes('fitness')
  ) {
    return 'Regular physical activity triggers the release of endorphins, improves cardiovascular health, strengthens muscles and bones, and enhances cognitive function. The cumulative effect of consistent exercise leads to significant improvements in both physical and mental well-being.';
  }

  if (name.includes('gratitude') || name.includes('journal')) {
    return 'Gratitude practices rewire the brain to focus on positive experiences, which improves mood, increases life satisfaction, and strengthens social relationships. Regular journaling creates a lasting shift in psychological well-being by training attention toward positive aspects of life.';
  }

  if (
    name.includes('sleep') ||
    name.includes('sunlight') ||
    name.includes('sunrise')
  ) {
    return 'Light exposure, particularly natural sunlight in the morning, is the primary zeitgeber (time-giver) for the circadian system. It helps regulate cortisol awakening response, improves alertness, mood, and sets the stage for better sleep quality at night.';
  }

  if (template.category === 'productivity') {
    return 'Research demonstrates that structured work approaches reduce decision fatigue, minimize distractions, and optimize cognitive resources. By establishing clear boundaries and focused work periods, productivity increases while mental exhaustion decreases.';
  }

  return 'Scientific research has consistently demonstrated the effectiveness of this habit pattern. Regular practice leads to measurable improvements in the targeted area through both physiological adaptations and behavioral reinforcement mechanisms.';
}

/**
 * Calculate estimated reading time based on template content
 */
export function calculateReadingTime(template: Doc<'templates'>): number {
  const text = `${template.name} ${template.description} ${template.scientificReference} ${getWhyItWorksText(template)}`;
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes);
}

/**
 * Confetti color palette
 */
export const CONFETTI_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#FFE66D',
  '#95E1D3',
  '#F38181',
  '#AA96DA',
  '#FCBAD3',
];

/**
 * Generate gradient colors based on template's icon color
 */
export const getGradientColors = (
  baseColor: string
): readonly [string, string, string] => [
  `${baseColor}15`,
  `${baseColor}08`,
  '#FAFAF9',
];
