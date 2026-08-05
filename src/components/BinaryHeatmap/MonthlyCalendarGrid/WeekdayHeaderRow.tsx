import { Text, View } from 'react-native';
import { styles } from './styles';

const WEEKDAY_LABELS = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
] as const;

export function WeekdayHeaderRow({ labelColor }: { labelColor: string }) {
  return (
    <View style={styles.row}>
      {WEEKDAY_LABELS.map((day) => (
        <View key={day} style={styles.headerCell}>
          <Text style={[styles.headerText, { color: labelColor }]}>{day}</Text>
        </View>
      ))}
    </View>
  );
}
