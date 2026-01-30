import type { Id } from '../../../convex/_generated/dataModel';

export interface ForceUpdateButtonProps {
  habitId: Id<'habits'>;
  habitName: string;
  currentStrength: number;
}

export type UpdateStrengthResponse = {
  baseline: number;
  compliance: number;
  daysSinceCreation: number;
  newStrength: number;
  predictionProbability: number;
  previousStrength: number;
  strengthLevel: string;
};

export const assertUpdateStrengthResponse: (
  response: unknown
) => asserts response is UpdateStrengthResponse = (response: unknown) => {
  if (!response || typeof response !== 'object') {
    throw new Error('Unexpected empty response from updateHabitStrength');
  }

  const candidate = response as Partial<UpdateStrengthResponse>;
  if (
    typeof candidate.previousStrength !== 'number' ||
    typeof candidate.newStrength !== 'number'
  ) {
    throw new TypeError('updateHabitStrength returned unexpected payload');
  }
};
