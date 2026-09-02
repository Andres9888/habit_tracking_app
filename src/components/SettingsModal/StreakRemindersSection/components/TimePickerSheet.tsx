/** TimePickerSheet — iOS bottom sheet behind the streak reminder row.
 *  The spinner edits a local draft so a half-scrolled wheel never writes a
 *  time the user did not settle on; Done commits, dismissal discards. */
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Modal } from '../../../Modal';
import { Button } from '../../../Button/Button';
import { useThemeColors } from '@/theme/ThemeContext';
import { settingsSectionTitle } from '../../settingsSectionTitleStyle';
import { dateToTimeString, timeStringToDate } from '../../timeHelpers';

interface TimePickerSheetProps {
  visible: boolean;
  reminderTime: string;
  onChangeTime: (time: string) => void | Promise<void>;
  onClose: () => void;
}

export function TimePickerSheet({
  visible,
  reminderTime,
  onChangeTime,
  onClose,
}: TimePickerSheetProps) {
  const { colors: themeColors } = useThemeColors();
  const [draft, setDraft] = useState(() => timeStringToDate(reminderTime));

  // Reopening after a dismissal should show the saved time, not the abandoned
  // scroll position.
  useEffect(() => {
    if (visible) setDraft(timeStringToDate(reminderTime));
  }, [visible, reminderTime]);

  const handleDone = () => {
    void onChangeTime(dateToTimeString(draft));
    onClose();
  };

  // Spinner drags are vertical; the sheet's pull-to-dismiss pan would steal them.
  return (
    <Modal disableGestureClose visible={visible} onClose={onClose}>
      <View className='px-5 pb-2 pt-1' style={{ gap: 14 }}>
        <Text
          style={{ ...settingsSectionTitle, color: themeColors.text.primary }}
        >
          Remind me at
        </Text>
        <DateTimePicker
          display='spinner'
          mode='time'
          value={draft}
          onChange={(_event, date) => {
            if (date) setDraft(date);
          }}
        />
        <Button fullWidth variant='primary' onPress={handleDone}>
          Done
        </Button>
      </View>
    </Modal>
  );
}
