import type { SharedValue } from 'react-native-reanimated';

export interface UseAnimatedStylesProps {
  backdropOpacity: SharedValue<number>;
  contentTranslateY: SharedValue<number>;
  contentOpacity: SharedValue<number>;
  iconScale: SharedValue<number>;
  iconGlowScale: SharedValue<number>;
  iconGlowOpacity: SharedValue<number>;
  closeButtonScale: SharedValue<number>;
  closeButtonOpacity: SharedValue<number>;
  importButtonScale: SharedValue<number>;
  customizeButtonScale: SharedValue<number>;
  checkmarkScale: SharedValue<number>;
  successPanelProgress: SharedValue<number>;
}
