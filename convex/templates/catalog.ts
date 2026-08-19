import { v } from 'convex/values';
import type { Doc } from '../_generated/dataModel';
import { categoryValidator } from './types';

/**
 * Catalog card payload. Omits science drill-down (sources, timeline, lead,
 * evidence, benefitDetails, howToStart) which the preview loads via getById.
 */
export const catalogTemplateValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('templates'),
  cadenceLabel: v.optional(v.string()),
  category: categoryValidator,
  createdAt: v.number(),
  description: v.string(),
  estimatedMinutes: v.optional(v.number()),
  frequency: v.string(),
  growthType: v.optional(
    v.union(v.literal('simple'), v.literal('average'), v.literal('complex'))
  ),
  icon: v.string(),
  iconColor: v.string(),
  name: v.string(),
  popularityScore: v.optional(v.number()),
  scientificReference: v.string(),
  startSmallVersion: v.optional(v.string()),
  suggestedCue: v.optional(v.string()),
  suggestedIdentity: v.optional(v.string()),
  suggestedWhy: v.optional(v.string()),
  tagline: v.optional(v.string()),
  tips: v.optional(v.array(v.string())),
});

export function projectCatalogTemplate(template: Doc<'templates'>) {
  return {
    _creationTime: template._creationTime,
    _id: template._id,
    cadenceLabel: template.cadenceLabel,
    category: template.category,
    createdAt: template.createdAt,
    description: template.description,
    estimatedMinutes: template.estimatedMinutes,
    frequency: template.frequency,
    growthType: template.growthType,
    icon: template.icon,
    iconColor: template.iconColor,
    name: template.name,
    popularityScore: template.popularityScore,
    scientificReference: template.scientificReference,
    startSmallVersion: template.startSmallVersion,
    suggestedCue: template.suggestedCue,
    suggestedIdentity: template.suggestedIdentity,
    suggestedWhy: template.suggestedWhy,
    tagline: template.tagline,
    tips: template.tips,
  };
}
