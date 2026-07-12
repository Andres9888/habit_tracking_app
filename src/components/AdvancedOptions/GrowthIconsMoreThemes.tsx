/** More themes expand + grid for Growth Icons. */
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontFamilies, fontWeights } from '@/theme/typography';
import {
  PROGRESS_EMOJI_PRESETS,
  type ProgressEmojiSet,
} from '@/utils/progressEmojis';
import { GrowthThemeChip } from './GrowthThemeChip';
import { usePressed } from './usePressed';

interface ToggleProps {
  open: boolean;
  onToggle: () => void;
}

export function GrowthIconsMoreToggle({ open, onToggle }: ToggleProps) {
  const { colors } = useThemeColors();
  const { pressed, pressProps } = usePressed();
  return (
    <Pressable
      accessibilityRole='button'
      accessibilityState={{ expanded: open }}
      {...pressProps}
      style={{
        marginTop: 8,
        minHeight: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: pressed ? colors.primary[100] : 'transparent',
      }}
      onPress={onToggle}
    >
      <Text
        style={{
          fontFamily: fontFamilies.primary.text,
          fontSize: 12,
          fontWeight: fontWeights.bold,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          color: open ? colors.text.secondary : colors.primary[700],
        }}
      >
        {open ? 'Less themes' : 'More themes'}
      </Text>
    </Pressable>
  );
}

interface GridProps {
  moreThemes: typeof PROGRESS_EMOJI_PRESETS;
  presetId: string | null;
  onSelect: (emojis: ProgressEmojiSet) => void;
}

export function GrowthIconsMoreGrid({
  moreThemes,
  presetId,
  onSelect,
}: GridProps) {
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
            emoji={p.chipEmoji ?? p.emojis.starting}
            label={p.label}
            selected={presetId === p.id}
            onPress={() => onSelect(p.emojis)}
          />
        </View>
      ))}
    </View>
  );
}
