import { useAuth, useUser } from "@clerk/clerk-expo";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <TouchableOpacity
          style={styles.modal}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {view === 'settings' ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Settings</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                  accessibilityLabel="Close settings"
                  accessibilityRole="button"
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <View style={styles.userInfo}>
                  <Text style={styles.label}>SIGNED IN AS</Text>
                  <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => setView('archived')}
                  style={styles.archiveButton}
                  accessibilityRole="button"
                >
                  <Text style={styles.archiveButtonText}>📦 ARCHIVED HABITS</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSignOut}
                  style={styles.signOutButton}
                  accessibilityRole="button"
                >
                  <Text style={styles.signOutButtonText}>SIGN OUT</Text>
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '600',
  },
  content: {
    gap: 24,
  },
  userInfo: {
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2.5,
    color: '#64748b',
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  archiveButton: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#64748b',
    paddingVertical: 16,
    alignItems: 'center',
  },
  archiveButtonText: {
    fontSize: 13,
    letterSpacing: 3,
    color: '#64748b',
    fontWeight: '700',
  },
  signOutButton: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingVertical: 16,
    alignItems: 'center',
  },
  signOutButtonText: {
    fontSize: 13,
    letterSpacing: 3,
    color: '#ef4444',
    fontWeight: '700',
  },
});
