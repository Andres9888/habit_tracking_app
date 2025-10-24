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
import PausedHabitsModal from '../PausedHabitsModal';
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
  isHighContrastActive?: boolean;
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
  isHighContrastActive = false,
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

  const colors = isHighContrastActive
    ? {
        accent: '#facc15',
        background: '#000000',
        card: '#111111',
        cardBorder: '#2f2f2f',
        headerText: '#ffffff',
        mutedText: '#facc15',
        icon: '#facc15',
        selectionBackground: '#161616',
        selectionBorder: '#2f2f2f',
        versionText: '#facc15',
      }
    : {
        accent: '#1a1a1a',
        background: '#f8f5f1',
        card: '#ffffff',
        cardBorder: '#f1f5f9',
        headerText: '#1a1a1a',
        mutedText: '#8a8a8a',
        icon: '#1a1a1a',
        selectionBackground: '#ffffff',
        selectionBorder: '#f1f5f9',
        versionText: '#6b7280',
      };

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

  if (view === 'paused') {
    return (
      <Modal animationType="slide" visible={visible} onRequestClose={handleClose}>
        <PausedHabitsModal onBack={() => setView('settings')} onClose={handleClose} />
      </Modal>
    );
  }

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={handleClose}>
      <View
        className="flex-1 bg-background"
        style={{ backgroundColor: colors.background }}
      >
        {/* Header with status bar simulation */}
        <View className="bg-background px-4 pb-4 pt-12" style={{ backgroundColor: colors.background }}>
          <View className="mb-4 flex-row items-center justify-between">
            <Text
              className="text-[20px] font-bold leading-[28px] text-foreground"
              style={{ color: colors.headerText }}
            >
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
              <ChevronLeft size={28} color={colors.icon} />
            </TouchableOpacity>
            <Text
              className="text-[24px] font-bold leading-[32px] text-foreground"
              style={{ color: colors.headerText }}
            >
              Settings
            </Text>
            <View className="size-10" />
          </View>
        </View>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: colors.background }}
        >
          <View className="gap-6 pb-8">
            {/* Visual Preferences */}
            <SettingsSection
              title="Visual Preferences"
              highContrastMode={isHighContrastActive}
            >
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
                highContrastMode={isHighContrastActive}
              />
              {isDarkModeOptionsOpen && (
                <View className="px-4 pt-3">
                  <View
                    className="rounded-2xl border bg-white shadow-sm"
                    style={{
                      backgroundColor: colors.selectionBackground,
                      borderColor: colors.selectionBorder,
                    }}
                  >
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
                        style={{
                          borderColor:
                            index < array.length - 1
                              ? colors.selectionBorder
                              : undefined,
                        }}
                      >
                        <Text
                          className="text-[15px] font-medium"
                          style={{ color: colors.headerText }}
                        >
                          {label}
                        </Text>
                        {darkModePreference === value && (
                          <View
                            className="rounded-full p-1"
                            style={{ backgroundColor: colors.accent }}
                          >
                            <Check
                              size={14}
                              color={isHighContrastActive ? '#000000' : '#fff'}
                            />
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
                highContrastMode={isHighContrastActive}
              />
            </SettingsSection>
            {/* Habit Management */}
            <SettingsSection
              title="Habit Management"
              highContrastMode={isHighContrastActive}
            >
              <SettingsRow
                icon={<BookOpen size={16} color="#8b5cf6" />}
                iconBackgroundColor="#ddd6fe"
                label="Paused Habits"
                type="navigation"
                onPress={() => setView('paused')}
                showBorder={true}
                highContrastMode={isHighContrastActive}
              />
              <SettingsRow
                icon={<BookOpen size={16} color="#64748b" />}
                iconBackgroundColor="#e2e8f0"
                label="Archived Habits"
                type="navigation"
                onPress={() => setView('archived')}
                showBorder={false}
                highContrastMode={isHighContrastActive}
              />
            </SettingsSection>

            {/* Notifications */}
            <SettingsSection
              title="Notifications"
              highContrastMode={isHighContrastActive}
            >
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
                highContrastMode={isHighContrastActive}
              />
            </SettingsSection>

            {/* Support */}
            <SettingsSection
              title="Support"
              highContrastMode={isHighContrastActive}
            >
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
                highContrastMode={isHighContrastActive}
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
                highContrastMode={isHighContrastActive}
              />
            </SettingsSection>
          </View>

          {/* Footer */}
          <View className="items-center pb-8 pt-4">
            <Text
              className="text-center text-[14px] leading-[20px]"
              style={{ color: colors.versionText }}
            >
              Habit Tracker v1.0.0
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
