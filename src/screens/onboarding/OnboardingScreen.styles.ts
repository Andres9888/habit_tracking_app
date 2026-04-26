import { StyleSheet } from 'react-native';
import {
  borderRadius,
  componentSpacing,
  shadows,
  spacing,
} from '../../theme/spacing';
import { typography, fontWeights } from '../../theme/typography';

export const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderRadius: borderRadius.button,
    justifyContent: 'center',
    minHeight: componentSpacing.button.height,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    ...shadows.floatingActionButton,
  },
  actionText: {
    ...typography.button,
  },
  bottomContainer: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingBottom: spacing['3xl'],
    paddingHorizontal: spacing.xl,
  },
  container: {
    flex: 1,
  },
  ctaButtonDisabled: {
    opacity: 0.7,
  },
  dot: {
    borderRadius: borderRadius.xs,
    height: spacing.sm,
  },
  dotsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  page: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: componentSpacing.button.height,
    minWidth: componentSpacing.button.height,
  },
  skipContainer: {
    position: 'absolute',
    right: spacing.lg,
    zIndex: 10,
  },
  skipText: {
    ...typography.body,
    fontWeight: fontWeights.medium,
  },
  subtitle: {
    paddingHorizontal: spacing.base,
    textAlign: 'center',
    ...typography.body,
  },
  title: {
    marginBottom: spacing.md,
    textAlign: 'center',
    ...typography.displayLarge,
  },
  visualContainer: {
    alignItems: 'center',
    height: 280,
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
});
