/**
 * Sanitizes why / identity / WOOP fields on habit writes.
 */
import {
  MAX_LONG_TEXT_LENGTH,
  MAX_SHORT_TEXT_LENGTH,
  requireValid,
  validateLongText,
} from '../lib/inputValidation';

export const MOTIVATION_FIELD_KEYS = [
  'why',
  'identity',
  'woopWish',
  'woopOutcome',
  'woopObstacle',
  'woopPlan',
] as const;

export type MotivationFieldKey = (typeof MOTIVATION_FIELD_KEYS)[number];
export type MotivationFields = Partial<Record<MotivationFieldKey, string>>;

const LABELS: Record<MotivationFieldKey, string> = {
  identity: 'Identity',
  why: 'Why',
  woopObstacle: 'Obstacle',
  woopOutcome: 'Outcome',
  woopPlan: 'Plan',
  woopWish: 'Wish',
};

export function validateMotivationFields(
  args: MotivationFields
): MotivationFields {
  const result: MotivationFields = {};
  for (const key of MOTIVATION_FIELD_KEYS) {
    if (args[key] === undefined) continue;
    const max = key === 'why' ? MAX_LONG_TEXT_LENGTH : MAX_SHORT_TEXT_LENGTH;
    result[key] = requireValid(
      validateLongText(args[key], max, LABELS[key]),
      args[key]
    );
  }
  return result;
}
