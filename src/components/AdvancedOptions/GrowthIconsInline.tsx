/** Inline Growth Icons — stages + Themes toggle w/ Custom chip. */
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';
import {
  CUSTOM_PRESET_ID,
  matchPresetId,
  PROGRESS_EMOJI_PRESETS,
  resolveProgressEmojis,
  type ProgressEmojiSet,
} from '@/utils/progressEmojis';
import { GrowthStagePreview } from './GrowthStagePreview';
import { GrowthIconsHead } from './GrowthIconsHead';
import { GrowthIconsCustomExpand } from './GrowthIconsCustomExpand';
import { GrowthIconsMoreSection } from './GrowthIconsMoreSection';
import { InlineExpandBody } from './InlineExpandBody';
import { presetLabelFor } from './presetLabelFor';
import { useInlineExpand } from './useInlineExpand';

interface Props {
  value: ProgressEmojiSet | undefined;
  fallback: ProgressEmojiSet;
  savedCustom?: ProgressEmojiSet;
  onChange: (next: ProgressEmojiSet | undefined) => void;
}

const SPROUT_PROGRESS_EMOJIS =
  PROGRESS_EMOJI_PRESETS.find((p) => p.id === 'plants')?.emojis ??
  PROGRESS_EMOJI_PRESETS[0].emojis;

export function GrowthIconsInline({
  value,
  fallback,
  savedCustom,
  onChange,
}: Props) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const resolved = useMemo(
    () =>
      resolveProgressEmojis(
        value ?? SPROUT_PROGRESS_EMOJIS,
        value ? fallback : undefined
      ),
    [value, fallback]
  );
  const presetId = matchPresetId(resolved, savedCustom);
  const isCustom = presetId === CUSTOM_PRESET_ID || presetId === null;
  const presetLabel = presetLabelFor(presetId);
  const selectPreset = (emojis: ProgressEmojiSet) => {
    void triggerHaptic('selection');
    setCustomOpen(false);
    onChange(emojis);
  };
  const customExpand = useInlineExpand(customOpen);

  return (
    <View>
      <GrowthIconsHead presetLabel={presetLabel} starting={resolved.starting} />
      <GrowthStagePreview emojis={resolved} />
      <InlineExpandBody expand={customExpand} open={customOpen}>
        <GrowthIconsCustomExpand
          fallback={fallback}
          value={value}
          onChange={onChange}
        />
      </InlineExpandBody>
      <GrowthIconsMoreSection
        customOpen={customOpen}
        isCustom={isCustom}
        open={moreOpen}
        presetId={presetId}
        resolvedStarting={resolved.starting}
        onOpenCustom={() => {
          setMoreOpen(false);
          setCustomOpen(true);
        }}
        onSelect={selectPreset}
        onToggle={() => {
          setCustomOpen(false);
          setMoreOpen((v) => !v);
        }}
      />
    </View>
  );
}
