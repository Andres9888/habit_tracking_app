import { StyleSheet } from 'react-native';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

export const AVATAR_SIZE = 96;
export const RING_STROKE = 4;

export const styles = StyleSheet.create({
  avatarEmoji: {
    fontSize: 56,
  },
  avatarInner: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  avatarRing: {
    height: AVATAR_SIZE,
    marginBottom: spacing.md,
    position: 'relative',
    width: AVATAR_SIZE,
  },
  card: {
    ...shadows.card,
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  caption: {
    ...typography.caption,
    marginTop: 4,
  },
  heading: {
    ...typography.heading1,
    textAlign: 'center',
  },
  xpPill: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  xpPillEmoji: {
    fontSize: 14,
  },
  xpPillText: {
    ...typography.bodySmall,
    fontVariant: ['tabular-nums'],
    fontWeight: '600',
  },
});
