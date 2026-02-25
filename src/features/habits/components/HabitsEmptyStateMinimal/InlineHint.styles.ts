import { colors } from '../../../../theme/colors';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontFamilies } from '../../../../theme/typography';

const templatesButtonBaseStyle = {
  borderRadius: borderRadius.medium,
  elevation: 4,
  height: 56,
  overflow: 'hidden',
  shadowColor: colors.primary[700],
  shadowOffset: { height: 4, width: 0 },
  shadowRadius: 16,
  width: '100%',
} as const;

export const containerStyle = {
  alignItems: 'center',
  marginTop: spacing.base,
  width: '100%',
} as const;
export const dividerStyle = {
  alignItems: 'center',
  flexDirection: 'row',
  gap: 10,
  marginBottom: 12,
  width: '100%',
} as const;
export const dividerLineStyle = { flex: 1, height: 0.5 } as const;
export const dividerTextBaseStyle = {
  fontFamily: fontFamilies.primary.text,
  fontSize: 13,
  lineHeight: 18,
  textAlign: 'center',
} as const;
export const actionsColumnStyle = { gap: spacing.sm, width: '100%' } as const;

export const buildMyOwnLabelStyle = {
  flex: 1,
  fontFamily: fontFamilies.primary.text,
  fontSize: 13,
  fontWeight: '600',
  letterSpacing: -0.1,
} as const;

export const templatesGradientStyle = {
  alignItems: 'center',
  borderRadius: borderRadius.medium,
  flex: 1,
  flexDirection: 'row',
  gap: 10,
  justifyContent: 'center',
  paddingHorizontal: 18,
  width: '100%',
} as const;

export const templatesLabelStyle = {
  flex: 1,
  fontFamily: fontFamilies.primary.text,
  fontSize: 14,
  fontWeight: '700',
  letterSpacing: -0.2,
} as const;

export const badgeContainerStyle = {
  backgroundColor: 'rgba(255,255,255,0.22)',
  borderRadius: borderRadius.small,
  paddingHorizontal: 9,
  paddingVertical: 3,
} as const;

export const badgeTextStyle = {
  fontFamily: fontFamilies.primary.text,
  fontSize: 11,
  fontWeight: '800',
} as const;

export const accentStripeStyle = {
  backgroundColor: colors.primary[300],
  borderRadius: borderRadius.xs,
  bottom: 0,
  left: 0,
  position: 'absolute',
  top: 0,
  width: 3.5,
} as const;

/** Card shell — container styles only (no layout) */
const buildMyOwnShellBase = {
  borderRadius: borderRadius.medium,
  borderWidth: 1,
  elevation: 1,
  height: 48,
  overflow: 'hidden',
  shadowColor: colors.gray[900],
  shadowOffset: { height: 1, width: 0 },
  shadowOpacity: 0.06,
  shadowRadius: 3,
  width: '100%',
} as const;

/** Inner row — handles flexDirection: 'row' layout */
export const buildMyOwnRowStyle = {
  alignItems: 'center',
  flex: 1,
  flexDirection: 'row',
  gap: 10,
  paddingLeft: spacing.base,
  paddingRight: 14,
} as const;

export function getBuildMyOwnCardStyle(
  pressed: boolean,
  btnColors: { bg: string; bgPressed: string; borderColor: string }
) {
  return {
    ...buildMyOwnShellBase,
    backgroundColor: pressed ? btnColors.bgPressed : btnColors.bg,
    borderColor: btnColors.borderColor,
  };
}

export function getTemplatesButtonStyle(pressed: boolean) {
  return {
    ...templatesButtonBaseStyle,
    opacity: pressed ? 0.85 : 1,
    shadowOpacity: pressed ? 0.15 : 0.3,
  };
}
