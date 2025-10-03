import { format } from "date-fns";
import { Pencil, Check, X, GripVertical, Link2 } from "lucide-react";
import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import ChainLinkVisualizer from "./ChainLinkVisualizer";

type HabitStatus = "done" | "missed" | "planned";

interface Habit {
  _id: Id<"habits">;
  name: string;
  notes?: string;
  createdAt: number;
  _creationTime: number;
  order?: number;
  tags?: string[];
  userId?: string;
  archived?: boolean;
  archivedAt?: number;
  chainLinks?: Id<"habits">[];
}

interface DraggableHabitProps {
  habit: Habit;
  index: number;
  allHabits: Habit[];
  onReorder: (newOrder: string[]) => void;
  editingHabitId: Id<"habits"> | null;
  editingHabitName: string;
  onStartEdit: (habitId: Id<"habits">, currentName: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (habitId: Id<"habits">) => void;
  setEditingHabitName: (name: string) => void;
  weekDates: Date[];
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
  completionRate: number;
  streak: number;
  toggleHabit: (args: { habitId: Id<"habits">; date: string }) => void;
  tracking: Array<{ habitId: Id<"habits">; date: string; completed: boolean }>;
  addChainLink: (args: { habitId: Id<"habits">; linkedHabitId: Id<"habits"> }) => void;
  removeChainLink: (args: { habitId: Id<"habits">; linkedHabitId: Id<"habits"> }) => void;
  onLongPress: () => void;
}

export default function DraggableHabit({
  habit,
  index,
  allHabits,
  onReorder,
  editingHabitId,
  editingHabitName,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  setEditingHabitName,
  weekDates,
  weekDateStrings,
  weekStatus,
  completionRate,
  streak,
  toggleHabit,
  tracking,
  addChainLink,
  removeChainLink,
  onLongPress,
}: DraggableHabitProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showChainModal, setShowChainModal] = useState(false);

