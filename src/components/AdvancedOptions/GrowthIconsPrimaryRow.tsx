/** Sprout / Fire / Custom theme chips for Growth Icons. */
import { View } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';
import type { ProgressEmojiSet } from '@/utils/progressEmojis';
import { GrowthThemeChip } from './GrowthThemeChip';

interface Theme {
  id: string;
  label: string;
  emojis: ProgressEmojiSet;
  chipEmoji: string;
}

interface Props {
  primaryThemes: Theme[];
  customOpen: boolean;
  presetId: string | null;
  isCustom: boolean;
  resolvedStarting: string;
  hasValue: boolean;
  onSelectPreset: (emojis: ProgressEmojiSet) => void;
  onOpenCustom: () => void;
}

export function GrowthIconsPrimaryRow({
  primaryThemes,
  customOpen,
  presetId,
  isCustom,
  resolvedStarting,
  hasValue,
  onSelectPreset,
  onOpenCustom,
}: Props) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {primaryThemes.map((p) => (
        <GrowthThemeChip
          key={p.id}
          emoji={p.chipEmoji}
          label={p.label}
          selected={Boolean(!customOpen && presetId === p.id)}
          onPress={() => onSelectPreset(p.emojis)}
        />
      ))}
      <GrowthThemeChip
        emoji={isCustom && !customOpen ? resolvedStarting : '···'}
        label='Custom'
        selected={Boolean(customOpen || (isCustom && hasValue))}
        onPress={() => {
          void triggerHaptic('selection');
          onOpenCustom();
        }}
      />
    </View>
  );
}
