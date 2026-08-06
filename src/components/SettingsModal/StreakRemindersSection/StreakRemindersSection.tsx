/** StreakRemindersSection — streak reminder notifications toggle */
import { Platform } from 'react-native';
import { Bell } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { SettingsSection } from '../SettingsSection';
import { useThemeColors } from '@/theme/ThemeContext';
import { useSettingsSearch } from '../search';
import { AndroidTimePickerDialog } from './components/AndroidTimePickerDialog';
import { DisabledHint } from './components/DisabledHint';
import { NotificationPermissionWarning } from './components/NotificationPermissionWarning';
import { ReminderInsetCard } from './components/ReminderInsetCard';
import { SoundHapticsRows } from './components/SoundHapticsRows';
import {
  useStreakRemindersAnimations,
  useTimePickerState,
} from './StreakRemindersSection.hooks';
import { useNotificationPermissionStatus } from './useNotificationPermissionStatus';
import type { StreakRemindersSectionProps } from './StreakRemindersSection.types';

export function StreakRemindersSection(props: StreakRemindersSectionProps) {
  const { setShowTimePicker, showTimePicker } = useTimePickerState();
  const { colors: themeColors, isDark, settings } = useThemeColors();
  const { isSearching } = useSettingsSearch();
  const { permissionGranted } = useNotificationPermissionStatus(props.enabled);
  const animations = useStreakRemindersAnimations(
    props.enabled,
    showTimePicker
  );
  const onTimeChange = animations.handleTimeChange(
    props.onChangeTime,
    setShowTimePicker
  );

  const handleToggleTimePicker = () => {
    if (Platform.OS === 'android') setShowTimePicker(true);
    else setShowTimePicker((current) => !current);
  };

  const insetBackground = isDark
    ? 'rgba(255,255,255,0.03)'
    : 'rgba(0,0,0,0.02)';
  const insetBorder = themeColors.border;
  const insetCardBackground = themeColors.surface;

  return (
    <SettingsSection icon={props.icon} title='Reminders'>
      {props.enabled && !permissionGranted && !isSearching ? (
        <NotificationPermissionWarning />
      ) : null}
      <SettingsRow
        icon={<Bell color={settings.bell.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.bell.bg}
        label='Streak reminders'
        subtitle='Nudge before an active streak slips'
        type='toggle'
        value={props.enabled}
        onToggle={(v) => void props.onToggle(v)}
      />
      {isSearching ? null : (
        <>
          <ReminderInsetCard
            enabled={props.enabled}
            insetBackground={insetBackground}
            insetBorder={insetBorder}
            insetCardBackground={insetCardBackground}
            insetExpandStyle={animations.insetExpand.contentAnimatedStyle}
            isPremium={props.isPremium}
            pickerExpandStyle={animations.pickerExpand.contentAnimatedStyle}
            reminderTime={props.reminderTime}
            showTimePicker={showTimePicker}
            onInsetLayout={animations.handleInsetLayout}
            onPickerLayout={animations.handlePickerLayout}
            onPremiumUpsell={props.onPremiumUpsell}
            onTimeChange={onTimeChange}
            onToggleTimePicker={handleToggleTimePicker}
          />
          <DisabledHint
            hintStyle={animations.hintExpand.contentAnimatedStyle}
            pointerEvents={props.enabled ? 'none' : 'auto'}
            onLayout={animations.handleHintLayout}
          />
          <AndroidTimePickerDialog
            reminderTime={props.reminderTime}
            visible={showTimePicker}
            onChange={onTimeChange}
          />
        </>
      )}
      <SoundHapticsRows
        enabled={props.completionSoundEnabled}
        soundType={props.completionSoundType}
        onChangeEnabled={props.onChangeCompletionSoundEnabled}
        onChangeType={props.onChangeCompletionSoundType}
      />
    </SettingsSection>
  );
}
