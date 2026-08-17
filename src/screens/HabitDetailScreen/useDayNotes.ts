import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Habit } from '../../features/habits/types';

export function useDayNotes(habit: Habit | null | undefined) {
  const updateDayNote = useMutation(api.habits.updateDayNote);
  const remote = useQuery(
    api.habits.listDayNotes,
    habit?._id ? { habitId: habit._id } : 'skip'
  );
  const [local, setLocal] = useState<Record<string, string>>({});

  useEffect(() => {
    setLocal({});
  }, [habit?._id]);

  const remoteNotes = useMemo(
    () =>
      Object.fromEntries((remote ?? []).map(({ date, note }) => [date, note])),
    [remote]
  );

  useEffect(() => {
    setLocal((pending) =>
      Object.fromEntries(
        Object.entries(pending).filter(
          ([date, note]) => remoteNotes[date] !== note
        )
      )
    );
  }, [remoteNotes]);

  const notes = useMemo(
    () => ({ ...remoteNotes, ...local }),
    [local, remoteNotes]
  );

  const noteFor = useCallback((date: string) => notes[date] ?? '', [notes]);

  const saveNote = useCallback(
    async (date: string, note: string) => {
      if (!habit?._id) return;
      setLocal((prev) => ({ ...prev, [date]: note }));
      try {
        await updateDayNote({ date, habitId: habit._id, note });
      } catch {
        setLocal((pending) => {
          if (pending[date] !== note) return pending;
          const next = { ...pending };
          delete next[date];
          return next;
        });
        Alert.alert(
          'Could not save note',
          'Your note was not saved. Please try again.'
        );
      }
    },
    [habit?._id, updateDayNote]
  );

  return { noteFor, notes, saveNote };
}
