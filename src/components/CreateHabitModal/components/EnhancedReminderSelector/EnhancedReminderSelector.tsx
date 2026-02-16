/**
 * EnhancedReminderSelector - Full-featured reminder configuration UI.
 *
 * Features:
 * - Toggle row with bell icon and switch
 * - Quick preset buttons (Morning/Midday/Evening)
 * - Custom time button that opens native TimePickerModal
 * - Selected preset shows green border
 * - Custom time shows green border when set
 * - Next reminder badge updates on time change
 * - Notification preview showing what the alert looks like
 * - Smart suggestions based on reminder time
 * - Keyboard dismissed on any interaction
 * - All elements have accessibility labels
 * - Haptic feedback on selection
 */

import { memo } from 'react';
import { View } from 'react-native';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import { TimePickerModal } from '../TimePickerModal';
import { NextReminderBadge } from '../NextReminderBadge';
import { ReminderNotificationPreview } from '../ReminderNotificationPreview';
import { ReminderSmartSuggestion } from '../ReminderSmartSuggestion';
import { QuietHoursWarning } from '../QuietHoursWarning';
import { DEFAULT_PRESETS } from './constants';
import { useReminderSelector } from './useReminderSelector';
import { ToggleRow } from './ToggleRow';
import { PresetButton } from './PresetButton';
import { CustomTimeButton } from './CustomTimeButton';
import type { EnhancedReminderSelectorProps } from './types';

function EnhancedReminderSelectorComponent({
  enabled,
  reminderTime,
  onToggle,
  onTimeChange,
  presets = DEFAULT_PRESETS,
  showNextReminder = true,
  quietHoursEnabled = false,
  quietHoursStartTime = '22:00',
  quietHoursEndTime = '07:00',
  habitName = 'Your habit',
}: EnhancedReminderSelectorProps) {
  const reduceMotion = useReduceMotion();

  const {
    showTimePicker,
    setShowTimePicker,
    selectedPreset,
    isCustomTime,
    customTimeLabel,
    handlePresetSelect,
    handleCustomTimePress,
    handleCustomTimeConfirm,
    handleToggle,
  } = useReminderSelector({ onTimeChange, onToggle, presets, reminderTime });

  return (
    <View className='mb-6' testID='enhanced-reminder-selector'>
      <ToggleRow enabled={enabled} onToggle={handleToggle} />

      {enabled && (
        <View className='mt-4'>
          <View className='mb-4 flex-row gap-3' testID='preset-buttons'>
            {presets.map((preset) => (
              <PresetButton
                key={preset.id}
                isSelected={selectedPreset === preset.id}
                preset={preset}
                reduceMotion={reduceMotion}
                onPress={() => handlePresetSelect(preset)}
              />
            ))}
          </View>

          <CustomTimeButton
            customTimeLabel={customTimeLabel}
            isCustomTime={isCustomTime}
            onPress={handleCustomTimePress}
          />

          {/* Notification preview */}
          <ReminderNotificationPreview
            reminderTime={reminderTime}
            habitName={habitName}
            showPreview={true}
          />

          {/* Quiet hours warning if applicable */}
          <QuietHoursWarning
            reminderTime={reminderTime}
            quietHoursEnabled={quietHoursEnabled}
            quietHoursStartTime={quietHoursStartTime}
            quietHoursEndTime={quietHoursEndTime}
          />

          {/* Smart suggestion based on time */}
          <ReminderSmartSuggestion
            enabled={enabled}
            hour={reminderTime.getHours()}
            minute={reminderTime.getMinutes()}
          />

          {showNextReminder && (
            <View className='items-center'>
              <NextReminderBadge
                enabled={enabled}
                reminderTime={reminderTime}
              />
            </View>
          )}
        </View>
      )}

      <TimePickerModal
        initialTime={reminderTime}
        visible={showTimePicker}
        onCancel={() => setShowTimePicker(false)}
        onConfirm={handleCustomTimeConfirm}
      />
    </View>
  );
}

export const EnhancedReminderSelector = memo(EnhancedReminderSelectorComponent);
export default EnhancedReminderSelector;
