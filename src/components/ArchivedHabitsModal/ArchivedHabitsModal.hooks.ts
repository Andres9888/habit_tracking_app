import { useMutation, useQuery } from "convex/react";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export const useArchivedHabitsModalLogic = () => {
  const archivedHabits = useQuery(api.habits.listArchived) ?? [];
  const unarchiveHabit = useMutation(api.habits.unarchive);
  const removeHabit = useMutation(api.habits.remove);

  const handleRestore = async (habitId: Id<"habits">, habitName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await unarchiveHabit({ habitId });
    } catch (error) {
      console.error("Failed to restore habit:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Error",
        `Failed to restore "${habitName}". Please try again.`
      );
    }
  };

  const handlePermanentDelete = (habitId: Id<"habits">, habitName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      `Permanently Delete "${habitName}"?`,
      "This will permanently delete the habit and all its tracking data. This action cannot be undone.",
      [
        {
          style: "cancel",
          text: "Cancel",
        },
        {
          onPress: async () => {
            try {
              await removeHabit({ habitId });
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
            } catch (error) {
              console.error("Failed to delete habit:", error);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert(
                "Error",
                `Failed to delete "${habitName}". Please try again.`
              );
            }
          },
          style: "destructive",
          text: "Delete Forever",
        },
      ],
      { cancelable: true }
    );
  };

  return {
    archivedHabits,
    handlePermanentDelete,
    handleRestore,
  };
};
