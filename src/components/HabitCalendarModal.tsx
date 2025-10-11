import { X } from "lucide-react-native";
import { Modal, View, Text, Pressable } from "react-native";
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
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="max-h-[80%] rounded-t-[28px] bg-white px-6 pb-10 pt-6">
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-2xl font-bold tracking-tight text-slate-900">
              {habitName}
            </Text>
            <Pressable className="rounded-xl bg-slate-50 p-2" onPress={onClose}>
              <X color="#64748b" size={24} />
            </Pressable>
          </View>

          <View className="flex-1">
            <HabitCalendarView
              habitId={habitId}
              toggleHabit={toggleHabit}
              tracking={tracking}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
