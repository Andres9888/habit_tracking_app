/** ChainCareRemindersSection — streak reminder notifications toggle */
import { Platform } from 'react-native';
import { Bell } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { SettingsSection } from '../SettingsSection';
import { useThemeColors } from '@/theme/ThemeContext';
import { AndroidTimePickerDialog } from './components/AndroidTimePickerDialog';
import { DisabledHint } from './components/DisabledHint';
import { ReminderInsetCard } from './components/ReminderInsetCard';
import {
  useStreakRemindersAnimations,
  useTimePickerState,
} from './ChainCareRemindersSection.hooks';
import type { ChainCareRemindersSectionProps } from './ChainCareRemindersSection.types';

export function ChainCareRemindersSection(props: ChainCareRemindersSectionProps) {
  const { setShowTimePicker, showTimePicker } = useTimePickerState();
  const { colors: themeColors, isDark, settings } = useThemeColors();
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
      <SettingsRow
        icon={<Bell color={settings.bell.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.bell.bg}
        label='Chain care reminders'
        subtitle='A gentle nudge if a chain needs care — never a scold'
        type='toggle'
        value={props.enabled}
        onToggle={(v) => void props.onToggle(v)}
      />
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
    </SettingsSection>
  );
}
