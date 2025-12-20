import { format } from 'date-fns';
import {
  Activity,
  BookOpen,
  Check,
  ChevronLeft,
  Circle,
} from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArchivedHabitsModal from '../ArchivedHabitsModal';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { useSettingsModalLogic } from './SettingsModal.hooks';

interface SettingsModalProps {
  celebrationsEnabled?: boolean;
  dayShape?: 'circle' | 'square';
  habitCompletionIcon?: 'chain' | 'checkbox';
  onChangeDayShape?: (value: 'circle' | 'square') => void | Promise<void>;
  onChangeShowCharacterScreen?: (value: boolean) => void | Promise<void>;
  onChangeHabitCompletionIcon?: (
    value: 'chain' | 'checkbox'
  ) => void | Promise<void>;
  onChangeCelebrationsEnabled?: (value: boolean) => void | Promise<void>;
  onChangeCompact?: (value: boolean) => void | Promise<void>;
  showHabitStrengthPercentage?: boolean;
  onChangeShowHabitStrengthPercentage?: (
    value: boolean
  ) => void | Promise<void>;
  showWeekCompletionBar?: boolean;
  onChangeShowWeekCompletionBar?: (value: boolean) => void | Promise<void>;
  showNotesStats?: boolean;
  onChangeShowNotesStats?: (value: boolean) => void | Promise<void>;
  isHighContrastActive?: boolean;
  isCompact?: boolean;
  onOpenHapticTest?: () => void;
  onClose: () => void;
  showCharacterScreen?: boolean;
  visible: boolean;
}

export default function SettingsModal({
  celebrationsEnabled = true,
  dayShape = 'square',
  habitCompletionIcon = 'chain',
  isCompact = false,
  isHighContrastActive = false,
  onChangeCompact = () => {},
  onChangeCelebrationsEnabled,
  onChangeDayShape = () => {},
  onChangeHabitCompletionIcon = () => {},
  onChangeShowCharacterScreen = () => {},
  showHabitStrengthPercentage = true,
  onChangeShowHabitStrengthPercentage = () => {},
  onChangeShowWeekCompletionBar = () => {},
  showNotesStats = true,
  onChangeShowNotesStats = () => {},
  onClose,
  onOpenHapticTest,
  showCharacterScreen = true,
  showWeekCompletionBar = true,
  visible,
}: SettingsModalProps) {
  const {
    view,
    setView,
    handleClose,
  } = useSettingsModalLogic({ onClose, visible });
  const insets = useSafeAreaInsets();

  const colors = isHighContrastActive
    ? {
        accent: '#facc15',
        background: '#000000',
        card: '#111111',
        cardBorder: '#2f2f2f',
        headerText: '#ffffff',
        icon: '#facc15',
        mutedText: '#facc15',
        versionText: '#facc15',
      }
    : {
        accent: '#1a1a1a',
        background: '#f8f5f1',
        card: '#ffffff',
        cardBorder: '#f1f5f9',
        headerText: '#1a1a1a',
        icon: '#1a1a1a',
        mutedText: '#8a8a8a',
        versionText: '#6b7280',
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

  return (
    <Modal animationType='slide' visible={visible} onRequestClose={handleClose}>
      <View
        className='flex-1 bg-background'
        style={{ backgroundColor: colors.background }}
      >
        {/* Header with status bar simulation */}
        <View
          className='bg-background px-4 pb-4'
          style={{ backgroundColor: colors.background, paddingTop: insets.top + 8 }}
        >
          <View className='mb-4 flex-row items-center justify-between'>
            <Text
              className='text-[22px] font-semibold leading-[28px] text-foreground'
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
                icon={<Activity color='#16a34a' size={16} />}
                iconBackgroundColor='#bbf7d0'
                label='Daily progress bar'
                type='toggle'
                value={showWeekCompletionBar}
                onToggle={(value) => void onChangeShowWeekCompletionBar(value)}
              />
              <SettingsRow
                highContrastMode={isHighContrastActive}
                icon={<Check color='#0284c7' size={16} />}
                iconBackgroundColor='#bae6fd'
                label='Use checkbox completion icon'
                type='toggle'
                value={habitCompletionIcon === 'checkbox'}
                onToggle={(value) =>
                  void onChangeHabitCompletionIcon(value ? 'checkbox' : 'chain')
                }
              />
              <SettingsRow
                highContrastMode={isHighContrastActive}
                icon={<Circle color='#8b5cf6' size={16} />}
                iconBackgroundColor='#ddd6fe'
                label='Use circles for habit days'
                showBorder={false}
                type='toggle'
                value={dayShape === 'circle'}
                onToggle={(value) =>
                  void onChangeDayShape(value ? 'circle' : 'square')
                }
              />
            </SettingsSection>
            {/* Habit Management */}
            <SettingsSection
              highContrastMode={isHighContrastActive}
              title='Habit Management'
            >
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
          </View>

          {/* Footer */}
          <View className='items-center pb-8 pt-4'>
            <Text
              className='text-center text-[13px] leading-[18px]'
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
