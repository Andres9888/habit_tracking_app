/** WorkingStatTile — one of the paired percentage tiles in WhatsWorkingCard. */
import { Text, View } from 'react-native';
import { withAlpha } from '../../../../theme/colors';
import { borderRadius } from '../../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';

interface WorkingStatTileProps {
  label: string;
  /** Muted tiles carry the "everything else" half of the split. */
  muted?: boolean;
  palette: InsightPalette;
  value: number;
}

export function WorkingStatTile({
  label,
  muted = false,
  palette,
  value,
}: WorkingStatTileProps) {
  const tint = muted ? palette.textTertiary : palette.textPrimary;

  return (
    <View
      style={{
        backgroundColor: muted ? withAlpha(palette.card, 0.55) : palette.card,
        borderRadius: borderRadius.medium,
        flex: 1,
        paddingHorizontal: 14,
        paddingVertical: 12,
      }}
    >
      <Text
        style={{
          color: tint,
          fontFamily: fontFamilies.primary.display,
          fontSize: 24,
          fontWeight: fontWeights.bold,
        }}
      >
        {value}%
      </Text>
      <Text
        style={{
          color: muted ? palette.textTertiary : palette.textSecondary,
          fontSize: 12,
          marginTop: 4,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
