import { useMemo } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Mutations } from './processItem';

export function useMutations(): Mutations {
  const updateHabit = useMutation(api.habits.update);

  return useMemo(
    () =>
      ({
        updateHabit,
      }) as Mutations,
    [updateHabit]
  );
}
