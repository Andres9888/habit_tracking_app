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
  frequency?: string;
  goalUnit?: string;
  // WOOP fields
  woopWish?: string;
  woopOutcome?: string;
  woopObstacle?: string;
  woopPlan?: string;
  // Visualization fields
  vizSuccessBody?: string;
  vizSuccessMind?: string;
  vizSuccessEmotion?: string;
  vizFailureBody?: string;
  vizFailureMind?: string;
  vizFailureEmotion?: string;
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
  frequency?: string;
  goalUnit?: string;
  // WOOP fields
  woopWish?: string;
  woopOutcome?: string;
  woopObstacle?: string;
  woopPlan?: string;
  // Visualization fields
  vizSuccessBody?: string;
  vizSuccessMind?: string;
  vizSuccessEmotion?: string;
  vizFailureBody?: string;
  vizFailureMind?: string;
  vizFailureEmotion?: string;
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

  // Optional: time fields
  const preferredTimeResult = validateTimeFormat(args.preferredTime, 'Preferred time');
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

  // Optional: WOOP fields (short text)
  const woopWishResult = validateShortText(args.woopWish, MAX_SHORT_TEXT_LENGTH, 'WOOP wish');
  const woopWish = requireValid(woopWishResult, args.woopWish);

  const woopOutcomeResult = validateLongText(args.woopOutcome, MAX_LONG_TEXT_LENGTH, 'WOOP outcome');
  const woopOutcome = requireValid(woopOutcomeResult, args.woopOutcome);

  const woopObstacleResult = validateLongText(args.woopObstacle, MAX_LONG_TEXT_LENGTH, 'WOOP obstacle');
  const woopObstacle = requireValid(woopObstacleResult, args.woopObstacle);

  const woopPlanResult = validateLongText(args.woopPlan, MAX_LONG_TEXT_LENGTH, 'WOOP plan');
  const woopPlan = requireValid(woopPlanResult, args.woopPlan);

  // Optional: Visualization fields (long text)
  const vizSuccessBodyResult = validateLongText(args.vizSuccessBody, MAX_LONG_TEXT_LENGTH, 'Success visualization (body)');
  const vizSuccessBody = requireValid(vizSuccessBodyResult, args.vizSuccessBody);

  const vizSuccessMindResult = validateLongText(args.vizSuccessMind, MAX_LONG_TEXT_LENGTH, 'Success visualization (mind)');
  const vizSuccessMind = requireValid(vizSuccessMindResult, args.vizSuccessMind);

  const vizSuccessEmotionResult = validateLongText(args.vizSuccessEmotion, MAX_LONG_TEXT_LENGTH, 'Success visualization (emotion)');
  const vizSuccessEmotion = requireValid(vizSuccessEmotionResult, args.vizSuccessEmotion);

  const vizFailureBodyResult = validateLongText(args.vizFailureBody, MAX_LONG_TEXT_LENGTH, 'Failure visualization (body)');
  const vizFailureBody = requireValid(vizFailureBodyResult, args.vizFailureBody);

  const vizFailureMindResult = validateLongText(args.vizFailureMind, MAX_LONG_TEXT_LENGTH, 'Failure visualization (mind)');
  const vizFailureMind = requireValid(vizFailureMindResult, args.vizFailureMind);

  const vizFailureEmotionResult = validateLongText(args.vizFailureEmotion, MAX_LONG_TEXT_LENGTH, 'Failure visualization (emotion)');
  const vizFailureEmotion = requireValid(vizFailureEmotionResult, args.vizFailureEmotion);

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
    woopWish,
    woopOutcome,
    woopObstacle,
    woopPlan,
    vizSuccessBody,
    vizSuccessMind,
    vizSuccessEmotion,
    vizFailureBody,
    vizFailureMind,
    vizFailureEmotion,
  };
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
    const notesResult = validateLongText(args.notes, MAX_LONG_TEXT_LENGTH, 'Notes');
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
    result.cueAfterBehavior = requireValid(cueAfterBehaviorResult, args.cueAfterBehavior);
  }

  if (args.icon !== undefined) {
    const iconResult = validateEmoji(args.icon, 'Icon');
    result.icon = requireValid(iconResult, args.icon);
  }

  if (args.color !== undefined) {
    const colorResult = validateColor(args.color, 'Habit color');
    result.color = requireValid(colorResult, args.color);
  }

  if (args.iconColor !== undefined) {
    const iconColorResult = validateColor(args.iconColor, 'Icon color');
    result.iconColor = requireValid(iconColorResult, args.iconColor);
  }

  if (args.preferredTime !== undefined) {
    const preferredTimeResult = validateTimeFormat(args.preferredTime, 'Preferred time');
    result.preferredTime = requireValid(preferredTimeResult, args.preferredTime);
  }

  if (args.reminderTime !== undefined) {
    const reminderTimeResult = validateTimeFormat(args.reminderTime, 'Reminder time');
    result.reminderTime = requireValid(reminderTimeResult, args.reminderTime);
  }

  if (args.reminderSound !== undefined) {
    const reminderSoundResult = validateIdentifier(args.reminderSound, 100, 'Reminder sound');
    result.reminderSound = requireValid(reminderSoundResult, args.reminderSound);
  }

  if (args.identity !== undefined) {
    const identityResult = validateShortText(args.identity, MAX_SHORT_TEXT_LENGTH, 'Identity');
    result.identity = requireValid(identityResult, args.identity);
  }

  if (args.why !== undefined) {
    const whyResult = validateLongText(args.why, MAX_LONG_TEXT_LENGTH, 'Why');
    result.why = requireValid(whyResult, args.why);
  }

  if (args.frequency !== undefined) {
    const frequencyResult = validateIdentifier(args.frequency, 50, 'Frequency');
    result.frequency = requireValid(frequencyResult, args.frequency);
  }

  if (args.goalUnit !== undefined) {
    const goalUnitResult = validateShortText(args.goalUnit, 50, 'Goal unit');
    result.goalUnit = requireValid(goalUnitResult, args.goalUnit);
  }

  // WOOP fields
  if (args.woopWish !== undefined) {
    const r = validateShortText(args.woopWish, MAX_SHORT_TEXT_LENGTH, 'WOOP wish');
    result.woopWish = requireValid(r, args.woopWish);
  }
  if (args.woopOutcome !== undefined) {
    const r = validateLongText(args.woopOutcome, MAX_LONG_TEXT_LENGTH, 'WOOP outcome');
    result.woopOutcome = requireValid(r, args.woopOutcome);
  }
  if (args.woopObstacle !== undefined) {
    const r = validateLongText(args.woopObstacle, MAX_LONG_TEXT_LENGTH, 'WOOP obstacle');
    result.woopObstacle = requireValid(r, args.woopObstacle);
  }
  if (args.woopPlan !== undefined) {
    const r = validateLongText(args.woopPlan, MAX_LONG_TEXT_LENGTH, 'WOOP plan');
    result.woopPlan = requireValid(r, args.woopPlan);
  }

  // Visualization fields
  if (args.vizSuccessBody !== undefined) {
    const r = validateLongText(args.vizSuccessBody, MAX_LONG_TEXT_LENGTH, 'Success visualization (body)');
    result.vizSuccessBody = requireValid(r, args.vizSuccessBody);
  }
  if (args.vizSuccessMind !== undefined) {
    const r = validateLongText(args.vizSuccessMind, MAX_LONG_TEXT_LENGTH, 'Success visualization (mind)');
    result.vizSuccessMind = requireValid(r, args.vizSuccessMind);
  }
  if (args.vizSuccessEmotion !== undefined) {
    const r = validateLongText(args.vizSuccessEmotion, MAX_LONG_TEXT_LENGTH, 'Success visualization (emotion)');
    result.vizSuccessEmotion = requireValid(r, args.vizSuccessEmotion);
  }
  if (args.vizFailureBody !== undefined) {
    const r = validateLongText(args.vizFailureBody, MAX_LONG_TEXT_LENGTH, 'Failure visualization (body)');
    result.vizFailureBody = requireValid(r, args.vizFailureBody);
  }
  if (args.vizFailureMind !== undefined) {
    const r = validateLongText(args.vizFailureMind, MAX_LONG_TEXT_LENGTH, 'Failure visualization (mind)');
    result.vizFailureMind = requireValid(r, args.vizFailureMind);
  }
  if (args.vizFailureEmotion !== undefined) {
    const r = validateLongText(args.vizFailureEmotion, MAX_LONG_TEXT_LENGTH, 'Failure visualization (emotion)');
    result.vizFailureEmotion = requireValid(r, args.vizFailureEmotion);
  }

  return result;
}
