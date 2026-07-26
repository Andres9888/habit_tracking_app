import {
  MAX_LONG_TEXT_LENGTH,
  MAX_SHORT_TEXT_LENGTH,
  requireValid,
  validateColor,
  validateEmoji,
  validateHabitName,
  validateIdentifier,
  validateLongText,
  validateShortText,
  validateTimeFormat,
} from '../lib/inputValidation';
import type { HabitArgs, ValidatedHabitFields } from './validation.types';

export function validateHabitUpdateFields(
  args: Partial<HabitArgs>
): Partial<ValidatedHabitFields> {
  const result: Partial<ValidatedHabitFields> = {};
  if (args.name !== undefined)
    result.name = requireValid(validateHabitName(args.name), args.name);
  if (args.notes !== undefined)
    result.notes = requireValid(
      validateLongText(args.notes, MAX_LONG_TEXT_LENGTH, 'Notes'),
      args.notes
    );
  if (args.cueTime !== undefined)
    result.cueTime = requireValid(
      validateTimeFormat(args.cueTime, 'Cue time'),
      args.cueTime
    );
  if (args.cueLocation !== undefined)
    result.cueLocation = requireValid(
      validateShortText(args.cueLocation, MAX_SHORT_TEXT_LENGTH, 'Cue location'),
      args.cueLocation
    );
  if (args.cueAfterBehavior !== undefined)
    result.cueAfterBehavior = requireValid(
      validateShortText(
        args.cueAfterBehavior,
        MAX_SHORT_TEXT_LENGTH,
        'Cue behavior'
      ),
      args.cueAfterBehavior
    );
  if (args.icon !== undefined)
    result.icon = requireValid(validateEmoji(args.icon, 'Icon'), args.icon);
  if (args.color !== undefined)
    result.color = requireValid(
      validateColor(args.color, 'Habit color'),
      args.color
    );
  if (args.iconColor !== undefined)
    result.iconColor = requireValid(
      validateColor(args.iconColor, 'Icon color'),
      args.iconColor
    );
  if (args.preferredTime !== undefined)
    result.preferredTime = requireValid(
      validateShortText(
        args.preferredTime,
        MAX_SHORT_TEXT_LENGTH,
        'Preferred time'
      ),
      args.preferredTime
    );
  if (args.reminderTime !== undefined)
    result.reminderTime = requireValid(
      validateTimeFormat(args.reminderTime, 'Reminder time'),
      args.reminderTime
    );
  if (args.reminderSound !== undefined)
    result.reminderSound = requireValid(
      validateIdentifier(args.reminderSound, 100, 'Reminder sound'),
      args.reminderSound
    );
  if (args.identity !== undefined)
    result.identity = requireValid(
      validateShortText(args.identity, MAX_SHORT_TEXT_LENGTH, 'Identity'),
      args.identity
    );
  if (args.why !== undefined)
    result.why = requireValid(
      validateLongText(args.why, MAX_LONG_TEXT_LENGTH, 'Why'),
      args.why
    );
  if (args.frequency !== undefined)
    result.frequency = requireValid(
      validateIdentifier(args.frequency, 50, 'Frequency'),
      args.frequency
    );
  if (args.goalUnit !== undefined)
    result.goalUnit = requireValid(
      validateShortText(args.goalUnit, 50, 'Goal unit'),
      args.goalUnit
    );
  return result;
}
