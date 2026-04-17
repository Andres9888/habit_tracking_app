import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

export const CHAIN_COLUMNS = 7;
export const CHAIN_GAP = 6;

export const styles = StyleSheet.create({
  calloutPill: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  calloutText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  card: {
    borderRadius: borderRadius.large,
    borderWidth: 1,
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    padding: spacing.base,
  },
  cell: {
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: borderRadius.xs,
    flex: 1,
    justifyContent: 'center',
  },
  cellRing: {
    borderRadius: borderRadius.xs + 2,
    borderWidth: 2,
    bottom: -2,
    left: -2,
    position: 'absolute',
    right: -2,
    top: -2,
  },
  cellWrapper: {
    flexBasis: `${100 / CHAIN_COLUMNS}%`,
    paddingBottom: CHAIN_GAP / 2,
    paddingHorizontal: CHAIN_GAP / 2,
    paddingTop: CHAIN_GAP / 2,
    position: 'relative',
  },
  checkText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -(CHAIN_GAP / 2),
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  meta: {
    ...typography.caption,
  },
  title: {
    fontFamily: 'DMSans',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.15,
    lineHeight: 22,
  },
});
