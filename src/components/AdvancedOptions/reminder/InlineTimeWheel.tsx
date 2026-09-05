/**
 * iOS inline time wheel — a spinner in a chip-rest card under the chips.
 * Commits on every change; there is no confirm step (spec §5).
 */
import { View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { usePanelTokens } from '../panel/panelTokens';

interface Props {
  time: Date;
  onChange: (time: Date) => void;
}

export function InlineTimeWheel({ time, onChange }: Props) {
  const t = usePanelTokens();

  return (
    <View
      accessibilityLabel='Reminder time wheel'
      style={{
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: t.chipRestBorder,
        backgroundColor: t.chipRestBg,
      }}
      testID='inline-time-wheel'
    >
      <DateTimePicker
        display='spinner'
        is24Hour={false}
        mode='time'
        style={{ height: 150, width: '100%' }}
        testID='inline-time-picker'
        textColor={t.textPrimary}
        value={time}
        onChange={(_event: DateTimePickerEvent, date?: Date) => {
          if (date) onChange(date);
        }}
      />
    </View>
  );
}
