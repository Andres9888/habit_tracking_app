import { useEffect, useState } from 'react';
import { Modal, Pressable } from 'react-native';
import { NoteSheetBody } from './NoteSheetBody';

interface NoteSheetProps {
  date: string | null;
  existing: string;
  hint: string;
  onClose: () => void;
  onSave: (note: string) => void;
}

export function NoteSheet({
  date,
  existing,
  hint,
  onClose,
  onSave,
}: NoteSheetProps) {
  const [draft, setDraft] = useState(existing);

  useEffect(() => {
    if (date) setDraft(existing);
  }, [date, existing]);

  if (!date) return null;

  return (
    <Modal transparent animationType='fade' visible onRequestClose={onClose}>
      <Pressable
        accessibilityLabel='Dismiss note sheet'
        style={{
          backgroundColor: 'rgba(28,32,27,0.34)',
          flex: 1,
          justifyContent: 'flex-end',
        }}
        onPress={onClose}
      >
        <Pressable onPress={(event) => event.stopPropagation()}>
          <NoteSheetBody
            draft={draft}
            existing={existing}
            hint={hint}
            onCancel={onClose}
            onChange={setDraft}
            onSave={() => {
              onSave(draft.trim());
              onClose();
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
