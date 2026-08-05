import { FadeInDown } from 'react-native-reanimated';
import { durations, enterEasing } from '../../theme/animations';

export const SCREEN_HEADER_ENTERING = FadeInDown.delay(0)
  .duration(durations.enter)
  .easing(enterEasing);
export const SCREEN_HEADER_SUBTITLE_ENTERING = FadeInDown.delay(50)
  .duration(durations.enter)
  .easing(enterEasing);
export const SCREEN_HEADER_ICON_SIZE = 24;
