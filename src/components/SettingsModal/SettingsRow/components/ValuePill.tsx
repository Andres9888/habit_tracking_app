/** ValuePill — a settings row's current value ("Classic", "Shortest first").
 *  No longer an actual pill: option 1b drops the recessed fill so the value
 *  reads as loose text sitting 8pt off the chevron. Name kept because every
 *  row call site imports it. */
import { Text } from 'react-native';
import { typography, fontWeights } from '@/theme/typography';
import type { SettingsRowColors } from '../SettingsRow.colors';

interface ValuePillProps {
  value: string;
  colors: SettingsRowColors;
}

export function ValuePill({ value, colors }: ValuePillProps) {
  return (
    <Text
      numberOfLines={1}
      style={{
        ...typography.bodySmall,
        color: colors.valueText,
        fontSize: 15,
        fontWeight: fontWeights.medium,
        maxWidth: 140,
      }}
    >
      {value}
    </Text>
  );
}
