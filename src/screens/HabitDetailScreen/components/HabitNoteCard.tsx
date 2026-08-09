/**
 * HabitNoteCard — per-day journal note on a completion.
 * Disabled until that day is complete (never silently creates a completion).
 */
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import { useInsightPalette } from '../insightPalette';
import { HabitAboutNote } from './HabitAboutNote';
import { HabitNoteField } from './HabitNoteField';

interface HabitNoteCardProps {
  canEdit: boolean;
  date: string;
  habitId: Id<'habits'>;
  habitNotes?: string;
  note?: string;
  variant?: 'dashed' | 'onBand';
}

export function HabitNoteCard({
  canEdit,
  date,
  habitId,
  habitNotes,
  note,
  variant = 'dashed',
}: HabitNoteCardProps) {
  const palette = useInsightPalette();
  const updateNote = useMutation(api.habits.updateTrackingNote);
  const [draft, setDraft] = useState(note ?? '');
  const isToday = date === getLocalDateString();

  useEffect(() => setDraft(note ?? ''), [date, habitId, note]);

  const commit = () => {
    if (!canEdit) return;
    const next = draft.trim();
    if (next === (note ?? '').trim()) return;
    void updateNote({ date, habitId, note: next });
  };

  return (
    <View style={{ gap: 10 }}>
      <HabitNoteField
        canEdit={canEdit}
        draft={draft}
        isToday={isToday}
        label={isToday ? "Today's note" : `Note for ${date}`}
        palette={palette}
        variant={variant}
        onBlur={commit}
        onChangeText={setDraft}
      />
      {habitNotes?.trim() ? (
        <HabitAboutNote note={habitNotes.trim()} palette={palette} />
      ) : null}
    </View>
  );
}
