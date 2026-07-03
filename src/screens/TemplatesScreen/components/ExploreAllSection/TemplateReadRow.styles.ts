/**
 * Styles for TemplateReadRow
 */

import { StyleSheet } from 'react-native';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '../../../../theme/typography';

export const s = StyleSheet.create({
  addBtn: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    flexShrink: 0,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  // Inner surface — hairline border + clipped corners for the drawer.
  card: {
    borderRadius: borderRadius.large,
    borderWidth: 1,
    overflow: 'hidden',
  },
  // Outer wrapper carries the subtle lift (shadow can't render under
  // overflow:hidden on iOS) plus the row's outer margins.
  cardWrap: {
    borderRadius: borderRadius.large,
    marginHorizontal: spacing.base,
    marginVertical: spacing.xs,
    ...shadows.subtle,
  },
  drawerBody: {
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  drawerCitation: {
    fontFamily: fontFamilies.monospace,
    fontSize: 10.5,
    marginTop: spacing.sm,
  },
  drawerLead: { ...typography.caption, lineHeight: 19 },
  drawerTakeaway: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 13.5,
    fontStyle: 'italic',
    lineHeight: 19,
    marginTop: spacing.sm,
  },
  emoji: { fontSize: 20 },
  iconBox: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    flexShrink: 0,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  info: { flex: 1, gap: spacing.xs, minWidth: 0 },
  meta: { ...typography.caption },
  name: { ...typography.body, fontWeight: fontWeights.semibold },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  toggle: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  toggleLabel: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.semibold,
  },
});
