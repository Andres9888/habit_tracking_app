/** RowCount — plain trailing count on a navigation row.
 *  Deliberately not a pill: a pill reads as an unread badge, and this is just
 *  how many items sit behind the row (e.g. archived habits). */
import { Text } from 'react-native';
import { typography, fontWeights } from '@/theme/typography';

interface RowCountProps {
  count: number;
  color: string;
}

export function RowCount({ count, color }: RowCountProps) {
  return (
    <Text
      style={{
        ...typography.bodySmall,
        fontWeight: fontWeights.bold,
        color,
      }}
    >
      {count}
    </Text>
  );
}
