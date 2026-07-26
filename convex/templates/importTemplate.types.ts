import type { Infer } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { progressEmojisValidator } from '../lib/progressEmojisValidator';

export interface ImportTemplateArgs {
  customizations?: {
    daysOfWeek?: number[];
    icon?: string;
    iconColor?: string;
    name?: string;
    preferredTime?: string;
    progressEmojis?: Infer<typeof progressEmojisValidator>;
    reminderTime?: string;
    streakGoal?: number;
    strengthAlgorithm?: 'forgiving' | 'balanced' | 'strict';
  };
  templateId: Id<'templates'>;
}
