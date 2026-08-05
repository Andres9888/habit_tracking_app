import { StyleSheet } from 'react-native';
import { absoluteFillObject } from '@/theme/absoluteFillObject';
import { FadeInUp } from 'react-native-reanimated';
import { colors } from '@/theme';
import { durations, enterEasing } from '../../../../theme/animations';
import { borderRadius } from '../../../../theme/spacing';

export const ENTERING = FadeInUp.duration(durations.enter).easing(enterEasing);
export const BLUR_INTENSITY = 50;
export const CAPSULE_RADIUS = 32;
export const BORDER_LIGHT = 'rgba(255,255,255,0.5)';
export const BORDER_DARK = 'rgba(55,65,81,0.35)';

export const CAPSULE_SHADOW = {
  shadowColor: colors.gray[800],
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 32,
  elevation: 8,
};

export const NOTIF_SIZE = 8;

export const styles = StyleSheet.create({
  capsuleBorder: {
    ...absoluteFillObject,
    borderRadius: CAPSULE_RADIUS,
    borderWidth: 1,
  },
  centerZone: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    overflow: 'visible',
  },
  contentRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  glassBg: {
    ...absoluteFillObject,
    borderRadius: CAPSULE_RADIUS,
    overflow: 'hidden',
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  iconTouchArea: {
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  leftZone: { alignItems: 'center' },
  notifDot: {
    backgroundColor: colors.primary[500],
    borderRadius: NOTIF_SIZE / 2,
    height: NOTIF_SIZE,
    position: 'absolute',
    right: 8,
    top: 8,
    width: NOTIF_SIZE,
  },
  rightZone: { alignItems: 'center' },
  wrapper: {
    marginHorizontal: 20,
    overflow: 'visible',
  },
});
