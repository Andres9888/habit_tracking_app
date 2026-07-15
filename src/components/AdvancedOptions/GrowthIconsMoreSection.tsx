/** Toggle + expand grid for Growth Icons' additional themes. */
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
  onToggle: () => void;
  onSelect: (emojis: ProgressEmojiSet) => void;
}

export function GrowthIconsMoreSection({
  open,
  presetId,
  onToggle,
  onSelect,
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
          moreThemes={getMoreThemes()}
          presetId={presetId}
          onSelect={onSelect}
        />
      </InlineExpandBody>
    </>
  );
}
