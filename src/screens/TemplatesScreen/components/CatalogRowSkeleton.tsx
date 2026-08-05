/**
 * CatalogRowSkeleton — placeholder shaped like TemplateReadRow.
 *
 * Block sizes mirror TemplateReadRow.styles so the card occupies the same
 * height before and after data lands: no reflow when the catalog swaps in.
 * Deliberately has no entrance animation — the shimmer sweep is the only
 * motion, so a short cold load can't yank a half-played fade off screen.
 */

import { StyleSheet, View } from 'react-native';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { useBrowserPalette } from '../browserPalette';
import { TEMPLATE_READ_ROW_PADDING } from './ExploreAllSection/TemplateReadRow.styles';
import { ShimmerBox } from './ShimmerBox';

const PILL = borderRadius.full;

export function CatalogRowSkeleton() {
  const palette = useBrowserPalette();

  return (
    <View
      style={[
        s.card,
        { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      <View style={s.titleRow}>
        <ShimmerBox height={52} style={s.iconBox} width={52} />
        <View style={s.titleFill}>
          <ShimmerBox height={26} width='72%' />
        </View>
      </View>

      <View style={s.description}>
        <ShimmerBox height={19} width='100%' />
        <ShimmerBox height={19} width='84%' />
      </View>

      <ShimmerBox height={34} style={s.detailsPill} width={110} />
      <ShimmerBox height={67} style={s.startBox} width='100%' />

      <View style={s.footer}>
        <ShimmerBox height={34} style={s.pill} width={130} />
        <ShimmerBox height={34} style={s.addPill} width={96} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    ...shadows.card,
    borderRadius: 26,
    borderWidth: 1,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    padding: TEMPLATE_READ_ROW_PADDING,
  },
  addPill: { borderRadius: PILL, marginLeft: 'auto' },
  description: { gap: 6, marginTop: spacing.md },
  detailsPill: {
    alignSelf: 'flex-start',
    borderRadius: PILL,
    marginTop: spacing.md,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  iconBox: { borderRadius: borderRadius.medium },
  pill: { borderRadius: PILL },
  startBox: { borderRadius: 16, marginTop: spacing.md },
  titleFill: { flex: 1 },
  titleRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
});
