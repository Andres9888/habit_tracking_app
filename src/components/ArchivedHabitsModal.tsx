import { useMutation, useQuery } from "convex/react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Haptics from 'expo-haptics';
import { api } from "../../convex/_generated/api";

interface ArchivedHabitsModalProps {
  onClose: () => void;
  onBack: () => void;
}

export default function ArchivedHabitsModal({ onClose, onBack }: ArchivedHabitsModalProps) {
  const archivedHabits = useQuery(api.habits.listArchived) ?? [];
  const unarchiveHabit = useMutation(api.habits.unarchive);
  const removeHabit = useMutation(api.habits.remove);

  const handleRestore = async (habitId: any, habitName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await unarchiveHabit({ habitId });
    } catch (error) {
      console.error('Failed to restore habit:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', `Failed to restore "${habitName}". Please try again.`);
    }
  };

  const handlePermanentDelete = (habitId: any, habitName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      `Permanently Delete "${habitName}"?`,
      'This will permanently delete the habit and all its tracking data. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeHabit({ habitId });
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              console.error('Failed to delete habit:', error);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert('Error', `Failed to delete "${habitName}". Please try again.`);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityLabel="Back to settings"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Archived Habits</Text>
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
          accessibilityLabel="Close"
          accessibilityRole="button"
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {archivedHabits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>No archived habits</Text>
            <Text style={styles.emptySubtext}>Archived habits will appear here</Text>
          </View>
        ) : (
          <View style={styles.habitsList}>
            {archivedHabits.map((habit) => (
              <View key={habit._id} style={styles.habitCard}>
                <View style={styles.habitInfo}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <Text style={styles.archivedDate}>
                    Archived {new Date(habit.archivedAt || habit._creationTime).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => handleRestore(habit._id, habit.name)}
                    style={styles.restoreButton}
                    accessibilityRole="button"
                    accessibilityLabel={`Restore ${habit.name}`}
                  >
                    <Text style={styles.restoreButtonText}>RESTORE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handlePermanentDelete(habit._id, habit.name)}
                    style={styles.deleteButton}
                    accessibilityRole="button"
                    accessibilityLabel={`Permanently delete ${habit.name}`}
                  >
                    <Text style={styles.deleteButtonText}>DELETE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  backButtonText: {
    fontSize: 20,
    color: '#64748b',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
  },
  habitsList: {
    gap: 12,
  },
  habitCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    padding: 16,
    gap: 12,
  },
  habitInfo: {
    gap: 4,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  archivedDate: {
    fontSize: 12,
    color: '#64748b',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  restoreButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3b82f6',
    paddingVertical: 12,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 12,
    letterSpacing: 2,
    color: '#3b82f6',
    fontWeight: '700',
  },
  deleteButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 12,
    letterSpacing: 2,
    color: '#ef4444',
    fontWeight: '700',
  },
});
