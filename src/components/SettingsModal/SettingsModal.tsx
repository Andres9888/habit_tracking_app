import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Bell,
  BookOpen,
  Check,
  ChevronLeft,
  Contrast,
  HelpCircle,
  Moon,
  PartyPopper,
  Send,
  Smartphone,
  Zap,
} from 'lucide-react-native';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ArchivedHabitsModal from '../ArchivedHabitsModal';
import PausedHabitsModal from '../PausedHabitsModal';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { useSettingsModalLogic } from './SettingsModal.hooks';

interface SettingsModalProps {
  celebrationsEnabled?: boolean;
  onClose: () => void;
  visible: boolean;
  isCompact?: boolean;
  onChangeCompact?: (value: boolean) => void | Promise<void>;
  onChangeCelebrationsEnabled?: (value: boolean) => void | Promise<void>;
  showCharacterScreen?: boolean;
  onChangeShowCharacterScreen?: (value: boolean) => void | Promise<void>;
  showHabitStrengthPercentage?: boolean;
  onChangeShowHabitStrengthPercentage?: (
    value: boolean
  ) => void | Promise<void>;
  showNotesStats?: boolean;
  onChangeShowNotesStats?: (value: boolean) => void | Promise<void>;
  isHighContrastActive?: boolean;
  onOpenHapticTest?: () => void;
}

