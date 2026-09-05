/** Read-only 5-stage preview strip inside the open Growth icons row. */
import { Text, View } from 'react-native';
import {
  STRENGTH_LEVEL_KEYS,
  type ProgressEmojiSet,
} from '@/utils/progressEmojis';
import { OptionChip } from './panel/OptionChip';
import { OptionChipRow } from './panel/OptionChipRow';

const STAGE_LABELS = ['NEW', '', '', 'YOURS', 'STRONG'];
/** The habit's own icon stands in for the fourth stage. */
const PEAK_INDEX = 3;

interface Props {
  emojis: ProgressEmojiSet;
  /** The habit's chosen icon — replaces the fourth stage when present. */
  habitIcon?: string | null;
}

export function GrowthStageChips({ emojis, habitIcon }: Props) {
  return (
    <View accessibilityLabel='Growth stage progression preview'>
      <OptionChipRow>
        {STRENGTH_LEVEL_KEYS.map((key, i) => {
          const peak = i === PEAK_INDEX;
          const emoji = peak ? (habitIcon ?? emojis[key]) : emojis[key];
          return (
            <OptionChip
              readOnly
              key={key}
              accessibilityLabel={`Stage ${i + 1}`}
              glyph={
                <Text allowFontScaling={false} style={{ fontSize: 20 }}>
                  {emoji}
                </Text>
              }
              label={STAGE_LABELS[i]}
              selected={peak}
              value=''
            />
          );
        })}
      </OptionChipRow>
    </View>
  );
}
