import { useAuth, useUser } from "@clerk/clerk-expo";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import ArchivedHabitsModal from "./ArchivedHabitsModal";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [view, setView] = useState<'settings' | 'archived'>('settings');

  // Reset to settings view when modal closes
  const handleClose = () => {
    onClose();
    setTimeout(() => setView('settings'), 300); // Reset after animation
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      handleClose();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/50 justify-center items-center p-5"
        activeOpacity={1}
        onPress={handleClose}
      >
        <TouchableOpacity
          className="bg-white rounded-[20px] p-5 w-full max-w-[400px] shadow-lg android:elevation-5"
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {view === 'settings' ? (
            <>
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-bold text-slate-900">Settings</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  className="w-8 h-8 rounded-full items-center justify-center bg-slate-100"
                  accessibilityLabel="Close settings"
                  accessibilityRole="button"
                >
                  <Text className="text-lg text-slate-500 font-semibold">✕</Text>
                </TouchableOpacity>
              </View>

              <View className="gap-6">
                <View className="gap-2 py-4 px-5 rounded-2xl bg-slate-50">
                  <Text className="text-[10px] font-semibold tracking-[2.5px] text-slate-500">SIGNED IN AS</Text>
                  <Text className="text-base font-semibold text-slate-900">{user?.primaryEmailAddress?.emailAddress}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => setView('archived')}
                  className="rounded-3xl border border-slate-500 py-4 items-center"
                  accessibilityRole="button"
                >
                  <Text className="text-[13px] tracking-[3px] text-slate-500 font-bold">📦 ARCHIVED HABITS</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSignOut}
                  className="rounded-3xl border border-red-500 py-4 items-center"
                  accessibilityRole="button"
                >
                  <Text className="text-[13px] tracking-[3px] text-red-500 font-bold">SIGN OUT</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <ArchivedHabitsModal onClose={handleClose} onBack={() => setView('settings')} />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