  const handleDragStart = (e: any) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragOver(false);

    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (draggedIndex !== index) {
      const newOrder = [...allHabits];
      const [movedItem] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(index, 0, movedItem);
      onReorder(newOrder.map(h => h._id));
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleToggleChainLink = (linkedHabitId: Id<"habits">) => {
    const currentLinks = habit.chainLinks || [];
    if (currentLinks.includes(linkedHabitId)) {
      removeChainLink({ habitId: habit._id, linkedHabitId });
    } else {
      addChainLink({ habitId: habit._id, linkedHabitId });
    }
  };

  const hasActiveChain = weekStatus[weekStatus.length - 1] === "done" && (habit.chainLinks || []).length > 0;

  return (
    <View style={{ position: 'relative' }}>
      <Pressable
        onLongPress={onLongPress}
        style={[
          styles.habitCard,
          isDragging && styles.habitCardDragging,
          dragOver && styles.habitCardDragOver
        ]}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ChainLinkVisualizer
          habitId={habit._id}
          linkedHabits={habit.chainLinks || []}
          allHabits={allHabits}
          isActive={hasActiveChain}
          habitIndex={index}
          weekDateStrings={weekDateStrings}
          tracking={tracking}
        />

      <View style={styles.habitHeader}>
        <View
          draggable={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={styles.dragHandle}
        >
          <GripVertical size={20} color="#94a3b8" />
        </View>

        {editingHabitId === habit._id ? (
          <View style={styles.editNameContainer}>
            <TextInput
              value={editingHabitName}
              onChangeText={setEditingHabitName}
              style={styles.editNameInput}
              autoFocus
              placeholder="Habit name"
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={() => onSaveEdit(habit._id)}
              style={styles.editNameButton}
            >
              <Check size={18} color="#10B981" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onCancelEdit}
              style={styles.editNameButton}
            >
              <X size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.habitNameRow}>
            <TouchableOpacity
              onLongPress={() => onStartEdit(habit._id, habit.name)}
              delayLongPress={500}
              style={{ flex: 1 }}
              activeOpacity={0.7}
            >
              <Text style={styles.habitName}>{habit.name}</Text>
            </TouchableOpacity>
            <View style={styles.habitActions}>
              <TouchableOpacity
                onPress={() => setShowChainModal(true)}
                style={[
                  styles.actionButton,
                  (habit.chainLinks || []).length > 0 && styles.chainButtonActive
                ]}
              >
                <Link2 size={16} color={(habit.chainLinks || []).length > 0 ? "#3B82F6" : "#64748b"} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <Modal
        visible={showChainModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowChainModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowChainModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Chain Links for {habit.name}</Text>
            <Text style={styles.modalDescription}>
              Connect habits to create visual chains when you complete them
            </Text>
            <ScrollView style={styles.modalList}>
              {allHabits
                .filter(h => h._id !== habit._id)
                .map(linkedHabit => {
                  const isLinked = (habit.chainLinks || []).includes(linkedHabit._id);
                  return (
                    <TouchableOpacity
                      key={linkedHabit._id}
                      style={[
                        styles.modalListItem,
                        isLinked && styles.modalListItemActive
                      ]}
                      onPress={() => handleToggleChainLink(linkedHabit._id)}
                    >
                      <Text style={[
                        styles.modalListItemText,
                        isLinked && styles.modalListItemTextActive
                      ]}>
                        {linkedHabit.name}
                      </Text>
                      {isLinked && <Check size={18} color="#3B82F6" />}
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowChainModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {showCalendar ? (
        <HabitCalendarView
          habitId={habit._id}
          tracking={tracking}
          toggleHabit={toggleHabit}
        />
      ) : (
        <View style={styles.calendarGrid}>
        {weekDates.map((date, idx) => {
          const state = weekStatus[idx];
          const dateString = weekDateStrings[idx];
          const checkDate = new Date(dateString);
          const todayCheck = new Date();
          todayCheck.setHours(0, 0, 0, 0);
          checkDate.setHours(0, 0, 0, 0);
          const isFuture = checkDate > todayCheck;
          const dayLabel = format(date, 'EEE').substring(0, 3);

          return (
            <View
              key={`${habit._id}-${dateString}`}
              style={styles.dayColumn}
            >
              <Text style={styles.dayLabel}>{dayLabel.toUpperCase()}</Text>
              <Pressable
                onPress={() => !isFuture && toggleHabit({ habitId: habit._id, date: dateString })}
                disabled={isFuture}
                style={[
                  styles.dayButton,
                  state === "done" && styles.dayButtonDone,
                  state === "missed" && styles.dayButtonMissed,
                  isFuture && styles.dayButtonFuture
                ]}
                accessibilityLabel={`Toggle ${habit.name} on ${format(date, 'MMM d')}`}
                accessibilityRole="button"
              >
                <Text style={[
                  styles.dayButtonText,
                  state === "done" && styles.dayButtonTextDone,
                  state === "missed" && styles.dayButtonTextMissed
                ]}>
                  {state === "done" ? "✓" : state === "missed" ? "–" : "·"}
                </Text>
              </Pressable>
            </View>
          );
        })}
        </View>
      )}

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${completionRate}%` }]} />
      </View>

      <View style={styles.habitStats}>
        <Text style={styles.statText}>STREAK · {streak} DAYS</Text>
        <Text style={styles.statText}>{completionRate}% THIS WEEK</Text>
      </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  habitCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24,
    marginBottom: 32,
  },
  habitCardDragging: {
    opacity: 0.5,
  },
  habitCardDragOver: {
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  dragHandle: {
    padding: 4,
  },
  habitNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  habitName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    letterSpacing: -0.3,
    flex: 1,
  },
  habitActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  actionButtonActive: {
    backgroundColor: '#eff6ff',
  },
  chainButtonActive: {
    backgroundColor: '#EFF6FF',
  },
  editButton: {
    padding: 4,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  editNameInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
    paddingVertical: 4,
  },
  editNameButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  calendarGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  dayColumn: {
    alignItems: 'center',
    gap: 8,
  },
  dayLabel: {
    fontSize: 10,
    letterSpacing: 3,
    color: '#64748b',
    fontWeight: '600',
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonDone: {
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  dayButtonMissed: {
    borderStyle: 'dashed',
  },
  dayButtonFuture: {
    opacity: 0.4,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  dayButtonTextDone: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
  dayButtonTextMissed: {
    color: '#64748b',
  },
  progressBarContainer: {
    height: 2,
    width: '100%',
    backgroundColor: '#e2e8f0',
    marginTop: 24,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0f172a',
  },
  habitStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  statText: {
    fontSize: 11,
    letterSpacing: 3,
    color: '#64748b',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  modalList: {
    maxHeight: 300,
  },
  modalListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },
  modalListItemActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  modalListItemText: {
    fontSize: 16,
    color: '#0f172a',
    flex: 1,
  },
  modalListItemTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 11,
    letterSpacing: 3,
    color: '#64748b',
    fontWeight: '600',
  },
  notesSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  notesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notesButtonText: {
    fontSize: 11,
    letterSpacing: 3,
    color: '#64748b',
    fontWeight: '600',
  },
  notesChevron: {
    transition: 'transform 0.2s ease',
  },
  notesChevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  notesInputContainer: {
    marginTop: 12,
  },
  notesInput: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0f172a',
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
