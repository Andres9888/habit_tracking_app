/**
 * GoalPresetRow — the preset chips. The suggested value is tinted so the row
 * has an obvious right answer without disabling the others.
 */
import { Pressable, Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';

interface GoalPresetRowProps {
  palette: InsightPalette;
  presets: readonly number[];
  suggested: number;
  onCustom: () => void;
  onPick: (days: number) => void;
}

export function GoalPresetRow({
  palette,
  presets,
  suggested,
  onCustom,
  onPick,
}: GoalPresetRowProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 7, marginTop: 14 }}>
      {presets.map((days) => (
        <Chip
          key={days}
          highlighted={days === suggested}
          label={String(days)}
          palette={palette}
          onPress={() => onPick(days)}
        />
      ))}
      <Chip
        highlighted={false}
        label='Custom'
        palette={palette}
        onPress={onCustom}
      />
    </View>
  );
}

function Chip({
  highlighted,
  label,
  palette,
  onPress,
}: {
  highlighted: boolean;
  label: string;
  palette: InsightPalette;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={
        label === 'Custom' ? 'Choose a custom goal' : `${label}-day goal`
      }
      accessibilityRole='button'
      style={{
        alignItems: 'center',
        backgroundColor: highlighted ? palette.tileBg : palette.cellEmpty,
        borderColor: highlighted ? palette.greenTint : 'transparent',
        borderRadius: borderRadius.medium,
        borderWidth: 1.5,
        flex: 1,
        justifyContent: 'center',
        minHeight: 44,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          color: highlighted ? palette.ctaGreen : palette.textPrimary,
          fontFamily: fontFamilies.primary.text,
          fontSize: 13.5,
          fontWeight: fontWeights.semibold,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
