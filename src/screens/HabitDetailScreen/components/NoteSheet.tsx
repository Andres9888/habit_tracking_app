import { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { NoteSheetBody } from './NoteSheetBody';

interface NoteSheetProps {
  date: string | null;
  existing: string;
  hint: string;
  onClose: () => void;
  onSave: (note: string) => boolean | Promise<boolean>;
}

export function NoteSheet({
  date,
  existing,
  hint,
  onClose,
  onSave,
}: NoteSheetProps) {
  const [draft, setDraft] = useState(existing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (date) setDraft(existing);
  }, [date, existing]);

  if (!date) return null;

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const saved = await onSave(draft.trim());
      if (saved) onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Pressable
      accessibilityLabel='Dismiss note sheet'
      style={styles.backdrop}
      onPress={saving ? undefined : onClose}
    >
      <Pressable onPress={(event) => event.stopPropagation()}>
        <NoteSheetBody
          draft={draft}
          existing={existing}
          hint={hint}
          saving={saving}
          onCancel={onClose}
          onChange={setDraft}
          onSave={() => void handleSave()}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(28,32,27,0.34)',
    justifyContent: 'flex-end',
    zIndex: 20,
  },
});
