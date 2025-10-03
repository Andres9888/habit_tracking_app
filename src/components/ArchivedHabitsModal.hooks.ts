import { useCallback } from "react";
import { Alert } from "react-native";
import * as Haptics from 'expo-haptics';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface UseComponentLogicParams {
  onClose: () => void;
  onBack: () => void;
}

export function useComponentLogic({ onClose, onBack }: UseComponentLogicParams) {
  const archivedHabits = useQuery(api.habits.listArchived) ?? [];
  const unarchiveHabit = useMutation(api.habits.unarchive);
  const removeHabit = useMutation(api.habits.remove);

  const handleRestore = useCallback(async (habitId: any, habitName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await unarchiveHabit({ habitId });
    } catch (error) {
      console.error('Failed to restore habit:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', `Failed to restore "${habitName}". Please try again.`);
    }
  }, [unarchiveHabit]);

  const handlePermanentDelete = useCallback((habitId: any, habitName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      `Permanently Delete "${habitName}"?`,
      'This will permanently delete the habit and all its tracking data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
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
  }, [removeHabit]);

  return {
    archivedHabits,
    onBack,
    onClose,
    handleRestore,
    handlePermanentDelete,
  } as const;
}

export default useComponentLogic;
