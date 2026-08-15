/**
 * HabitNoteCard — the note slot from the design.
 *
 * Two placements: 'dashed' on History, and 'onBand' inside the hero right after
 * a check-in, where the design surfaces the prompt at the moment it's most
 * likely to be answered.
 *
 * NOTE ON SCOPE: the design labels this "Today's note", but `tracking` rows
 * carry no note field, so this writes the habit-level `habit.notes` via
 * `habits.updateNotes`. It is therefore one running note per habit, not one per
 * day — labelled honestly as "Note" until a per-day note column exists.
 */
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useMutation } from 'convex/react';
import { ThemedTextInput } from '../../../components/ui/TextInput';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { borderRadius } from '../../../theme/spacing';
import { fontWeights } from '../../../theme/typography';
import { useInsightPalette, type InsightPalette } from '../insightPalette';

interface HabitNoteCardProps {
  habitId: Id<'habits'>;
  notes?: string;
  variant?: 'dashed' | 'onBand';
}

function frameStyle(variant: 'dashed' | 'onBand', palette: InsightPalette) {
  if (variant === 'onBand') {
    return {
      backgroundColor: palette.card,
      borderColor: palette.bandHairline,
      borderRadius: borderRadius.medium,
      borderWidth: 1,
    };
  }
  return {
    borderColor: palette.cardBorder,
    borderRadius: borderRadius.large,
    borderStyle: 'dashed' as const,
    borderWidth: 1.5,
  };
}

export function HabitNoteCard({
  habitId,
  notes,
  variant = 'dashed',
}: HabitNoteCardProps) {
  const palette = useInsightPalette();
  const updateNotes = useMutation(api.habits.updateNotes);
  const [draft, setDraft] = useState(notes ?? '');

  // Re-seed when switching habits inside the persistent detail modal.
  useEffect(() => setDraft(notes ?? ''), [habitId, notes]);

  const commit = () => {
    const next = draft.trim();
    if (next === (notes ?? '').trim()) return;
    void updateNotes({ habitId, notes: next });
  };

  return (
    <View
      style={{
        paddingHorizontal: variant === 'onBand' ? 16 : 18,
        paddingVertical: 14,
        ...frameStyle(variant, palette),
      }}
    >
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            color: palette.textTertiary,
            fontSize: 11,
            fontWeight: fontWeights.bold,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}
        >
          Note
        </Text>
        <Text style={{ color: palette.textTertiary, fontSize: 11 }}>
          optional
        </Text>
      </View>
      <ThemedTextInput
        multiline
        accessibilityLabel='Note for this habit'
        placeholder='How is this one going?'
        style={{
          color: palette.textPrimary,
          fontSize: 14,
          lineHeight: 20,
          marginTop: 8,
          minHeight: 24,
          padding: 0,
        }}
        value={draft}
        onBlur={commit}
        onChangeText={setDraft}
      />
    </View>
  );
}
