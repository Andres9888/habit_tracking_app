/**
 * Expanded body of the ProgressEmojiPicker: preset themes, the five per-stage
 * slot rows, and an optional reset action. Rendered inside the animated panel
 * wrapper; its onLayout feeds the expand animation's height measurement.
 */
import { Pressable, Text, View } from 'react-native';

import { useThemeColors } from '../../theme/ThemeContext';
import { fontWeights, typography } from '../../theme/typography';
import {
  STRENGTH_LEVEL_KEYS,
  type StrengthLevelKey,
} from '../../utils/progressEmojis';

import type { ProgressEmojiPanelProps } from './ProgressEmojiPicker.types';
import { ProgressEmojiPresetRow } from './ProgressEmojiPresetRow';
import { ProgressEmojiSlotRow } from './ProgressEmojiSlotRow';

const STAGE_LABELS: Record<StrengthLevelKey, string> = {
  starting: 'Starting',
  building: 'Building',
  developing: 'Developing',
  strong: 'Strong',
  automatic: 'Automatic',
};

export function ProgressEmojiPanel({
  resolved,
  activePresetId,
  customPreset,
  showReset,
  panelStyle,
  onPreset,
  onSlotPress,
  onReset,
  onLayout,
}: ProgressEmojiPanelProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='pt-3 gap-2' style={panelStyle} onLayout={onLayout}>
      <ProgressEmojiPresetRow
        activePresetId={activePresetId}
        customPreset={customPreset}
        onSelect={onPreset}
      />
      {STRENGTH_LEVEL_KEYS.map((k) => (
        <ProgressEmojiSlotRow
          key={k}
          emoji={resolved[k]}
          stageKey={k}
          stageLabel={STAGE_LABELS[k]}
          onPress={onSlotPress}
        />
      ))}
      {showReset ? (
        <Pressable
          accessibilityRole='button'
          className='mt-1 items-center py-2'
          onPress={onReset}
        >
          <Text
            style={{
              ...typography.bodySmall,
              color: themeColors.text.tertiary,
              fontWeight: fontWeights.medium,
            }}
          >
            Reset to default
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
