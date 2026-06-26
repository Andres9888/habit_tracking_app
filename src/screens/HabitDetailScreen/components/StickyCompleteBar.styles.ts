/** Shared layout for the pinned StickyComplete bar + its done pill. */
import { borderRadius, spacing } from '../../../theme/spacing';

export const ABS_BOTTOM = {
  bottom: 0,
  left: 0,
  position: 'absolute',
  right: 0,
} as const;

export const BAR_ROW = {
  alignItems: 'center',
  borderRadius: borderRadius.large,
  flexDirection: 'row',
  gap: spacing.sm,
  justifyContent: 'center',
  paddingVertical: spacing.base,
} as const;

export const wrapStyle = (insetBottom: number) => ({
  marginBottom: Math.max(insetBottom, spacing.base),
  marginHorizontal: spacing.base + spacing.xs,
});

export const barShadow = (color: string) => ({
  elevation: 6,
  shadowColor: color,
  shadowOffset: { height: 6, width: 0 },
  shadowOpacity: 0.28,
  shadowRadius: 18,
});
