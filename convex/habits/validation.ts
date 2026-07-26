/**
 * Habit Input Validation (SEC-003)
 *
 * Validates all user-provided fields for habit mutations.
 */

import {
  validateHabitName,
  validateLongText,
  validateShortText,
  validateTimeFormat,
  validateColor,
  validateEmoji,
  validateIdentifier,
  requireValid,
  MAX_LONG_TEXT_LENGTH,
  MAX_SHORT_TEXT_LENGTH,
} from '../lib/inputValidation';
import type { HabitArgs, ValidatedHabitFields } from './validation.types';
export { validateHabitUpdateFields } from './validateHabitUpdateFields';

/**
 * Validate all habit fields and return sanitized values.
 * Throws on validation failure.
 */
export function validateHabitFields(args: HabitArgs): ValidatedHabitFields {
  // Required: name
  const nameResult = validateHabitName(args.name);
  const name = requireValid(nameResult, args.name);
  if (!name) {
    throw new Error('Habit name is required');
  }

  // Optional: notes (long text)
  const notesResult = validateLongText(args.notes, MAX_LONG_TEXT_LENGTH, 'Notes');
  const notes = requireValid(notesResult, args.notes);

  // Optional: cue fields (short text)
  const cueTimeResult = validateTimeFormat(args.cueTime, 'Cue time');
  const cueTime = requireValid(cueTimeResult, args.cueTime);

  const cueLocationResult = validateShortText(
    args.cueLocation,
    MAX_SHORT_TEXT_LENGTH,
    'Cue location'
  );
  const cueLocation = requireValid(cueLocationResult, args.cueLocation);

  const cueAfterBehaviorResult = validateShortText(
    args.cueAfterBehavior,
    MAX_SHORT_TEXT_LENGTH,
    'Cue behavior'
  );
  const cueAfterBehavior = requireValid(cueAfterBehaviorResult, args.cueAfterBehavior);

  // Optional: icon and color
  const iconResult = validateEmoji(args.icon, 'Icon');
  const icon = requireValid(iconResult, args.icon);

  const colorResult = validateColor(args.color, 'Habit color');
  const color = requireValid(colorResult, args.color);

  const iconColorResult = validateColor(args.iconColor, 'Icon color');
  const iconColor = requireValid(iconColorResult, args.iconColor);

  // Optional: preferredTime is a phase identifier (e.g. "phase1_push", "morning"), not a time string
  const preferredTimeResult = validateShortText(args.preferredTime, MAX_SHORT_TEXT_LENGTH, 'Preferred time');
  const preferredTime = requireValid(preferredTimeResult, args.preferredTime);

  const reminderTimeResult = validateTimeFormat(args.reminderTime, 'Reminder time');
  const reminderTime = requireValid(reminderTimeResult, args.reminderTime);

  // Optional: reminder sound (identifier)
  const reminderSoundResult = validateIdentifier(args.reminderSound, 100, 'Reminder sound');
  const reminderSound = requireValid(reminderSoundResult, args.reminderSound);

  // Optional: identity statement (short text)
  const identityResult = validateShortText(args.identity, MAX_SHORT_TEXT_LENGTH, 'Identity');
  const identity = requireValid(identityResult, args.identity);

  // Optional: why statement (long text)
  const whyResult = validateLongText(args.why, MAX_LONG_TEXT_LENGTH, 'Why');
  const why = requireValid(whyResult, args.why);

  // Optional: frequency (identifier)
  const frequencyResult = validateIdentifier(args.frequency, 50, 'Frequency');
  const frequency = requireValid(frequencyResult, args.frequency);

  // Optional: goal unit (short text)
  const goalUnitResult = validateShortText(args.goalUnit, 50, 'Goal unit');
  const goalUnit = requireValid(goalUnitResult, args.goalUnit);

  return {
    name,
    notes,
    cueTime,
    cueLocation,
    cueAfterBehavior,
    icon,
    color,
    iconColor,
    preferredTime,
    reminderTime,
    reminderSound,
    identity,
    why,
    frequency,
    goalUnit,
  };
}

/**
 * Validate weekly-schedule day indices (0 = Sunday … 6 = Saturday).
 * The `v.array(v.number())` arg validator accepts any numbers; this enforces
 * the domain invariant at every write path (create, update, template import).
 */
export function validateDaysOfWeek(days: number[] | undefined): void {
  if (days === undefined) return;
  if (days.length > 7) {
    throw new Error('daysOfWeek cannot contain more than 7 entries');
  }
  for (const day of days) {
    if (!Number.isInteger(day) || day < 0 || day > 6) {
      throw new Error('daysOfWeek entries must be integers between 0 and 6');
    }
  }
}
