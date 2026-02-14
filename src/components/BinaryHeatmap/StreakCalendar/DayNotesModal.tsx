/**
 * DayNotesModal Component
 *
 * Modal to display notes for a specific day when tapped.
 */

import React, { memo } from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { format, parse } from 'date-fns';
import type { Doc } from '../../../convex/_generated/dataModel';
import { styles } from './styles';

interface DayNotesModalProps {
  visible: boolean;
  selectedDate: string | null;
  notes: Doc<'notes'>[];
  habitColor: string;
  onClose: () => void;
}

export const DayNotesModal = memo(function DayNotesModal({
  visible,
  selectedDate,
  notes,
  habitColor,
  onClose,
}: DayNotesModalProps) {
  const formattedDate = selectedDate
    ? format(parse(selectedDate, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy')
    : '';

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notes for {formattedDate}</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          {/* Notes List */}
          <ScrollView
            style={styles.notesContainer}
            showsVerticalScrollIndicator={false}
          >
            {notes.length > 0 ? (
              notes.map((note) => (
                <View
                  key={note._id}
                  style={[
                    styles.noteItem,
                    { borderLeftColor: habitColor },
                  ]}
                >
                  <Text style={styles.noteText}>{note.text}</Text>
                  {note.createdAt && (
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#a8a29e',
                        marginTop: 4,
                      }}
                    >
                      {format(new Date(note.createdAt), 'HH:mm')}
                    </Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.emptyNotesText}>
                No notes for this day
              </Text>
            )}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
});
