import DateTimePicker from '@react-native-community/datetimepicker';

interface TimePickerSectionProps {
  visible: boolean;
  value: Date;
  onClose: () => void;
  onSelect: (date: Date) => void;
}

/**
 * Time picker component for habit reminders
 */
export function TimePickerSection({
  visible,
  value,
  onClose,
  onSelect,
}: TimePickerSectionProps) {
  if (!visible) return null;

  return (
    <DateTimePicker
      display='spinner'
      is24Hour={false}
      mode='time'
      value={value}
      onChange={(_event, selected) => {
        onClose();
        if (selected) {
          onSelect(selected);
        }
      }}
    />
  );
}
