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

export function WeekdayHeaderRow({
  compact = false,
  labelColor,
}: {
  compact?: boolean;
  labelColor: string;
}) {
  return (
    <View style={styles.row}>
      {WEEKDAY_LABELS.map((day) => (
        <View key={day} style={styles.headerCell}>
          <Text
            style={[
              styles.headerText,
              { color: labelColor, letterSpacing: compact ? 1 : 0.3 },
            ]}
          >
            {compact ? day[0] : day}
          </Text>
        </View>
      ))}
    </View>
  );
}
