/**
 * Chrome placeholders for the cold-start catalog: the category chip rail and
 * a section header. Padding mirrors CatalogChipRail.styles and
 * CatalogSectionList's header wrapper so nothing shifts when data arrives.
 */

import { StyleSheet, View } from 'react-native';
import { borderRadius, spacing } from '../../../theme/spacing';
import { useBrowserPalette } from '../browserPalette';
import { TEMPLATE_READ_ROW_PADDING } from './ExploreAllSection/TemplateReadRow.styles';
import { ShimmerBox } from './ShimmerBox';

// Mirrors the rendered width of "All" plus the first few category labels.
const CHIP_WIDTHS = [46, 92, 78, 86, 70, 88];

export function ChipRailSkeleton() {
  const palette = useBrowserPalette();

  return (
    <View style={[s.rail, { borderBottomColor: palette.border }]}>
      {CHIP_WIDTHS.map((width) => (
        <ShimmerBox
          key={width}
          height={30}
          style={{ borderRadius: borderRadius.full }}
          width={width}
        />
      ))}
    </View>
  );
}

export function SectionHeaderSkeleton() {
  return (
    <View style={s.headerWrap}>
      <View style={s.headerRow}>
        <ShimmerBox height={44} style={{ borderRadius: 12 }} width={44} />
        <ShimmerBox height={24} width={150} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  headerWrap: {
    marginTop: spacing.lg,
    paddingLeft: TEMPLATE_READ_ROW_PADDING,
  },
  rail: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    flexGrow: 0,
    flexShrink: 0,
    gap: spacing.sm,
    overflow: 'hidden',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
});
