import { colors as palette } from '../../../theme/colors';
import { durations, exitEasing } from '../../../theme/animations';
import { borderRadius } from '../../../theme/spacing';
import { SCALE } from '../../../constants/ui-values';

export const PRESS = {
  date: { pressScale: SCALE.pressLarge },
  today: { pressScale: SCALE.pressMedium },
} as const;
export const ENTRANCE_DURATION = durations.enter;
export const EXIT_TIMING = {
  duration: durations.transition,
  easing: exitEasing,
};
export const SLIDE_OFFSET = 16;

export const CHIP_BG = palette.streak[300];
export const CHIP_TEXT = '#3D2E00';

export const CHIP_BASE = {
  alignItems: 'center',
  borderRadius: borderRadius.full,
  flexDirection: 'row',
  paddingHorizontal: 12,
  paddingVertical: 4,
} as const;
