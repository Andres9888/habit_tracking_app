/** Theme pills (7 presets + Custom) for the open Growth icons row. */
import { View } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';
import {
  PROGRESS_EMOJI_PRESETS,
  type ProgressEmojiSet,
} from '@/utils/progressEmojis';
import { GrowthThemePill } from './GrowthThemePill';

interface Props {
  presetId: string | null;
  isCustom: boolean;
  customOpen: boolean;
  resolvedStarting: string;
  onSelect: (emojis: ProgressEmojiSet) => void;
  onOpenCustom: () => void;
}

export function GrowthThemeRow({
  presetId,
  isCustom,
  customOpen,
  resolvedStarting,
  onSelect,
  onOpenCustom,
}: Props) {
  const items = [
    ...PROGRESS_EMOJI_PRESETS.map((p) => ({
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
      selected: customOpen || isCustom,
      onPress: () => {
        void triggerHaptic('selection');
        onOpenCustom();
      },
    },
  ];
  const rows = [items.slice(0, 4), items.slice(4, 8)];

  return (
    <View style={{ marginTop: 12, gap: 6 }}>
      {rows.map((row, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 6 }}>
          {row.map((item) => (
            <GrowthThemePill
              key={item.key}
              emoji={item.emoji}
              label={item.label}
              selected={item.selected}
              onPress={item.onPress}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
