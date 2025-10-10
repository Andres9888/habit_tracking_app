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
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-white rounded-t-[28px] pt-6 pb-10 px-6 max-h-[80%]">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-bold text-slate-900 tracking-tight">{habitName}</Text>
            <Pressable onPress={onClose} className="p-2 rounded-xl bg-slate-50">
              <X size={24} color="#64748b" />
            </Pressable>
          </View>

          <View className="flex-1">
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
