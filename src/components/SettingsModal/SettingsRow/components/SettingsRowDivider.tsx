/** SettingsRowDivider — hairline inset to align under the row label (Calm) */
import { View } from 'react-native';

// px-4 (16) + icon w-10 (40) + mr-4 (16) = where the label text starts
const LABEL_INSET = 72;

interface Props {
  color: string;
}

export function SettingsRowDivider({ color }: Props) {
  return (
    <View
      pointerEvents='none'
      style={{
        position: 'absolute',
        bottom: 0,
        left: LABEL_INSET,
        right: 0,
        height: 1,
        backgroundColor: color,
      }}
    />
  );
}
