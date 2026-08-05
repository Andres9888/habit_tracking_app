/** Themes toggle + expand grid (7 presets + Custom) for Growth Icons. */
import { triggerHaptic } from '@/utils/haptics';
import type { ProgressEmojiSet } from '@/utils/progressEmojis';
import { GrowthIconsMoreGrid } from './GrowthIconsMoreGrid';
import { GrowthIconsMoreToggle } from './GrowthIconsMoreThemes';
import { getMoreThemes } from './growthIconsThemes';
import { InlineExpandBody } from './InlineExpandBody';
import { useInlineExpand } from './useInlineExpand';

interface Props {
  open: boolean;
  presetId: string | null;
  isCustom: boolean;
  customOpen: boolean;
  resolvedStarting: string;
  onToggle: () => void;
  onSelect: (emojis: ProgressEmojiSet) => void;
  onOpenCustom: () => void;
}

export function GrowthIconsMoreSection({
  open,
  presetId,
  isCustom,
  customOpen,
  resolvedStarting,
  onToggle,
  onSelect,
  onOpenCustom,
}: Props) {
  const moreGrid = useInlineExpand(open);
  return (
    <>
      <GrowthIconsMoreToggle
        open={open}
        onToggle={() => {
          void triggerHaptic('selection');
          onToggle();
        }}
      />
      <InlineExpandBody expand={moreGrid} open={open}>
        <GrowthIconsMoreGrid
          customOpen={customOpen}
          isCustom={isCustom}
          moreThemes={getMoreThemes()}
          presetId={presetId}
          resolvedStarting={resolvedStarting}
          onOpenCustom={onOpenCustom}
          onSelect={onSelect}
        />
      </InlineExpandBody>
    </>
  );
}
