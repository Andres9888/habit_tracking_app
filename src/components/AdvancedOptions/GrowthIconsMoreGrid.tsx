/** Expanded "more themes" grid for Growth Icons — 7 presets + Custom, 2 rows of 4. */
import { View } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '@/theme/ThemeContext';
import {
  PROGRESS_EMOJI_PRESETS,
  type ProgressEmojiSet,
} from '@/utils/progressEmojis';
import { GrowthThemeChip } from './GrowthThemeChip';

interface Props {
  moreThemes: typeof PROGRESS_EMOJI_PRESETS;
  presetId: string | null;
  isCustom: boolean;
  customOpen: boolean;
  resolvedStarting: string;
  onSelect: (emojis: ProgressEmojiSet) => void;
  onOpenCustom: () => void;
}

function buildGridItems({
  moreThemes,
  presetId,
  isCustom,
  customOpen,
  resolvedStarting,
  onSelect,
  onOpenCustom,
}: Props) {
  return [
    ...moreThemes.map((p) => ({
      key: p.id,
      emoji: p.emojis.starting,
      label: p.label,
      selected: !customOpen && presetId === p.id,
      onPress: () => onSelect(p.emojis),
    })),
    {
      key: 'custom',
      emoji: isCustom && !customOpen ? resolvedStarting : '···',
      label: 'Custom',
      selected: Boolean(customOpen || isCustom),
      onPress: () => {
        void triggerHaptic('selection');
        onOpenCustom();
      },
    },
  ];
}

export function GrowthIconsMoreGrid(props: Props) {
  const { colors } = useThemeColors();
  const items = buildGridItems(props);
  const rows = [items.slice(0, 4), items.slice(4, 8)];

  return (
    <View
      style={{
        marginTop: 6,
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        gap: 6,
      }}
    >
      {rows.map((row, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 6 }}>
          {row.map((item) => (
            <View key={item.key} style={{ flex: 1 }}>
              <GrowthThemeChip
                emoji={item.emoji}
                label={item.label}
                selected={item.selected}
                onPress={item.onPress}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
