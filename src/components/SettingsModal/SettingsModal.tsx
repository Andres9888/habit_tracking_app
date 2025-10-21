import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Check,
  Moon,
  Smartphone,
  Contrast,
  Zap,
  Bell,
  HelpCircle,
  Send,
  ChevronLeft,
  BookOpen,
} from 'lucide-react-native';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ArchivedHabitsModal from '../ArchivedHabitsModal';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { useSettingsModalLogic } from './SettingsModal.hooks';

interface SettingsModalProps {
  onClose: () => void;
  visible: boolean;
  isCompact?: boolean;
  onChangeCompact?: (value: boolean) => void | Promise<void>;
  showCharacterScreen?: boolean;
  onChangeShowCharacterScreen?: (value: boolean) => void | Promise<void>;
  showHabitStrengthPercentage?: boolean;
  onChangeShowHabitStrengthPercentage?: (value: boolean) => void | Promise<void>;
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
  showHabitStrengthPercentage = true,
  onChangeShowHabitStrengthPercentage = () => {},
  showNotesStats = true,
  onChangeShowNotesStats = () => {},
}: SettingsModalProps) {
  const {
    view,
    setView,
    handleClose,
    darkModePreference,
    setDarkModePreference,
    reduceMotion,
    setReduceMotion,
    highContrastMode,
    setHighContrastMode,
    useDyslexicFont,
    setUseDyslexicFont,
  } =
    useSettingsModalLogic({ onClose, visible });

  const [isDarkModeOptionsOpen, setIsDarkModeOptionsOpen] = useState(false);

  useEffect(() => {
    if (!visible) {
      setIsDarkModeOptionsOpen(false);
    }
  }, [visible]);

  const darkModeLabels: Record<typeof darkModePreference, string> = {
    system: 'Match System',
    light: 'Light Mode',
    dark: 'Dark Mode',
  };

  const handleSelectDarkMode = async (
    value: typeof darkModePreference,
  ) => {
    await setDarkModePreference(value);
    setIsDarkModeOptionsOpen(false);
  };

  if (!visible) return null;

  if (view === 'archived') {
    return (
      <Modal animationType="slide" visible={visible} onRequestClose={handleClose}>
        <ArchivedHabitsModal onBack={() => setView('settings')} onClose={handleClose} />
      </Modal>
    );
  }

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={handleClose}>
      <View className="flex-1 bg-background">
        {/* Header with status bar simulation */}
        <View className="bg-background px-4 pb-4 pt-12">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-[20px] font-bold leading-[28px] text-foreground">
              {format(new Date(), 'H:mm')}
            </Text>
          </View>

          {/* Settings Title */}
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={handleClose}
              className="size-10 items-center justify-center rounded-full"
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <ChevronLeft size={28} color="#1a1a1a" />
            </TouchableOpacity>
            <Text className="text-[24px] font-bold leading-[32px] text-foreground">
              Settings
            </Text>
            <View className="size-10" />
          </View>
        </View>

        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          <View className="gap-6 pb-8">
            {/* Visual Preferences */}
            <SettingsSection title="Visual Preferences">
              <SettingsRow
                icon={<Moon size={16} color="#f97316" />}
                iconBackgroundColor="#fed7aa"
                label="Dark Mode"
                type="selection"
                value={darkModeLabels[darkModePreference]}
                onPress={() =>
                  setIsDarkModeOptionsOpen((prev) => !prev)
                }
                showBorder={!isDarkModeOptionsOpen}
              />
              {isDarkModeOptionsOpen && (
                <View className="px-4 pt-3">
                  <View className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                    {(
                      [
                        { value: 'system', label: 'Match System' },
                        { value: 'light', label: 'Light Mode' },
                        { value: 'dark', label: 'Dark Mode' },
                      ] as const
                    ).map(({ value, label }, index, array) => (
                      <TouchableOpacity
                        key={value}
                        activeOpacity={0.7}
                        className={`flex-row items-center justify-between px-4 py-3 ${
                          index < array.length - 1
                            ? 'border-b border-gray-100'
                            : ''
                        }`}
                        onPress={() => handleSelectDarkMode(value)}
                      >
                        <Text className="text-[15px] font-medium text-[#1a1a1a]">
                          {label}
                        </Text>
                        {darkModePreference === value && (
                          <View className="rounded-full bg-[#1a1a1a] p-1">
                            <Check size={14} color="#fff" />
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              <SettingsRow
                icon={<Smartphone size={16} color="#3b82f6" />}
                iconBackgroundColor="#bfdbfe"
                label="App Icon"
                type="selection"
                value="Default"
                onPress={() => {
                  // TODO: Navigate to app icon selector
                  console.log('Navigate to app icon selector');
                }}
                showBorder={false}
              />
            </SettingsSection>

            {/* Accessibility */}
            <SettingsSection title="Accessibility">
              <SettingsRow
                icon={<Contrast size={16} color="#a855f7" />}
                iconBackgroundColor="#e9d5ff"
                label="High Contrast Mode"
                type="toggle"
                value={highContrastMode}
                onToggle={setHighContrastMode}
                showBorder={true}
              />
              <SettingsRow
                icon={<BookOpen size={16} color="#14b8a6" />}
                iconBackgroundColor="#99f6e4"
                label="OpenDyslexic Font"
                type="toggle"
                value={useDyslexicFont}
                onToggle={setUseDyslexicFont}
                showBorder={true}
              />
              <SettingsRow
                icon={<Zap size={16} color="#ef4444" />}
                iconBackgroundColor="#fecaca"
                label="Reduce Motion"
                type="toggle"
                value={reduceMotion}
                onToggle={setReduceMotion}
                showBorder={false}
              />
            </SettingsSection>

            {/* Notifications */}
            <SettingsSection title="Notifications">
              <SettingsRow
                icon={<Bell size={16} color="#eab308" />}
                iconBackgroundColor="#fef08a"
                label="Manage Reminders"
                type="navigation"
                onPress={() => {
                  // TODO: Navigate to reminders management
                  console.log('Navigate to reminders management');
                }}
                showBorder={false}
              />
            </SettingsSection>

            {/* Support */}
            <SettingsSection title="Support">
              <SettingsRow
                icon={<HelpCircle size={16} color="#6b7280" />}
                iconBackgroundColor="#e5e7eb"
                label="Help & FAQ"
                type="navigation"
                onPress={() => {
                  // TODO: Navigate to help & FAQ
                  console.log('Navigate to help & FAQ');
                }}
                showBorder={true}
              />
              <SettingsRow
                icon={<Send size={16} color="#6b7280" />}
                iconBackgroundColor="#e5e7eb"
                label="Contact Us"
                type="navigation"
                onPress={() => {
                  // TODO: Navigate to contact form
                  console.log('Navigate to contact form');
                }}
                showBorder={false}
              />
            </SettingsSection>
          </View>

          {/* Footer */}
          <View className="items-center pb-8 pt-4">
            <Text className="text-center text-[14px] leading-[20px] text-muted-foreground">
              Habit Tracker v1.0.0
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
