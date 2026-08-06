import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'convex/react';
import { pickNextHabitNamePlaceholderOnOpen } from '@/constants/habitNamePlaceholderPick';
import {
  getHabitNamePlaceholderCursor,
  setHabitNamePlaceholderCursor,
} from '@/utils/habitNamePlaceholderCursor';
import { api } from '../../../../convex/_generated/api';
import { useCachedQuery } from '../../../lib/queryCache';

export type HabitNamePlaceholderState = {
  isReady: boolean;
  placeholder: string;
};

/** Next top-ranked library placeholder; advances each time add-habit opens. */
export function useHabitNamePlaceholder(
  active: boolean
): HabitNamePlaceholderState {
  const templates = useQuery(api.templates.list, {});
  const habits = useCachedQuery(
    api.habits.list,
    {},
    {
      entryName: 'habits.list',
    }
  );
  const importedIds = useQuery(api.templates.getImportedTemplateIds, {});
  const [state, setState] = useState<HabitNamePlaceholderState>({
    isReady: false,
    placeholder: '',
  });
  const advancedForOpenRef = useRef(false);

  useEffect(() => {
    if (!active) {
      advancedForOpenRef.current = false;
      setState({ isReady: false, placeholder: '' });
      return;
    }

    if (advancedForOpenRef.current) return;

    const isLoading =
      templates === undefined ||
      habits === undefined ||
      importedIds === undefined;

    if (isLoading) return;

    advancedForOpenRef.current = true;

    void (async () => {
      const cursor = await getHabitNamePlaceholderCursor();
      const result = pickNextHabitNamePlaceholderOnOpen({
        cursor,
        existingHabitNames: habits.map((habit) => habit.name),
        importedTemplateIds: new Set(importedIds.map(String)),
        templates,
      });

      await setHabitNamePlaceholderCursor(result.nextCursor);
      setState({ isReady: true, placeholder: result.name });
    })();
  }, [active, templates, habits, importedIds]);

  return state;
}
