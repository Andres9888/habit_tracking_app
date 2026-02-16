/**
 * ClearIcon Component
 *
 * X icon for clear button in text input.
 */

import { View } from 'react-native';

import { COLORS } from '../constants';

export function ClearIcon() {
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: COLORS.stone200,
        borderRadius: 12,
        height: 20,
        justifyContent: 'center',
        width: 20,
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.stone400,
          height: 2,
          position: 'absolute',
          transform: [{ rotate: '45deg' }],
          width: 10,
        }}
      />
      <View
        style={{
          backgroundColor: COLORS.stone400,
          height: 2,
          position: 'absolute',
          transform: [{ rotate: '-45deg' }],
          width: 10,
        }}
      />
    </View>
  );
}
