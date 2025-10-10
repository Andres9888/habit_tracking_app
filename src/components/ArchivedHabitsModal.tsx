import { useMutation, useQuery } from "convex/react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity
          onPress={onBack}
          className="w-8 h-8 rounded-full items-center justify-center bg-slate-100"
          accessibilityLabel="Back to settings"
          accessibilityRole="button"
        >
          <Text className="text-xl text-slate-500 font-semibold">←</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-slate-900 flex-1 text-center">Archived Habits</Text>
        <TouchableOpacity
          onPress={onClose}
          className="w-8 h-8 rounded-full items-center justify-center bg-slate-100"
          accessibilityLabel="Close"
          accessibilityRole="button"
        >
          <Text className="text-lg text-slate-500 font-semibold">✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="p-5">
        {archivedHabits.length === 0 ? (
          <View className="items-center py-12 gap-3">
            <Text className="text-5xl">📦</Text>
            <Text className="text-lg font-semibold text-slate-900">No archived habits</Text>
            <Text className="text-sm text-slate-500">Archived habits will appear here</Text>
          </View>
        ) : (
          <View className="gap-3">
            {archivedHabits.map((habit) => (
              <View key={habit._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 gap-3">
                <View className="gap-1">
                  <Text className="text-base font-semibold text-slate-900">{habit.name}</Text>
                  <Text className="text-xs text-slate-500">
                    Archived {new Date(habit.archivedAt || habit._creationTime).toLocaleDateString()}
                  </Text>
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => handleRestore(habit._id, habit.name)}
                    className="flex-1 rounded-xl border border-blue-500 py-3 items-center"
                    accessibilityRole="button"
                    accessibilityLabel={`Restore ${habit.name}`}
                  >
                    <Text className="text-xs tracking-[2px] text-blue-500 font-bold">RESTORE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handlePermanentDelete(habit._id, habit.name)}
                    className="flex-1 rounded-xl border border-red-500 py-3 items-center"
                    accessibilityRole="button"
                    accessibilityLabel={`Permanently delete ${habit.name}`}
                  >
                    <Text className="text-xs tracking-[2px] text-red-500 font-bold">DELETE</Text>
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
