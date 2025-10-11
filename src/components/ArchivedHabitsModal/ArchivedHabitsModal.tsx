import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useArchivedHabitsModalLogic } from "./ArchivedHabitsModal.hooks";

interface ArchivedHabitsModalProps {
  onClose: () => void;
  onBack: () => void;
}

export default function ArchivedHabitsModal({
  onClose,
  onBack,
}: ArchivedHabitsModalProps) {
  const { archivedHabits, handleRestore, handlePermanentDelete } =
    useArchivedHabitsModalLogic();

  return (
    <>
      <View className="mb-6 flex-row items-center justify-between">
        <TouchableOpacity
          accessibilityLabel="Back to settings"
          accessibilityRole="button"
          className="h-8 w-8 items-center justify-center rounded-full bg-slate-100"
          onPress={onBack}
        >
          <Text className="text-xl font-semibold text-slate-500">←</Text>
        </TouchableOpacity>
        <Text className="flex-1 text-center text-2xl font-bold text-slate-900">
          Archived Habits
        </Text>
        <TouchableOpacity
          accessibilityLabel="Close"
          accessibilityRole="button"
          className="h-8 w-8 items-center justify-center rounded-full bg-slate-100"
          onPress={onClose}
        >
          <Text className="text-lg font-semibold text-slate-500">✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="p-5">
        {archivedHabits.length === 0 ? (
          <View className="items-center gap-3 py-12">
            <Text className="text-5xl">📦</Text>
            <Text className="text-lg font-semibold text-slate-900">
              No archived habits
            </Text>
            <Text className="text-sm text-slate-500">
              Archived habits will appear here
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {archivedHabits.map((habit) => (
              <View
                key={habit._id}
                className="gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <View className="gap-1">
                  <Text className="text-base font-semibold text-slate-900">
                    {habit.name}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    Archived{" "}
                    {new Date(
                      habit.archivedAt || habit._creationTime
                    ).toLocaleDateString()}
                  </Text>
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    accessibilityLabel={`Restore ${habit.name}`}
                    accessibilityRole="button"
                    className="flex-1 items-center rounded-xl border border-blue-500 py-3"
                    onPress={() => handleRestore(habit._id, habit.name)}
                  >
                    <Text className="text-xs font-bold tracking-[2px] text-blue-500">
                      RESTORE
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    accessibilityLabel={`Permanently delete ${habit.name}`}
                    accessibilityRole="button"
                    className="flex-1 items-center rounded-xl border border-red-500 py-3"
                    onPress={() => handlePermanentDelete(habit._id, habit.name)}
                  >
                    <Text className="text-xs font-bold tracking-[2px] text-red-500">
                      DELETE
                    </Text>
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
