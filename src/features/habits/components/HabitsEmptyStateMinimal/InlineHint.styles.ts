interface BuildMyOwnCardColors {
  borderColor: string;
}

const templatesButtonBaseStyle = {
  borderRadius: 14,
  elevation: 4,
  height: 52,
  overflow: 'hidden',
  shadowColor: '#047857',
  shadowOffset: { height: 4, width: 0 },
  shadowRadius: 16,
  width: '100%',
} as const;

export const containerStyle = {
  alignItems: 'center',
  marginTop: 16,
  width: '100%',
} as const;

export const dividerStyle = {
  alignItems: 'center',
  flexDirection: 'row',
  gap: 10,
  marginBottom: 10,
  width: '100%',
} as const;

export const dividerLineStyle = { flex: 1, height: 0.5 } as const;

export const actionsColumnStyle = {
  gap: 8,
  width: '100%',
} as const;

export const buildMyOwnLabelStyle = {
  flex: 1,
  fontSize: 13,
  fontWeight: '600',
  letterSpacing: -0.1,
} as const;

export const templatesGradientStyle = {
  alignItems: 'center',
  borderRadius: 14,
  flex: 1,
  flexDirection: 'row',
  gap: 10,
  justifyContent: 'center',
  paddingHorizontal: 18,
  width: '100%',
} as const;

export const templatesLabelStyle = {
  color: '#FFFFFF',
  flex: 1,
  fontSize: 14,
  fontWeight: '700',
  letterSpacing: -0.2,
} as const;

export const badgeContainerStyle = {
  backgroundColor: 'rgba(255,255,255,0.22)',
  borderRadius: 8,
  paddingHorizontal: 9,
  paddingVertical: 3,
} as const;

export const badgeTextStyle = {
  color: '#FFFFFF',
  fontSize: 11,
  fontWeight: '800',
} as const;

export const accentStripeStyle = {
  backgroundColor: '#6EE7B7',
  borderRadius: 2,
  bottom: 0,
  left: 0,
  position: 'absolute',
  top: 0,
  width: 3.5,
} as const;

export function getBuildMyOwnCardStyle(
  pressed: boolean,
  colors: BuildMyOwnCardColors
) {
  return {
    alignItems: 'center',
    backgroundColor: pressed ? '#F5F5F4' : '#FFFFFF',
    borderColor: colors.borderColor,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    height: 44,
    overflow: 'hidden',
    paddingLeft: 16,
    paddingRight: 14,
    width: '100%',
  };
}

export function getTemplatesButtonStyle(pressed: boolean) {
  return {
    ...templatesButtonBaseStyle,
    opacity: pressed ? 0.85 : 1,
    shadowOpacity: pressed ? 0.15 : 0.3,
  };
}
