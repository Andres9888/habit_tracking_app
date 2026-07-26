import type { Doc } from '../_generated/dataModel';
import {
  MAX_HABIT_NAME_LENGTH,
  requireValid,
  validateColor,
  validateHabitName,
  validateTimeFormat,
} from '../lib/inputValidation';
import type { ImportTemplateArgs } from './importTemplate.types';

export function validateImportCustomizations(
  template: Doc<'templates'>,
  customizations: ImportTemplateArgs['customizations']
) {
  let name = template.name;
  if (customizations?.name !== undefined) {
    name = requireValid(
      validateHabitName(customizations.name),
      customizations.name
    );
    if (!name) throw new Error('Custom habit name cannot be empty');
    if (name.length > MAX_HABIT_NAME_LENGTH) {
      throw new Error(
        `Custom habit name cannot exceed ${MAX_HABIT_NAME_LENGTH} characters`
      );
    }
  }

  let iconColor = template.iconColor;
  if (customizations?.iconColor !== undefined) {
    iconColor =
      requireValid(
        validateColor(customizations.iconColor, 'Icon color'),
        customizations.iconColor
      ) ?? template.iconColor;
  }

  let reminderTime = customizations?.reminderTime;
  if (reminderTime !== undefined) {
    reminderTime = requireValid(
      validateTimeFormat(reminderTime, 'Reminder time'),
      reminderTime
    );
  }
  return { iconColor, name, reminderTime };
}

export function resolveImportedStrengthAlgorithm(
  template: Doc<'templates'>,
  customizations: ImportTemplateArgs['customizations']
) {
  if (customizations?.strengthAlgorithm) {
    return { strengthAlgorithm: customizations.strengthAlgorithm };
  }
  const minutes = template.estimatedMinutes;
  if (typeof minutes !== 'number') return {};
  const strengthAlgorithm =
    minutes <= 2 ? 'forgiving' : minutes <= 20 ? 'balanced' : 'strict';
  return { strengthAlgorithm } as const;
}
