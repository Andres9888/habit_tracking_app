/**
 * ClearIcon Component
 *
 * X icon for clear button in text input.
 */

import { View } from 'react-native';

import { useEmptyStateColors } from '../useEmptyStateColors';

export function ClearIcon() {
  const colors = useEmptyStateColors();

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: colors.inputBorder,
        borderRadius: 12,
        height: 20,
        justifyContent: 'center',
        width: 20,
      }}
    >
      <View
        style={{
          backgroundColor: colors.inputPlaceholder,
          height: 2,
          position: 'absolute',
          transform: [{ rotate: '45deg' }],
          width: 10,
        }}
      />
      <View
        style={{
          backgroundColor: colors.inputPlaceholder,
          height: 2,
          position: 'absolute',
          transform: [{ rotate: '-45deg' }],
          width: 10,
        }}
      />
    </View>
  );
}
