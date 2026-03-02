/**
 * ClearIcon Component
 *
 * X icon for clear button in text input.
 */

import { View } from 'react-native';

interface ClearIconProps {
  backgroundColor: string;
  glyphColor: string;
}

export function ClearIcon({ backgroundColor, glyphColor }: ClearIconProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor,
        borderRadius: 12,
        height: 20,
        justifyContent: 'center',
        width: 20,
      }}
    >
      <View
        style={{
          backgroundColor: glyphColor,
          height: 2,
          position: 'absolute',
          transform: [{ rotate: '45deg' }],
          width: 10,
        }}
      />
      <View
        style={{
          backgroundColor: glyphColor,
          height: 2,
          position: 'absolute',
          transform: [{ rotate: '-45deg' }],
          width: 10,
        }}
      />
    </View>
  );
}
