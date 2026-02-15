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
 * - Keyboard dismissed on any interaction
 * - All elements have accessibility labels
 * - Haptic feedback on selection
 */

import { View } from 'react-native';
import { memo } from 'react';

import type { EnhancedReminderSelectorProps } from './types';
import { CustomTimeButton } from './CustomTimeButton';
import { DEFAULT_PRESETS } from './constants';
import { NextReminderBadge } from '../NextReminderBadge';
import { PresetButton } from './PresetButton';
import { TimePickerModal } from '../TimePickerModal';
import { ToggleRow } from './ToggleRow';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import { useReminderSelector } from './useReminderSelector';

function EnhancedReminderSelectorComponent({
  enabled,
  reminderTime,
  onToggle,
  onTimeChange,
  presets = DEFAULT_PRESETS,
  showNextReminder = true,
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
