import { Modal, Text, TouchableOpacity, View } from "react-native";
import Switch from "../Switch";
import { useEffect, useState } from "react";
import { getCompactMode, setCompactMode } from "../../lib/settingsStorage";
import ArchivedHabitsModal from "../ArchivedHabitsModal";
import { useSettingsModalLogic } from "./SettingsModal.hooks";

interface SettingsModalProps {
  onClose: () => void;
  visible: boolean;
  // optional control from parent (App)
  isCompact?: boolean;
  onChangeCompact?: (next: boolean) => void;
}

export default function SettingsModal({
  visible,
  onClose,
  isCompact,
  onChangeCompact,
}: SettingsModalProps) {
  const { user, view, setView, handleClose, handleSignOut } =
    useSettingsModalLogic({ onClose, visible });
  const [isCompactLocal, setIsCompactLocal] = useState(isCompact ?? false);

  useEffect(() => {
    let mounted = true;
    // If parent controls the value, sync from prop; otherwise read storage when opening
    if (typeof isCompact === "boolean") {
      setIsCompactLocal(isCompact);
    } else {
      (async () => {
        const saved = await getCompactMode();
        if (mounted) setIsCompactLocal(saved);
      })();
    }
    return () => {
      mounted = false;
    };
  }, [visible, isCompact]);

  const handleToggleCompact = async () => {
    const next = !isCompactLocal;
    setIsCompactLocal(next);
    await setCompactMode(next);
    if (typeof onChangeCompact === "function") {
      onChangeCompact(next);
    }
  };

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
                {/* Compact Mode */}
                <View className="items-center justify-between rounded-2xl bg-slate-50 px-5 py-4">
                  <View className="w-full flex-row items-center justify-between">
                    <View className="flex-1 pr-4">
                      <Text className="text-base font-semibold text-slate-900">
                        Compact Mode
                      </Text>
                      <Text className="text-[11px] text-slate-500">
                        Show more habits on screen
                      </Text>
                    </View>
                    <Switch
                      accessibilityLabel="Toggle compact mode"
                      checked={isCompactLocal}
                      onPress={handleToggleCompact}
                      size="md"
                    />
                  </View>
                </View>
                <View className="gap-2 rounded-2xl bg-slate-50 px-5 py-4">
                  <Text className="text-[10px] font-semibold tracking-[2.5px] text-slate-500">
                    SIGNED IN AS
                  </Text>
                  <Text className="text-base font-semibold text-slate-900">
                    {user?.primaryEmailAddress?.emailAddress}
                  </Text>
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

                <TouchableOpacity
                  accessibilityRole="button"
                  className="items-center rounded-3xl border border-red-500 py-4"
                  onPress={handleSignOut}
                >
                  <Text className="text-[13px] font-bold tracking-[3px] text-red-500">
                    SIGN OUT
                  </Text>
                </TouchableOpacity>
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
