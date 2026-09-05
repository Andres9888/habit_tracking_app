/** "Growth icons" panel row — stage preview, theme pills, custom builder. */
import { useMemo, useState } from 'react';
import { Text } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';
import {
  CUSTOM_PRESET_ID,
  matchPresetId,
  PROGRESS_EMOJI_PRESETS,
  resolveProgressEmojis,
  type ProgressEmojiSet,
} from '@/utils/progressEmojis';
import { GrowthIconsCustomExpand } from './GrowthIconsCustomExpand';
import { GrowthStageChips } from './GrowthStageChips';
import { GrowthThemeRow } from './GrowthThemeRow';
import { InlineExpandBody } from './InlineExpandBody';
import { HelperLine } from './panel/HelperLine';
import { PanelRow } from './panel/PanelRow';
import { presetLabelFor } from './presetLabelFor';
import { useInlineExpand } from './useInlineExpand';

const SPROUT_PROGRESS_EMOJIS =
  PROGRESS_EMOJI_PRESETS.find((p) => p.id === 'plants')?.emojis ??
  PROGRESS_EMOJI_PRESETS[0].emojis;

interface Props {
  value: ProgressEmojiSet | undefined;
  fallback: ProgressEmojiSet;
  savedCustom?: ProgressEmojiSet;
  onChange: (next: ProgressEmojiSet | undefined) => void;
  habitIcon?: string | null;
  open: boolean;
  onToggle: () => void;
  divided: boolean;
}

export function GrowthIconsRow({
  value,
  fallback,
  savedCustom,
  onChange,
  habitIcon,
  open,
  onToggle,
  divided,
}: Props) {
  const [customOpen, setCustomOpen] = useState(false);
  const customExpand = useInlineExpand(customOpen);
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

  return (
    <PanelRow
      accessibilityLabel='Growth icons'
      divided={divided}
      hint='Icon evolves as strength grows'
      hue='growth'
      icon={
        <Text allowFontScaling={false} style={{ fontSize: 16 }}>
          {resolved.starting}
        </Text>
      }
      open={open}
      title='Growth icons'
      value={{ label: presetLabelFor(presetId), set: true }}
      onToggle={onToggle}
    >
      <GrowthStageChips emojis={resolved} habitIcon={habitIcon} />
      <GrowthThemeRow
        customOpen={customOpen}
        isCustom={isCustom}
        presetId={presetId}
        resolvedStarting={resolved.starting}
        onOpenCustom={() => setCustomOpen((v) => !v)}
        onSelect={(emojis) => {
          void triggerHaptic('selection');
          setCustomOpen(false);
          onChange(emojis);
        }}
      />
      <InlineExpandBody expand={customExpand} open={customOpen}>
        <GrowthIconsCustomExpand
          fallback={fallback}
          value={value}
          onChange={onChange}
        />
      </InlineExpandBody>
      <HelperLine>YOUR HABIT ICON STANDS IN FOR THE FOURTH STAGE</HelperLine>
    </PanelRow>
  );
}
