import { StyleSheet } from 'react-native';
import { spacing, borderRadius, shadows } from '../../../theme/spacing';
import { fontWeights } from '../../../theme/typography';

export const styles = StyleSheet.create({
  barContainer: {
    height: 110,
    position: 'relative',
  },
  bgFill: {
    height: '100%',
    width: '100%',
  },
  bgFillWrapper: {
    bottom: 0,
    left: 0,
    opacity: 0.6,
    position: 'absolute',
    top: 0,
  },
  card: {
    ...shadows.floatingActionButton,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  contentCol: {
    flexDirection: 'column',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  iconNameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: 16,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.3125,
    lineHeight: 24,
  },
  progressFill: {
    borderRadius: borderRadius.full,
    height: '100%',
    width: '100%',
  },
  progressTrack: {
    borderRadius: borderRadius.full,
    height: 8,
    overflow: 'hidden',
    width: '100%',
  },
  valueText: {
    fontSize: 16,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.3125,
    lineHeight: 24,
  },
});
