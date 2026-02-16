import { useMemo } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Mutations } from './processItem';

export function useMutations(): Mutations {
  const upsertReflection = useMutation(api.reflections.upsert);
  const createLetter = useMutation(api.letters.create);
  const createAffirmation = useMutation(api.affirmations.create);
  const updateHabit = useMutation(api.habits.update);

  return useMemo(
    () =>
      ({
        createAffirmation,
        createLetter,
        updateHabit,
        upsertReflection,
      }) as Mutations,
    [createAffirmation, createLetter, updateHabit, upsertReflection]
  );
}
