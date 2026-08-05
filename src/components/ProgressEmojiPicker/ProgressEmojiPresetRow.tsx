/**
 * Horizontal scrolling row of preset growth-icon themes.
 */
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useHorizontalScrollFade } from '../EmojiPickerV2/useHorizontalScrollFade';
import { useThemeColors } from '../../theme/ThemeContext';
import {
  PROGRESS_EMOJI_PRESETS,
  type ProgressEmojiPreset,
  type ProgressEmojiSet,
} from '../../utils/progressEmojis';

import { ProgressEmojiPresetChip } from './ProgressEmojiPresetChip';

const FADE_WIDTH = 28;

interface Props {
  activePresetId: string | null;
  onSelect: (next: ProgressEmojiSet) => void;
  customPreset?: ProgressEmojiPreset | null;
}

export function ProgressEmojiPresetRow({
  activePresetId,
  onSelect,
  customPreset,
}: Props) {
  const { isDark } = useThemeColors();
  const { handleScroll, showLeftFade, showRightFade } =
    useHorizontalScrollFade();

  const fadeColors = useMemo(
    (): [string, string] =>
      isDark
        ? ['rgba(31,41,55,1)', 'rgba(31,41,55,0)']
        : ['rgba(237,234,229,1)', 'rgba(237,234,229,0)'],
    [isDark]
  );

  return (
    <View style={{ position: 'relative' }}>
      <ScrollView
        horizontal
        contentContainerStyle={{
          gap: 8,
          paddingHorizontal: 4,
          paddingVertical: 4,
        }}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
      >
        {PROGRESS_EMOJI_PRESETS.map((preset) => (
          <ProgressEmojiPresetChip
            key={preset.id}
            isActive={preset.id === activePresetId}
            preset={preset}
            onPress={() => onSelect(preset.emojis)}
          />
        ))}
        {customPreset ? (
          <ProgressEmojiPresetChip
            isActive={customPreset.id === activePresetId}
            preset={customPreset}
            onPress={() => onSelect(customPreset.emojis)}
          />
        ) : null}
      </ScrollView>
      {showLeftFade ? (
        <LinearGradient
          colors={fadeColors}
          end={{ x: 1, y: 0 }}
          pointerEvents='none'
          start={{ x: 0, y: 0 }}
          style={{
            bottom: 0,
            left: 0,
            position: 'absolute',
            top: 0,
            width: FADE_WIDTH,
          }}
        />
      ) : null}
      {showRightFade ? (
        <LinearGradient
          colors={fadeColors}
          end={{ x: 0, y: 0 }}
          pointerEvents='none'
          start={{ x: 1, y: 0 }}
          style={{
            bottom: 0,
            position: 'absolute',
            right: 0,
            top: 0,
            width: FADE_WIDTH,
          }}
        />
      ) : null}
    </View>
  );
}
