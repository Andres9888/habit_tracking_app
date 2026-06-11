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
    backgroundColor: '#FBBF24',
    borderColor: '#F59E0B',
    borderRadius: borderRadius.small,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  topPickAccent: {
    borderColor: '#FCD34D',
    borderWidth: 1.5,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  contentColumn: { flex: 1, gap: spacing.xs + 2 },
  description: { ...typography.bodySmall },
  iconText: { fontSize: 22 },
  iconWrapper: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 44,
    justifyContent: 'center',
    width: 44,
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
});
