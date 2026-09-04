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
  validateAccentColor,
  validateEmoji,
  validateIdentifier,
  requireValid,
  MAX_LONG_TEXT_LENGTH,
  MAX_SHORT_TEXT_LENGTH,
} from '../lib/inputValidation';
import { validateMotivationFields } from './validateMotivationFields';

/** Habit creation/update arguments */
interface HabitArgs {
  name?: string;
  notes?: string;
  cueTime?: string;
  cueLocation?: string;
  cueAfterBehavior?: string;
  icon?: string;
  color?: string;
  iconColor?: string;
  preferredTime?: string;
  reminderTime?: string;
  reminderSound?: string;
  identity?: string;
  why?: string;
  woopObstacle?: string;
  woopOutcome?: string;
  woopPlan?: string;
  woopWish?: string;
  frequency?: string;
  goalUnit?: string;
}

/** Validated habit fields */
interface ValidatedHabitFields {
  name: string;
  notes?: string;
  cueTime?: string;
  cueLocation?: string;
  cueAfterBehavior?: string;
  icon?: string;
  color?: string;
  iconColor?: string;
  preferredTime?: string;
  reminderTime?: string;
  reminderSound?: string;
  identity?: string;
  why?: string;
  woopObstacle?: string;
  woopOutcome?: string;
  woopPlan?: string;
  woopWish?: string;
  frequency?: string;
  goalUnit?: string;
}

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
  const notesResult = validateLongText(
    args.notes,
    MAX_LONG_TEXT_LENGTH,
    'Notes'
  );
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
  const cueAfterBehavior = requireValid(
    cueAfterBehaviorResult,
    args.cueAfterBehavior
  );

  // Optional: icon and color
  const iconResult = validateEmoji(args.icon, 'Icon');
  const icon = requireValid(iconResult, args.icon);

  const colorResult = validateAccentColor(args.color, 'Habit color');
  const color = requireValid(colorResult, args.color);

  const iconColorResult = validateAccentColor(args.iconColor, 'Icon color');
  const iconColor = requireValid(iconColorResult, args.iconColor);

  // Optional: preferredTime is a phase identifier (e.g. "phase1_push", "morning"), not a time string
  const preferredTimeResult = validateShortText(
    args.preferredTime,
    MAX_SHORT_TEXT_LENGTH,
    'Preferred time'
  );
  const preferredTime = requireValid(preferredTimeResult, args.preferredTime);

  const reminderTimeResult = validateTimeFormat(
    args.reminderTime,
    'Reminder time'
  );
  const reminderTime = requireValid(reminderTimeResult, args.reminderTime);

  // Optional: reminder sound (identifier)
  const reminderSoundResult = validateIdentifier(
    args.reminderSound,
    100,
    'Reminder sound'
  );
  const reminderSound = requireValid(reminderSoundResult, args.reminderSound);

  const motivation = validateMotivationFields(args);

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
    ...motivation,
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

/**
 * Validate habit update fields (all optional).
 */
export function validateHabitUpdateFields(
  args: Partial<HabitArgs>
): Partial<ValidatedHabitFields> {
  const result: Partial<ValidatedHabitFields> = {};

  if (args.name !== undefined) {
    const nameResult = validateHabitName(args.name);
    result.name = requireValid(nameResult, args.name);
  }

  if (args.notes !== undefined) {
    const notesResult = validateLongText(
      args.notes,
      MAX_LONG_TEXT_LENGTH,
      'Notes'
    );
    result.notes = requireValid(notesResult, args.notes);
  }

  if (args.cueTime !== undefined) {
    const cueTimeResult = validateTimeFormat(args.cueTime, 'Cue time');
    result.cueTime = requireValid(cueTimeResult, args.cueTime);
  }

  if (args.cueLocation !== undefined) {
    const cueLocationResult = validateShortText(
      args.cueLocation,
      MAX_SHORT_TEXT_LENGTH,
      'Cue location'
    );
    result.cueLocation = requireValid(cueLocationResult, args.cueLocation);
  }

  if (args.cueAfterBehavior !== undefined) {
    const cueAfterBehaviorResult = validateShortText(
      args.cueAfterBehavior,
      MAX_SHORT_TEXT_LENGTH,
      'Cue behavior'
    );
    result.cueAfterBehavior = requireValid(
      cueAfterBehaviorResult,
      args.cueAfterBehavior
    );
  }

  if (args.icon !== undefined) {
    const iconResult = validateEmoji(args.icon, 'Icon');
    result.icon = requireValid(iconResult, args.icon);
  }

  if (args.color !== undefined) {
    const colorResult = validateAccentColor(args.color, 'Habit color');
    result.color = requireValid(colorResult, args.color);
  }

  if (args.iconColor !== undefined) {
    const iconColorResult = validateAccentColor(args.iconColor, 'Icon color');
    result.iconColor = requireValid(iconColorResult, args.iconColor);
  }

  if (args.preferredTime !== undefined) {
    const preferredTimeResult = validateShortText(
      args.preferredTime,
      MAX_SHORT_TEXT_LENGTH,
      'Preferred time'
    );
    result.preferredTime = requireValid(
      preferredTimeResult,
      args.preferredTime
    );
  }

  if (args.reminderTime !== undefined) {
    const reminderTimeResult = validateTimeFormat(
      args.reminderTime,
      'Reminder time'
    );
    result.reminderTime = requireValid(reminderTimeResult, args.reminderTime);
  }

  if (args.reminderSound !== undefined) {
    const reminderSoundResult = validateIdentifier(
      args.reminderSound,
      100,
      'Reminder sound'
    );
    result.reminderSound = requireValid(
      reminderSoundResult,
      args.reminderSound
    );
  }

  Object.assign(result, validateMotivationFields(args));

  if (args.frequency !== undefined) {
    const frequencyResult = validateIdentifier(args.frequency, 50, 'Frequency');
    result.frequency = requireValid(frequencyResult, args.frequency);
  }

  if (args.goalUnit !== undefined) {
    const goalUnitResult = validateShortText(args.goalUnit, 50, 'Goal unit');
    result.goalUnit = requireValid(goalUnitResult, args.goalUnit);
  }

  return result;
}
