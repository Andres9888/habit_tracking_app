/** Preset + Custom option chips inside the open Daily reminder row. */
import { Text } from 'react-native';
import { Clock } from 'lucide-react-native';
import { DEFAULT_PRESETS } from '@/components/CreateHabitModal/components/EnhancedReminderSelector/constants';
import type { ReminderPreset } from '@/components/CreateHabitModal/components/EnhancedReminderSelector/types';
import { OptionChip } from '../panel/OptionChip';
import { OptionChipRow } from '../panel/OptionChipRow';
import { usePanelTokens } from '../panel/panelTokens';

interface Props {
  selectedPreset: string | null;
  /** "PICK" until a custom time is set, then the formatted time. */
  customLabel: string;
  customSelected: boolean;
  disabled: boolean;
  onPresetPress: (preset: ReminderPreset) => void;
  onCustomPress: () => void;
}

export function ReminderChips({
  selectedPreset,
  customLabel,
  customSelected,
  disabled,
  onPresetPress,
  onCustomPress,
}: Props) {
  const t = usePanelTokens();

  return (
    <OptionChipRow>
      {DEFAULT_PRESETS.map((preset) => (
        <OptionChip
          key={preset.id}
          accessibilityLabel={`Set reminder for ${preset.label}${preset.time ? ` at ${preset.time}` : ''}`}
          disabled={disabled}
          glyph={
            <Text allowFontScaling={false} style={{ fontSize: 18, lineHeight: 20 }}>
              {preset.emoji}
            </Text>
          }
          label={preset.time ?? ''}
          selected={selectedPreset === preset.id}
          testID={`preset-${preset.id}`}
          value={preset.label}
          valueSize={15}
          onPress={() => onPresetPress(preset)}
        />
      ))}
      <OptionChip
        accessibilityLabel='Set a custom reminder time'
        disabled={disabled}
        glyph={
          <Clock
            color={customSelected ? t.chipSelectedInk : t.textPrimary}
            size={18}
            strokeWidth={2}
          />
        }
        label={customLabel}
        selected={customSelected}
        testID='custom-time-button'
        value='Custom'
        valueSize={15}
        onPress={onCustomPress}
      />
    </OptionChipRow>
  );
}
