/** RowCount — trailing count on a navigation row, as a soft GOLD pill.
 *  It reads as metadata, not an unread badge: the 1b mock pairs the gold
 *  navigational tile at the row's head with a matching gold count at its tail,
 *  so "45 archived habits" is scannable without shouting. */
import { Text, View } from 'react-native';
import { typography, fontWeights } from '@/theme/typography';
import { useThemeColors } from '@/theme/ThemeContext';

interface RowCountProps {
  count: number;
}

export function RowCount({ count }: RowCountProps) {
  const { settings, isDark } = useThemeColors();

  return (
    <View
      style={{
        backgroundColor: settings.neutral.bg,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 3,
      }}
    >
      <Text
        style={{
          ...typography.label,
          color: isDark ? settings.neutral.icon : '#7D5907',
          fontWeight: fontWeights.bold,
        }}
      >
        {count}
      </Text>
    </View>
  );
}
