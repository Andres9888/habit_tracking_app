/** Row head value pill — filled when set, outlined verb chip when unset. */
import { Text, View } from 'react-native';
import { fontWeights, typography } from '@/theme/typography';
import type { PanelHue } from './panelTokens';

interface Props {
  label: string;
  set: boolean;
  hue: PanelHue;
}

export function ValueChip({ label, set, hue }: Props) {
  return (
    <View
      style={{
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: set ? hue.tile : 'transparent',
        borderWidth: set ? 0 : 1.5,
        borderColor: hue.unsetBorder ?? hue.ink,
      }}
    >
      <Text
        numberOfLines={1}
        style={{
          ...typography.label,
          fontSize: 12,
          fontWeight: fontWeights.semibold,
          color: hue.ink,
          fontVariant: ['tabular-nums'],
        }}
      >
        {label}
      </Text>
    </View>
  );
}
