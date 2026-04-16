/**
 * Styles for TemplateListCard and its sub-components.
 */

import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { typography, fontWeights } from '../../../../theme/typography';

export const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.large,
    borderWidth: 1,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    overflow: 'hidden',
    padding: spacing.base,
  },
  popularityPill: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  sciencePill: {
    backgroundColor: '#E0F2FE',
    borderColor: '#BAE6FD',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  topPickBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF9C3',
    borderColor: '#FDE68A',
    borderRadius: borderRadius.small,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  topPickAccent: { borderLeftColor: '#F59E0B', borderLeftWidth: 3 },
  contentColumn: { flex: 1, gap: spacing.xs },
  description: { ...typography.bodySmall },
  iconText: { fontSize: 22 },
  iconWrapper: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  matchRow: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  matchText: {
    ...typography.caption,
    fontWeight: fontWeights.bold,
  },
  metaLabel: {
    ...typography.caption,
    fontWeight: fontWeights.semibold,
  },
  metaPill: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  title: { ...typography.body, fontWeight: fontWeights.semibold },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  detailsRow: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
  },
  detailsLabel: { ...typography.caption, fontWeight: fontWeights.semibold },
});