export default function SettingsModal({
  celebrationsEnabled = true,
  visible,
  onClose,
  isCompact = false,
  onChangeCompact = () => {},
  onChangeCelebrationsEnabled,
  showCharacterScreen = true,
  onChangeShowCharacterScreen = () => {},
  showHabitStrengthPercentage = true,
  onChangeShowHabitStrengthPercentage = () => {},
  showNotesStats = true,
  onChangeShowNotesStats = () => {},
  isHighContrastActive = false,
  onOpenHapticTest,
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
  } = useSettingsModalLogic({ onClose, visible });

  const [isDarkModeOptionsOpen, setIsDarkModeOptionsOpen] = useState(false);

  const colors = isHighContrastActive
    ? {
        accent: '#facc15',
        background: '#000000',
        card: '#111111',
        cardBorder: '#2f2f2f',
        headerText: '#ffffff',
        icon: '#facc15',
        mutedText: '#facc15',
        selectionBackground: '#161616',
        selectionBorder: '#2f2f2f',
        versionText: '#facc15',
      }
    : {
        accent: '#1a1a1a',
        background: '#F7F8FB',
        card: '#ffffff',
        cardBorder: '#f1f5f9',
        headerText: '#1a1a1a',
        icon: '#1a1a1a',
        mutedText: '#8a8a8a',
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
    dark: 'Dark Mode',
    light: 'Light Mode',
    system: 'Match System',
  };

  const handleSelectDarkMode = async (value: typeof darkModePreference) => {
    await setDarkModePreference(value);
    setIsDarkModeOptionsOpen(false);
  };

  if (!visible) return null;

  if (view === 'archived') {
    return (
      <Modal
        animationType='slide'
        visible={visible}
        onRequestClose={handleClose}
      >
        <ArchivedHabitsModal
          onBack={() => setView('settings')}
          onClose={handleClose}
        />
      </Modal>
    );
  }

  if (view === 'paused') {
    return (
      <Modal
        animationType='slide'
        visible={visible}
        onRequestClose={handleClose}
      >
        <PausedHabitsModal
          onBack={() => setView('settings')}
          onClose={handleClose}
        />
      </Modal>
    );
  }

  return (
    <Modal animationType='slide' visible={visible} onRequestClose={handleClose}>
      <View
        className='flex-1 bg-background'
        style={{ backgroundColor: colors.background }}
      >
        {/* Header with status bar simulation */}
        <View
          className='bg-background px-4 pb-4 pt-12'
          style={{ backgroundColor: colors.background }}
        >
          <View className='mb-4 flex-row items-center justify-between'>
            <Text
              className='text-[20px] font-bold leading-[28px] text-foreground'
              style={{ color: colors.headerText }}
            >
              {format(new Date(), 'H:mm')}
            </Text>
          </View>

          {/* Settings Title */}
          <View className='flex-row items-center justify-between'>
            <TouchableOpacity
              accessibilityLabel='Back'
              accessibilityRole='button'
              className='size-10 items-center justify-center rounded-full'
              onPress={handleClose}
            >
              <ChevronLeft color={colors.icon} size={28} />
            </TouchableOpacity>
            <Text
              className='text-[24px] font-bold leading-[32px] text-foreground'
              style={{ color: colors.headerText }}
            >
              Settings
            </Text>
            <View className='size-10' />
          </View>
        </View>

        <ScrollView
          className='flex-1 px-4'
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: colors.background }}
        >
          <View className='gap-6 pb-8'>
            {/* Visual Preferences */}
            <SettingsSection
              highContrastMode={isHighContrastActive}
              title='Visual Preferences'
            >
              <SettingsRow
                highContrastMode={isHighContrastActive}
                icon={<Moon color='#f97316' size={16} />}
                iconBackgroundColor='#fed7aa'
                label='Dark Mode'
                showBorder={!isDarkModeOptionsOpen}
                type='selection'
                value={darkModeLabels[darkModePreference]}
                onPress={() => setIsDarkModeOptionsOpen((prev) => !prev)}
              />
              {isDarkModeOptionsOpen && (
                <View className='px-4 pt-3'>
                  <View
                    className='rounded-2xl border bg-white shadow-sm'
                    style={{
                      backgroundColor: colors.selectionBackground,
                      borderColor: colors.selectionBorder,
                    }}
                  >
                    {(
                      [
                        { label: 'Match System', value: 'system' },
                        { label: 'Light Mode', value: 'light' },
                        { label: 'Dark Mode', value: 'dark' },
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
                        style={{
                          borderColor:
                            index < array.length - 1
                              ? colors.selectionBorder
                              : undefined,
                        }}
                        onPress={() => handleSelectDarkMode(value)}
                      >
                        <Text
                          className='text-[15px] font-medium'
                          style={{ color: colors.headerText }}
                        >
                          {label}
                        </Text>
                        {darkModePreference === value && (
                          <View
                            className='rounded-full p-1'
                            style={{ backgroundColor: colors.accent }}
                          >
                            <Check
                              color={isHighContrastActive ? '#000000' : '#fff'}
                              size={14}
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              <SettingsRow
                highContrastMode={isHighContrastActive}
                icon={<Smartphone color='#3b82f6' size={16} />}
                iconBackgroundColor='#bfdbfe'
                label='App Icon'
                showBorder={false}
                type='selection'
                value='Default'
                onPress={() => {
                  // TODO: Navigate to app icon selector
                  console.log('Navigate to app icon selector');
                }}
              />
            </SettingsSection>
            {/* Habit Management */}
            <SettingsSection
              highContrastMode={isHighContrastActive}
              title='Habit Management'
            >
              <SettingsRow
                showBorder
                highContrastMode={isHighContrastActive}
                icon={<BookOpen color='#8b5cf6' size={16} />}
                iconBackgroundColor='#ddd6fe'
                label='Paused Habits'
                type='navigation'
                onPress={() => setView('paused')}
              />
              <SettingsRow
                highContrastMode={isHighContrastActive}
                icon={<BookOpen color='#64748b' size={16} />}
                iconBackgroundColor='#e2e8f0'
                label='Archived Habits'
                showBorder={false}
                type='navigation'
                onPress={() => setView('archived')}
              />
            </SettingsSection>

            {/* Notifications */}
            <SettingsSection
              highContrastMode={isHighContrastActive}
              title='Notifications'
            >
              <SettingsRow
                highContrastMode={isHighContrastActive}
                icon={<Bell color='#eab308' size={16} />}
                iconBackgroundColor='#fef08a'
                label='Manage Reminders'
                showBorder={false}
                type='navigation'
                onPress={() => {
                  // TODO: Navigate to reminders management
                  console.log('Navigate to reminders management');
                }}
              />
            </SettingsSection>

          {/* Celebrations & Feedback */}
          <SettingsSection
            highContrastMode={isHighContrastActive}
            title='Celebrations & Feedback'
          >
            <SettingsRow
              highContrastMode={isHighContrastActive}
              icon={<PartyPopper color='#22c55e' size={16} />}
              iconBackgroundColor='#bbf7d0'
              label='Celebration Animations'
              type='toggle'
              value={celebrationsEnabled}
              onToggle={(value) => {
                void onChangeCelebrationsEnabled?.(value);
              }}
            />
            <SettingsRow
              highContrastMode={isHighContrastActive}
              icon={<Zap color='#22c55e' size={16} />}
              iconBackgroundColor='#bbf7d0'
              label='Reduce Motion'
              showBorder={false}
              type='toggle'
              value={reduceMotion}
              onToggle={setReduceMotion}
            />
          </SettingsSection>

            {/* Diagnostics */}
            <SettingsSection
              highContrastMode={isHighContrastActive}
              title='Diagnostics'
            >
              <SettingsRow
                highContrastMode={isHighContrastActive}
                icon={<Zap color='#22c55e' size={16} />}
                iconBackgroundColor='#bbf7d0'
                label='Haptic Test'
                showBorder={false}
                type='navigation'
                onPress={() => {
                  onOpenHapticTest?.();
                }}
              />
            </SettingsSection>

            {/* Support */}
            <SettingsSection
              highContrastMode={isHighContrastActive}
              title='Support'
            >
              <SettingsRow
                showBorder
                highContrastMode={isHighContrastActive}
                icon={<HelpCircle color='#6b7280' size={16} />}
                iconBackgroundColor='#e5e7eb'
                label='Help & FAQ'
                type='navigation'
                onPress={() => {
                  // TODO: Navigate to help & FAQ
                  console.log('Navigate to help & FAQ');
                }}
              />
              <SettingsRow
                highContrastMode={isHighContrastActive}
                icon={<Send color='#6b7280' size={16} />}
                iconBackgroundColor='#e5e7eb'
                label='Contact Us'
                showBorder={false}
                type='navigation'
                onPress={() => {
                  // TODO: Navigate to contact form
                  console.log('Navigate to contact form');
                }}
              />
            </SettingsSection>
          </View>

          {/* Footer */}
          <View className='items-center pb-8 pt-4'>
            <Text
              className='text-center text-[14px] leading-[20px]'
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
