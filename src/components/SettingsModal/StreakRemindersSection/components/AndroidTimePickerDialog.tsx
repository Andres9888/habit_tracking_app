import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { timeStringToDate } from '../../timeHelpers';

interface AndroidTimePickerDialogProps {
  visible: boolean;
  reminderTime: string;
  onChange: (event: unknown, date?: Date) => void;
}

export function AndroidTimePickerDialog({
  visible,
  reminderTime,
  onChange,
}: AndroidTimePickerDialogProps) {
  if (Platform.OS !== 'android' || !visible) return null;

  return (
    <DateTimePicker
      display='default'
      mode='time'
      value={timeStringToDate(reminderTime)}
      onChange={onChange}
    />
  );
}
