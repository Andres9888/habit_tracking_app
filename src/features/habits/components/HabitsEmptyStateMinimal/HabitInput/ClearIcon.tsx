/**
 * ClearIcon Component
 *
 * X icon for clear button in text input.
 */

import { Dimensions, View } from 'react-native';

import { COLORS } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RESPONSIVE_ICON_SIZE = Math.max(SCREEN_WIDTH * 0.04, 20);
const CROSS_WIDTH = RESPONSIVE_ICON_SIZE / 2;

export function ClearIcon() {
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: COLORS.stone200,
        borderRadius: 12,
        height: RESPONSIVE_ICON_SIZE,
        justifyContent: 'center',
        width: RESPONSIVE_ICON_SIZE,
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.stone400,
          height: 2,
          position: 'absolute',
          transform: [{ rotate: '45deg' }],
          width: CROSS_WIDTH,
        }}
      />
      <View
        style={{
          backgroundColor: COLORS.stone400,
          height: 2,
          position: 'absolute',
          transform: [{ rotate: '-45deg' }],
          width: CROSS_WIDTH,
        }}
      />
    </View>
  );
}
