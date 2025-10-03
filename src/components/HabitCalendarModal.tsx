import { X } from "lucide-react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import HabitCalendarView from "./HabitCalendarView";

interface HabitCalendarModalProps {
  visible: boolean;
  onClose: () => void;
  habitId: Id<"habits"> | null;
  habitName: string;
  tracking: Array<{ habitId: Id<"habits">; date: string; completed: boolean }>;
  toggleHabit: (args: { habitId: Id<"habits">; date: string }) => void;
}

export default function HabitCalendarModal({
  visible,
  onClose,
  habitId,
  habitName,
  tracking,
  toggleHabit,
}: HabitCalendarModalProps) {
  if (!habitId) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{habitName}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#64748b" />
            </Pressable>
          </View>

          <View style={styles.calendarContainer}>
            <HabitCalendarView
              habitId={habitId}
              tracking={tracking}
              toggleHabit={toggleHabit}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  calendarContainer: {
    flex: 1,
  },
});
