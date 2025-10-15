import React, { useMemo, useState } from "react";
import { Modal, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";

type AddHabitModalProps = {
  onClose: () => void;
  onSubmit: (args: { name: string; notes?: string }) => void | Promise<void>;
  visible: boolean;
};

const EMOJI_OPTIONS: string[] = [
  "🧘",
  "📚",
  "💪",
  "🏃",
  "🎨",
  "✍️",
  "🎵",
  "💧",
  "🌱",
  "🧠",
  "❤️",
  "🎯",
];

const normalizeName = (emoji: string | undefined, name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return "";
  return emoji ? `${emoji} ${trimmed}` : trimmed;
};

const AddHabitModal: React.FC<AddHabitModalProps> = ({ onClose, onSubmit, visible }) => {
  const [habitName, setHabitName] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<string | undefined>(EMOJI_OPTIONS[0]);

  const canCreate = useMemo(() => habitName.trim().length > 0, [habitName]);

  const handleSubmit = async () => {
    const finalName = normalizeName(selectedEmoji, habitName);
    if (!finalName) return;
    await Promise.resolve(onSubmit({ name: finalName, notes: notes.trim() || undefined }));
    setHabitName("");
    setNotes("");
    onClose();
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <TouchableOpacity
        activeOpacity={1}
        className="flex-1 items-center justify-center bg-black/50 p-5"
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          className="android:elevation-5 w-full max-w-[420px] rounded-[20px] bg-white p-5 shadow-lg"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-slate-900">Create New Habit</Text>
            <Pressable
              accessibilityLabel="Close add habit"
              accessibilityRole="button"
              className="h-8 w-8 items-center justify-center rounded-full bg-slate-100"
              onPress={onClose}
            >
              <Text className="text-lg font-semibold text-slate-500">✕</Text>
            </Pressable>
          </View>

          <View className="gap-4">
            <View className="gap-2">
              <Text className="text-[10px] font-semibold tracking-[2.5px] text-slate-500">HABIT NAME</Text>
              <TextInput
                accessibilityHint="Enter the name of your new habit"
                accessibilityLabel="Habit name"
                autoFocus
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900"
                placeholder="e.g., Morning Jog"
                placeholderTextColor="#999"
                value={habitName}
                onChangeText={setHabitName}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
              />
            </View>

            <View className="gap-2">
              <Text className="text-[10px] font-semibold tracking-[2.5px] text-slate-500">CHOOSE ICON</Text>
              <View className="flex-row flex-wrap justify-between gap-2">
                {EMOJI_OPTIONS.map((emoji) => {
                  const isSelected = selectedEmoji === emoji;
                  return (
                    <Pressable
                      key={emoji}
                      accessibilityHint={`Select ${emoji} as the habit icon`}
                      accessibilityLabel={`Icon ${emoji}`}
                      accessibilityRole="button"
                      className={`h-10 w-10 items-center justify-center rounded-xl border-2 ${
                        isSelected ? "border-slate-900 bg-slate-100" : "border-slate-200"
                      }`}
                      onPress={() => setSelectedEmoji(emoji)}
                    >
                      <Text className="text-2xl">{emoji}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-[10px] font-semibold tracking-[2.5px] text-slate-500">NOTES (OPTIONAL)</Text>
              <TextInput
                accessibilityHint="Add optional notes for this habit"
                accessibilityLabel="Habit notes"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900"
                multiline
                numberOfLines={3}
                placeholder="Add any details or reminders..."
                placeholderTextColor="#999"
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            <View className="mt-2 flex-row justify-end gap-3">
              <Pressable
                accessibilityLabel="Cancel"
                accessibilityRole="button"
                className="rounded-2xl border border-slate-300 px-5 py-2"
                onPress={onClose}
              >
                <Text className="text-[12px] font-semibold tracking-[2px] text-slate-600">Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityLabel="Create habit"
                accessibilityRole="button"
                className={`rounded-2xl px-5 py-2 ${canCreate ? "bg-[#101727]" : "bg-[#101727]/40"}`}
                disabled={!canCreate}
                onPress={handleSubmit}
              >
                <Text className="text-[12px] font-semibold tracking-[2px] text-white">Create Habit</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default AddHabitModal;
