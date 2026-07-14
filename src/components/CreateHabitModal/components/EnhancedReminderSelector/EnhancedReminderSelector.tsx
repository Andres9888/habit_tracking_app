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
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import { TimePickerModal } from '../TimePickerModal';
import { NextReminderBadge } from '../NextReminderBadge';
import { DEFAULT_PRESETS } from './constants';
import { useReminderSelector } from './useReminderSelector';
import { ToggleRow } from './ToggleRow';
import { PermissionBanner } from './PermissionBanner';
import { PresetButton } from './PresetButton';
import { CustomTimeButton } from './CustomTimeButton';
import type { EnhancedReminderSelectorProps } from './types';

const noopToggle = (_enabled: boolean) => {};
const noopTimeChange = (_time: Date) => {};

function createFallbackReminderTime() {
  const fallback = new Date();
  fallback.setHours(9, 0, 0, 0);
  return fallback;
}

export function EnhancedReminderSelector(
  props?: EnhancedReminderSelectorProps
) {
  const {
    enabled = false,
    reminderTime = createFallbackReminderTime(),
    onToggle = noopToggle,
    onTimeChange = noopTimeChange,
    presets = DEFAULT_PRESETS,
    showNextReminder = true,
    snapDefaultToPresetOnEnable = false,
  } = props ?? {};
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
    permissionDenied,
  } = useReminderSelector({
    onTimeChange,
    onToggle,
    presets,
    reminderTime,
    snapDefaultToPresetOnEnable,
  });

  return (
    <View className='mb-2' testID='enhanced-reminder-selector'>
      <ToggleRow enabled={enabled} onToggle={(v) => void handleToggle(v)} />
      <PermissionBanner visible={enabled ? permissionDenied : false} />

      {enabled ? <View className='mt-4'>
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

          {showNextReminder ? <View className='items-center'>
              <NextReminderBadge
                enabled={enabled}
                reminderTime={reminderTime}
              />
            </View> : null}
        </View> : null}

      <TimePickerModal
        initialTime={reminderTime}
        visible={showTimePicker}
        onCancel={() => setShowTimePicker(false)}
        onConfirm={handleCustomTimeConfirm}
      />
    </View>
  );
}

export default EnhancedReminderSelector;
