import { Modal, Switch, Text, TouchableOpacity, View } from "react-native";
import ArchivedHabitsModal from "../ArchivedHabitsModal";
import { useSettingsModalLogic } from "./SettingsModal.hooks";

interface SettingsModalProps {
  onClose: () => void;
  visible: boolean;
  isCompact?: boolean;
  onChangeCompact?: (value: boolean) => void | Promise<void>;
  showCharacterScreen?: boolean;
  onChangeShowCharacterScreen?: (value: boolean) => void | Promise<void>;
  showNotesStats?: boolean;
  onChangeShowNotesStats?: (value: boolean) => void | Promise<void>;
}

export default function SettingsModal({
  visible,
  onClose,
  isCompact = false,
  onChangeCompact = () => {},
  showCharacterScreen = true,
  onChangeShowCharacterScreen = () => {},
  showNotesStats = true,
  onChangeShowNotesStats = () => {},
}: SettingsModalProps) {
  const { user, view, setView, handleClose, handleSignOut } =
    useSettingsModalLogic({ onClose, visible });

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        className="flex-1 items-center justify-center bg-black/50 p-5"
        onPress={handleClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          className="android:elevation-5 w-full max-w-[400px] rounded-[20px] bg-white p-5 shadow-lg"
          onPress={(e) => e.stopPropagation()}
        >
          {view === "settings" ? (
            <>
              <View className="mb-6 flex-row items-center justify-between">
                <Text className="text-2xl font-bold text-slate-900">
                  Settings
                </Text>
                <TouchableOpacity
                  accessibilityLabel="Close settings"
                  accessibilityRole="button"
                  className="h-8 w-8 items-center justify-center rounded-full bg-slate-100"
                  onPress={handleClose}
                >
                  <Text className="text-lg font-semibold text-slate-500">
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="gap-6">
                <View className="gap-2 rounded-2xl bg-slate-50 px-5 py-4">
                  <Text className="text-[10px] font-semibold tracking-[2.5px] text-slate-500">
                    {user ? 'SIGNED IN AS' : 'AUTHENTICATION'}
                  </Text>
                  <Text className="text-base font-semibold text-slate-900">
                    {user?.primaryEmailAddress?.emailAddress || 'Not configured (Development mode)'}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between rounded-2xl bg-slate-50 px-5 py-4">
                  <View className="flex-1 pr-4">
                    <Text className="text-xs font-semibold uppercase tracking-[2px] text-slate-500">
                      Compact Mode
                    </Text>
                    <Text className="text-[11px] text-slate-500">
                      Reduce card spacing to view more habits at once.
                    </Text>
                  </View>
                  <Switch
                    accessibilityLabel="Toggle compact mode"
                    value={isCompact}
                    onValueChange={(value) =>
                      Promise.resolve(onChangeCompact(value)).catch((error) =>
                        console.error("Failed to update compact mode", error)
                      )
                    }
                    thumbColor={isCompact ? "#101727" : "#ffffff"}
                    trackColor={{ false: "#cbd5f5", true: "#101727" }}
                  />
                </View>

                <View className="flex-row items-center justify-between rounded-2xl bg-slate-50 px-5 py-4">
                  <View className="flex-1 pr-4">
                    <Text className="text-xs font-semibold uppercase tracking-[2px] text-slate-500">
                      Character Screen
                    </Text>
                    <Text className="text-[11px] text-slate-500">
                      Show character screen icon in the navigation bar.
                    </Text>
                  </View>
                  <Switch
                    accessibilityLabel="Toggle character screen"
                    value={showCharacterScreen}
                    onValueChange={(value) =>
                      Promise.resolve(onChangeShowCharacterScreen(value)).catch((error) =>
                        console.error("Failed to update character screen setting", error)
                      )
                    }
                    thumbColor={showCharacterScreen ? "#101727" : "#ffffff"}
                    trackColor={{ false: "#cbd5f5", true: "#101727" }}
                  />
                </View>

                <View className="flex-row items-center justify-between rounded-2xl bg-slate-50 px-5 py-4">
                  <View className="flex-1 pr-4">
                    <Text className="text-xs font-semibold uppercase tracking-[2px] text-slate-500">
                      Notes & Stats Icon
                    </Text>
                    <Text className="text-[11px] text-slate-500">
                      Show notes and statistics icon in the navigation bar.
                    </Text>
                  </View>
                  <Switch
                    accessibilityLabel="Toggle notes and stats"
                    value={showNotesStats}
                    onValueChange={(value) =>
                      Promise.resolve(onChangeShowNotesStats(value)).catch((error) =>
                        console.error("Failed to update notes and stats setting", error)
                      )
                    }
                    thumbColor={showNotesStats ? "#101727" : "#ffffff"}
                    trackColor={{ false: "#cbd5f5", true: "#101727" }}
                  />
                </View>

                <TouchableOpacity
                  accessibilityRole="button"
                  className="items-center rounded-3xl border border-slate-500 py-4"
                  onPress={() => setView("archived")}
                >
                  <Text className="text-[13px] font-bold tracking-[3px] text-slate-500">
                    📦 ARCHIVED HABITS
                  </Text>
                </TouchableOpacity>

                {user ? (
                  <TouchableOpacity
                    accessibilityRole="button"
                    className="items-center rounded-3xl border border-red-500 py-4"
                    onPress={handleSignOut}
                  >
                    <Text className="text-[13px] font-bold tracking-[3px] text-red-500">
                      SIGN OUT
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View className="items-center rounded-3xl border border-slate-300 bg-slate-50 py-4">
                    <Text className="text-[13px] font-bold tracking-[3px] text-slate-400">
                      SIGN OUT (UNAVAILABLE)
                    </Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <ArchivedHabitsModal
              onBack={() => setView("settings")}
              onClose={handleClose}
            />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
