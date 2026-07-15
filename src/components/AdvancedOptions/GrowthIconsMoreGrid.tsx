/** Expanded "more themes" grid for Growth Icons. */
import { View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import {
  PROGRESS_EMOJI_PRESETS,
  type ProgressEmojiSet,
} from '@/utils/progressEmojis';
import { GrowthThemeChip } from './GrowthThemeChip';

interface Props {
  moreThemes: typeof PROGRESS_EMOJI_PRESETS;
  presetId: string | null;
  onSelect: (emojis: ProgressEmojiSet) => void;
}

export function GrowthIconsMoreGrid({ moreThemes, presetId, onSelect }: Props) {
  const { colors } = useThemeColors();
  return (
    <View
      style={{
        marginTop: 6,
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
      }}
    >
      {moreThemes.map((p) => (
        <View key={p.id} style={{ width: '48%' }}>
          <GrowthThemeChip
            emoji={p.emojis.starting}
            label={p.label}
            selected={presetId === p.id}
            onPress={() => onSelect(p.emojis)}
          />
        </View>
      ))}
    </View>
  );
}
