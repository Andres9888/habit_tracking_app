import { v } from 'convex/values';
import { categoryValidator } from './types';

const growthTypeValidator = v.union(
  v.literal('simple'),
  v.literal('average'),
  v.literal('complex')
);

const benefitDetailValidator = v.object({
  description: v.string(),
  icon: v.string(),
  title: v.string(),
});

const timelineEntryValidator = v.object({
  description: v.string(),
  peak: v.optional(v.boolean()),
  title: v.string(),
  when: v.string(),
});

const scienceSourceValidator = v.object({
  authors: v.string(),
  journal: v.string(),
  link: v.optional(v.string()),
  title: v.string(),
  year: v.string(),
});

/** Full template document, including science drill-down for preview. */
export const templateDocValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('templates'),
  benefitDetails: v.optional(v.array(benefitDetailValidator)),
  benefits: v.optional(v.array(v.string())),
  cadenceLabel: v.optional(v.string()),
  category: categoryValidator,
  createdAt: v.number(),
  description: v.string(),
  estimatedMinutes: v.optional(v.number()),
  evidence: v.optional(v.string()),
  frequency: v.string(),
  growthType: v.optional(growthTypeValidator),
  howToStart: v.optional(v.array(v.string())),
  icon: v.string(),
  iconColor: v.string(),
  lead: v.optional(v.string()),
  name: v.string(),
  popularityScore: v.optional(v.number()),
  scientificLink: v.optional(v.string()),
  scientificReference: v.string(),
  sources: v.optional(v.array(scienceSourceValidator)),
  startSmallVersion: v.optional(v.string()),
  suggestedCue: v.optional(v.string()),
  suggestedIdentity: v.optional(v.string()),
  suggestedWhy: v.optional(v.string()),
  tagline: v.optional(v.string()),
  timeline: v.optional(v.array(timelineEntryValidator)),
  tips: v.optional(v.array(v.string())),
  youtubeLink: v.optional(v.string()),
});
