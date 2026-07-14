/** Inline Growth Icons — stages + Sprout/Fire/Custom + more themes. */
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';
import {
  CUSTOM_PRESET_ID,
  matchPresetId,
  resolveProgressEmojis,
  SPROUT_PROGRESS_EMOJIS,
  type ProgressEmojiSet,
} from '@/utils/progressEmojis';
import { GrowthStagePreview } from './GrowthStagePreview';
import { GrowthIconsHead } from './GrowthIconsHead';
import { GrowthIconsCustomExpand } from './GrowthIconsCustomExpand';
import { GrowthIconsPrimaryRow } from './GrowthIconsPrimaryRow';
import {
  GrowthIconsMoreGrid,
  GrowthIconsMoreToggle,
} from './GrowthIconsMoreThemes';
import { getMoreThemes, getPrimaryThemes } from './growthIconsThemes';
import { InlineExpandBody } from './InlineExpandBody';
import { useInlineExpand } from './useInlineExpand';

interface Props {
  value: ProgressEmojiSet | undefined;
  fallback: ProgressEmojiSet;
  savedCustom?: ProgressEmojiSet;
  onChange: (next: ProgressEmojiSet | undefined) => void;
}

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
  const selectPreset = (emojis: ProgressEmojiSet) => {
    void triggerHaptic('selection');
    setCustomOpen(false);
    onChange(emojis);
  };
  const customExpand = useInlineExpand(customOpen);
  const moreGrid = useInlineExpand(moreOpen);

  return (
    <View>
      <GrowthIconsHead starting={resolved.starting} />
      <GrowthStagePreview emojis={resolved} />
      <GrowthIconsPrimaryRow
        customOpen={customOpen}
        hasValue={Boolean(value)}
        isCustom={isCustom}
        presetId={presetId}
        primaryThemes={getPrimaryThemes()}
        resolvedStarting={resolved.starting}
        onOpenCustom={() => {
          setMoreOpen(false);
          setCustomOpen(true);
        }}
        onSelectPreset={selectPreset}
      />
      <InlineExpandBody expand={customExpand} open={customOpen}>
        <GrowthIconsCustomExpand
          fallback={fallback}
          value={value}
          onChange={onChange}
        />
      </InlineExpandBody>
      <GrowthIconsMoreToggle
        open={moreOpen}
        onToggle={() => {
          void triggerHaptic('selection');
          setCustomOpen(false);
          setMoreOpen((v) => !v);
        }}
      />
      <InlineExpandBody expand={moreGrid} open={moreOpen}>
        <GrowthIconsMoreGrid
          moreThemes={getMoreThemes()}
          presetId={presetId}
          onSelect={selectPreset}
        />
      </InlineExpandBody>
    </View>
  );
}
